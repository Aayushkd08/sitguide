import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { clubs } from "@/data/campus";
import { Chips, PageHead } from "@/components/Shell";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Clubs & Activities — SIT Campus Field Guide" },
      { name: "description", content: "Technical, cultural, innovation and sports clubs at SIT Tumakuru with contact emails." },
      { property: "og:title", content: "Clubs at SIT Tumakuru" },
      { property: "og:description", content: "Find a community at SIT — technical, cultural, innovation and sports clubs." },
    ],
  }),
  component: Clubs,
});

type Cat = "all" | "technical" | "cultural" | "innovation" | "sports";

function Clubs() {
  const [cat, setCat] = useState<Cat>("all");
  const list = cat === "all" ? clubs : clubs.filter((c) => c.cat === cat);
  return (
    <div>
      <PageHead eyebrow="Beyond academics" title="Clubs & Activities" sub="Join a community, explore your passion, grow beyond academics." />
      <Chips value={cat} onChange={setCat} options={[{ v: "all", label: "All Clubs" }, { v: "technical", label: "Technical" }, { v: "cultural", label: "Cultural" }, { v: "innovation", label: "Innovation" }, { v: "sports", label: "Sports" }]} />
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((c) => (
          <article key={c.name} className="flex gap-4 rounded-xl border bg-card p-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-secondary text-3xl">{c.emoji}</div>
            <div className="min-w-0">
              <div className="eyebrow text-accent">{c.cat}</div>
              <h2 className="text-xl font-semibold text-primary">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              <a href={`mailto:${c.contact}`} className="mt-2 inline-flex items-center gap-1 break-all text-xs font-medium hover:text-primary"><Mail className="h-3 w-3" />{c.contact}</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
