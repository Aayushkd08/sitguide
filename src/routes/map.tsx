import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { locations, MAP_EMBED } from "@/data/campus";
import { PageHead } from "@/components/Shell";
import { LocationDetail } from "@/components/LocationCard";

export const Route = createFileRoute("/map")({
  validateSearch: (s: Record<string, unknown>) => ({ loc: typeof s.loc === "string" ? s.loc : undefined }),
  head: () => ({
    meta: [
      { title: "Campus Map & Directions — SIT Campus Field Guide" },
      { name: "description", content: "Satellite map of SIT Tumakuru with step-by-step walking routes from the Main Gate." },
      { property: "og:title", content: "SIT Tumakuru Campus Map" },
      { property: "og:description", content: "Walking distance, time and directions to every major building at SIT." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { loc } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState("");
  const list = locations.filter((l) => l.name.toLowerCase().includes(q.toLowerCase()));
  const sel = locations.find((l) => l.id === loc);
  return (
    <div>
      <PageHead eyebrow="Wayfinding" title="Campus Map" sub="Pick a destination to see walking distance, time and step-by-step directions from the Main Gate." />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border shadow-card">
            <iframe src={MAP_EMBED} title="SIT Tumakuru satellite map" className="h-[420px] w-full" allowFullScreen loading="lazy" />
          </div>
          <div className="rounded-xl border bg-card p-6">
            {sel ? <LocationDetail loc={sel} /> : <p className="py-8 text-center text-muted-foreground">Select a destination from the list to see directions.</p>}
          </div>
        </div>
        <div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a location…" className="w-full rounded-md border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" />
          </div>
          <ul className="max-h-[720px] space-y-2 overflow-y-auto pr-1">
            {list.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => navigate({ search: { loc: l.id } })}
                  className={"flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors " + (l.id === loc ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary")}
                >
                  <span className="text-2xl">{l.icon}</span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{l.name}</span>
                    <span className="block text-xs opacity-70">{l.dist} · {l.time}</span>
                  </span>
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">No location matches “{q}”.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
