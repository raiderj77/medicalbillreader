import { permanentRedirect } from "next/navigation";

// The former page exposed process-local counters as if they were durable,
// site-wide evidence. Preserve the public URL while sending readers to the
// transparent description of what the service does and does not measure.
export default function StatsPage() {
  permanentRedirect("/methodology");
}
