import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Synthetic medical bill and EOB example with reconciled amounts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rows = [
  ["Provider charge", "$300"],
  ["Plan adjustment", "−$120"],
  ["Allowed amount", "$180"],
  ["Plan payment", "−$120"],
  ["Illustrated responsibility", "$60"],
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #f0fdfa 0%, #f8fafc 55%, #fff7ed 100%)",
          color: "#0f172a",
          padding: "52px 64px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#115e59" }}>
            Medical Bill Reader
          </div>
          <div
            style={{
              display: "flex",
              border: "3px solid #b45309",
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: 20,
              fontWeight: 900,
              color: "#92400e",
              background: "#fef3c7",
            }}
          >
            SYNTHETIC • NO UPLOAD
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, gap: 46, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "49%" }}>
            <div style={{ fontSize: 50, lineHeight: 1.08, fontWeight: 900 }}>
              See how a bill and EOB fit together
            </div>
            <div style={{ marginTop: 24, fontSize: 25, lineHeight: 1.35, color: "#334155" }}>
              A fully fabricated, plain-English walkthrough with questions to verify.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "47%",
              border: "3px solid #0f766e",
              borderRadius: 22,
              background: "white",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                background: "#ccfbf1",
                padding: "18px 24px",
                fontSize: 22,
                fontWeight: 900,
                color: "#134e4a",
              }}
            >
              <span>FABRICATED EOB</span>
              <span>EXAMPLE</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "12px 24px" }}>
              {rows.map(([label, amount], index) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "11px 0",
                    borderBottom: index === rows.length - 1 ? "none" : "2px solid #e2e8f0",
                    fontSize: index === rows.length - 1 ? 22 : 19,
                    fontWeight: index === rows.length - 1 ? 900 : 600,
                    color: index === rows.length - 1 ? "#115e59" : "#334155",
                  }}
                >
                  <span>{label}</span>
                  <span>{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
