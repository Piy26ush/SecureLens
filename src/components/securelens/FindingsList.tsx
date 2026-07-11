import type { Finding } from "@/lib/api";
import { FindingCard, severityRank } from "./FindingCard";

interface Props {
  findings: Finding[];
}

export function FindingsList({ findings }: Props) {
  const sorted = [...findings].sort(
    (a, b) => severityRank(String(a.severity)) - severityRank(String(b.severity))
  );
  return (
    <div className="space-y-2.5">
      {sorted.map((f, i) => (
        <FindingCard key={i} finding={f} index={i} defaultOpen={i === 0} />
      ))}
    </div>
  );
}
