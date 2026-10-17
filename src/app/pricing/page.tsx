import PricingClient from "@/components/PricingClient";
import SingleAnalysisPurchase from "@/components/SingleAnalysisPurchase";
import { singleAnalysisEnabled } from "@/lib/purchase-policy";
export const dynamic = "force-dynamic";
export default function PricingPage() {
  const purchaseAction = singleAnalysisEnabled()
    ? <SingleAnalysisPurchase />
    : <p role="status">Single analysis purchases are not available yet. You can still use your free monthly allowance.</p>;
  return <PricingClient purchaseAction={purchaseAction} />;
}
