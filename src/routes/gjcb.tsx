import { createFileRoute, Link } from "@tanstack/react-router";
import { floors, GJCB_OVERVIEW } from "@/data/campus";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/gjcb")({
  validateSearch: (s: Record<string, unknown>) => ({ floor: typeof s["floor"] === "string" ? s["floor"] : undefined }),
  head: () => ({
    meta: [
      { title: "GJCB Block Floor Guide — SIT Campus Field Guide" },
      { name: "description", content: "Floor-by-floor classroom guide to the GJCB Block, the first-year hub at SIT Tumakuru." },
      { property: "og:title", content: "GJCB Block — First Year Hub" },
      { property: "og:description", content: "Every classroom, lab and seminar hall in the GJCB Block, floor by floor." },
    ],
  }),
  component: Gjcb,
});

function Gjcb() {
  const { floor } = Route.useSearch();
  const keys = Object.keys(floors);
  const active = floor && floors[floor] ? floor : keys[0]!;
  const f = floors[active]!;
  return (
    <div>
      <PageHead eyebrow="First Year Hub" title="GJCB Block" sub="Detailed floor-by-floor guide — find your classroom instantly." />
      <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-5">
        {GJCB_OVERVIEW.map((o) => (
          <div key={o.label} className="bg-card p-4">
            <div className="eyebrow text-muted-foreground">{o.label}</div>
            <div className="mt-1 font-display text-lg text-primary">{o.value}</div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div className="flex gap-2 md:flex-col-reverse">
          {keys.map((k) => (
            <Link
              key={k}
              to="/gjcb"
              search={{ floor: k }}
              className={"flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors md:flex-none " + (k === active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary")}
            >
              {floors[k]!.name}
            </Link>
          ))}
          <p className="hidden text-xs text-muted-foreground md:block">Floors stacked as in the building ↑</p>
        </div>
        <div key={active} className="rise rounded-xl border bg-card p-6">
          <h2 className="text-3xl font-semibold text-primary">{f.icon} {f.name}</h2>
          <p className="mt-2 text-muted-foreground">{f.desc}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {f.rooms.map((r) => (
              <div key={r.num} className="rounded-lg border-l-4 border-accent bg-secondary p-4">
                <div className="font-display text-lg font-semibold text-primary">{r.num}</div>
                <div className="text-sm">{r.name}</div>
                <div className="mt-1 text-xs text-muted-foreground">{r.type}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {f.tags.map((t) => <span key={t} className="rounded-full border px-3 py-1 text-xs">{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
