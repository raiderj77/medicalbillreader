import { beforeEach, describe, expect, it, vi } from "vitest";
import sharp from "sharp";
import { readFileSync } from "node:fs";
import { preflightUpload } from "@/lib/input-preflight";
import { validateUpload } from "@/lib/upload-validation";
import * as cost from "@/lib/analysis-cost";

function pdf(pages: number, text = "Synthetic test") {
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Kids [${Array.from({length:pages},(_,i)=>`${4+i*2} 0 R`).join(" ")}] /Count ${pages} >>`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  for(let n=0;n<pages;n++) {
    const stream = `BT /F1 0.001 Tf 10 100 Td ${text.match(/.{1,1000}/g)!.map(line=>`(${line}) Tj 0 -0.001 Td`).join(" ")} ET`;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 300] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5+n*2} 0 R >>`, `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
  }
  let raw="%PDF-1.4\n";const offsets=[0];
  objects.forEach((obj,i)=>{offsets.push(Buffer.byteLength(raw));raw+=`${i+1} 0 obj\n${obj}\nendobj\n`;});
  const xref=Buffer.byteLength(raw);
  raw+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>`${String(n).padStart(10,"0")} 00000 n \n`).join("")+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return {mediaType:"application/pdf",data:Buffer.from(raw).toString("base64")};
}
describe("local input preflight without provider calls",()=>{
  beforeEach(()=>vi.restoreAllMocks());
  it("reads a real synthetic PDF locally",async()=>{
    const network=vi.spyOn(globalThis,"fetch").mockRejectedValue(new Error("NETWORK_FORBIDDEN"));
    await expect(preflightUpload(pdf(2))).resolves.toMatchObject({mediaType:"application/pdf"});
    expect(network).not.toHaveBeenCalled();
  });
  it.each([pdf(11),pdf(1,"X".repeat(120001))])("rejects page or text overflow locally",async(upload)=>{
    const network=vi.spyOn(globalThis,"fetch").mockRejectedValue(new Error("NETWORK_FORBIDDEN"));
    const outcome = await preflightUpload(upload).then(()=>"ACCEPTED",(error: Error)=>error.message);
    expect(outcome).toMatch(/splitting/);
    expect(network).not.toHaveBeenCalled();
  });
  it("rejects 11 photo inputs before any provider call",()=>{
    const network=vi.spyOn(globalThis,"fetch");
    expect(()=>validateUpload({images:Array(11).fill("synthetic")})).toThrow(/splitting/);
    expect(network).not.toHaveBeenCalled();
  });
  it("resizes and reencodes a synthetic photo locally",async()=>{
    const raw=await sharp({create:{width:2000,height:1000,channels:3,background:"white"}}).png().toBuffer();
    const result=await preflightUpload({mediaType:"image/png",data:raw.toString("base64")});
    const info=await sharp(Buffer.from(result.data,"base64")).metadata();
    expect(info.width).toBe(1024);expect(info.height).toBe(512);expect(info.exif).toBeUndefined();
  });
  it("rejects corrupt documents",async()=>{await expect(preflightUpload({mediaType:"application/pdf",data:Buffer.from("%PDF-invalid").toString("base64")})).rejects.toThrow(/safely inspected/);});
});

describe("cost-planning-estimate-consistency (not a ceiling proof)",()=>{
  it("pins inputs, model and list-price assumptions for conscious review",()=>{
    expect([cost.ANALYSIS_MODEL,cost.MAX_OUTPUT_TOKENS,cost.MAX_PDF_PAGES,cost.MAX_IMAGES,cost.MAX_PDF_TEXT_CHARACTERS,cost.MAX_IMAGE_DIMENSION,cost.INPUT_USD_PER_MILLION,cost.OUTPUT_USD_PER_MILLION,cost.PLANNING_TEXT_TOKENS_PER_PDF_PAGE]).toEqual(["claude-sonnet-4-6",2000,10,10,120000,1024,3,15,3000]);
  });
  it("logs numeric usage only, and alerts on expensive responses",()=>{
    const log=vi.spyOn(console,"error").mockImplementation(()=>{});
    vi.stubEnv("COST_ALERT_THRESHOLD_USD","1.00");
    cost.recordAnalysisUsage({model:cost.ANALYSIS_MODEL,usage:{input_tokens:10000,output_tokens:1000},content:[{text:"PRIVATE_DOCUMENT_MARKER"}]});
    expect(log).toHaveBeenCalledWith(expect.stringContaining('"computed_usd":0.045'));
    expect(JSON.stringify(log.mock.calls)).not.toContain("PRIVATE_DOCUMENT_MARKER");
    expect(JSON.stringify(log.mock.calls)).not.toContain("analysis_cost_anomaly");
    cost.recordAnalysisUsage({usage:{input_tokens:400000,output_tokens:2000}});
    expect(log).toHaveBeenCalledWith(expect.stringContaining('"severity":"high"'));
    vi.unstubAllEnvs();log.mockRestore();
  });
  it("does not invent zero cost from missing usage",()=>{
    const log=vi.spyOn(console,"error").mockImplementation(()=>{});
    cost.recordAnalysisUsage({});expect(log).toHaveBeenCalledWith("[security] analysis_usage_unavailable");log.mockRestore();
  });
});
it("keeps disclaimers at pricing, upload and results",()=>{
  const pricing=readFileSync("src/components/PricingClient.tsx","utf8");
  const analyzer=readFileSync("src/components/BillAnalyzer.tsx","utf8");
  for(const phrase of ["educational purposes only","not professional billing, medical, or legal advice","Verify with your provider/insurer"]){
    expect(pricing.toLowerCase()).toContain(phrase.toLowerCase());
    expect(analyzer.toLowerCase().split(phrase.toLowerCase()).length-1).toBeGreaterThanOrEqual(2);
  }
  const client=pricing+readFileSync("src/components/SingleAnalysisPurchase.tsx","utf8");
  expect(client).not.toMatch(/ENABLE_SINGLE_ANALYSIS|ENABLE_NEW_SUBSCRIPTIONS/);
});

vi.mock("@/lib/entitlement", () => ({ reserveRequestEntitlement: vi.fn(async()=>({key:"synthetic",kind:"paid"})), releaseEntitlement: vi.fn(), commitEntitlement: vi.fn(), EntitlementTemporarilyUnavailableError: class extends Error {} }));
vi.mock("@/lib/rate-limit", () => ({enforceRateLimit: vi.fn(async()=>true)}));
it.each(["pages","characters","images"])("route rejects excessive %s before any Anthropic request", async(kind)=>{
  const { POST } = await import("@/app/api/analyze/route");
  const { NextRequest } = await import("next/server");
  const network=vi.spyOn(globalThis,"fetch").mockRejectedValue(new Error("NETWORK_FORBIDDEN"));
  const document=kind==="pages"?pdf(11):pdf(1,"X".repeat(120001));
  const body=kind==="images"?{images:Array(11).fill("synthetic")}:{image:`data:application/pdf;base64,${document.data}`,fileType:"application/pdf",processingAcknowledged:true};
  const response=await POST(new NextRequest("https://medicalbillreader.com/api/analyze",{method:"POST",body:JSON.stringify(body)}));
  expect(response.status).toBe(400);expect((await response.json()).error).toMatch(/splitting/);
  expect(network).not.toHaveBeenCalled();network.mockRestore();
});
