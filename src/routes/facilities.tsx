import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { facilities } from "@/data/campus";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Campus Facilities — SIT Campus Field Guide" },
      { name: "description", content: "Library, canteen, hostels, sports complex, medical centre, bank and more at SIT Tumakuru." },
      { property: "og:title", content: "Facilities at SIT Tumakuru" },
      { property: "og:description", content: "Everything you need for campus life at SIT, and where to find it." },
    ],
  }),
  component: Facilities,
});

function Facilities() {
  return (
    <div>
      <PageHead eyebrow="Campus life" title="Facilities" sub="Everything you need for a comfortable campus life at SIT." />
      <div className="space-y-4">
        {facilities.map((f, i) => (
          <article key={f.name} className="grid overflow-hidden rounded-xl border bg-card sm:grid-cols-[220px_1fr]">
            {f.image ? <img src={f.image} alt={f.name} loading="lazy" className="h-44 w-full object-cover sm:h-full" /> : <div className="h-44 bg-secondary" />}
            <div className="flex flex-col justify-center p-6">
              <div className="eyebrow text-accent">{String(i + 1).padStart(2, "0")}</div>
              <h2 className="mt-1 text-2xl font-semibold text-primary">{f.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium"><MapPin className="h-3 w-3 text-accent" />{f.loc}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
