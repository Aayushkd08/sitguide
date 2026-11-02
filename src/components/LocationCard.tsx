import type { Location } from "@/data/campus";
import { Clock, Footprints } from "lucide-react";

export function LocationDetail({ loc, compact }: { loc: Location; compact?: boolean }) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{loc.icon}</span>
        <div>
          <h3 className={compact ? "text-lg font-semibold text-primary" : "text-2xl font-semibold text-primary"}>{loc.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{loc.desc}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1"><Footprints className="h-3 w-3" />{loc.dist}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1"><Clock className="h-3 w-3" />{loc.time}</span>
      </div>
      <ol className="mt-4 space-y-2">
        {loc.steps.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">{i + 1}</span>
            <span className="pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
