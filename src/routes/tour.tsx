import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { tours } from "@/data/campus";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/tour")({
  head: () => ({
    meta: [
      { title: "Virtual Campus Tour — SIT Campus Field Guide" },
      { name: "description", content: "Watch west and east video walkthroughs of the SIT Tumakuru campus." },
      { property: "og:title", content: "Virtual Tour of SIT Tumakuru" },
      { property: "og:description", content: "Two video walkthroughs covering the main buildings at SIT." },
    ],
  }),
  component: Tour,
});

function Tour() {
  const [id, setId] = useState(tours[0]!.id);
  const t = tours.find((x) => x.id === id)!;
  return (
    <div>
      <PageHead eyebrow="Explore remotely" title="Virtual Tour" sub="Explore SIT campus from wherever you are." />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="overflow-hidden rounded-xl bg-ink-deep">
          <video key={t.url} src={t.url} controls className="aspect-video w-full" title={t.title} />
          <div className="p-5 text-primary-foreground">
            <h2 className="text-2xl font-semibold">{t.title}</h2>
            <p className="mt-1 text-sm opacity-75">{t.desc}</p>
          </div>
        </div>
        <div className="space-y-3">
          {tours.map((x, i) => (
            <button key={x.id} onClick={() => setId(x.id)} className={"w-full rounded-xl border p-4 text-left transition-colors " + (x.id === id ? "border-primary bg-secondary" : "bg-card hover:border-primary")}>
              <div className="eyebrow text-accent">Part {i + 1}</div>
              <div className="font-display text-lg text-primary">{x.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{x.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
