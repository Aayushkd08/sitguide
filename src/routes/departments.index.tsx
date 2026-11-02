import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { departments } from "@/data/campus";
import { Chips, PageHead } from "@/components/Shell";

export const Route = createFileRoute("/departments/")({
  head: () => ({
    meta: [
      { title: "Departments — SIT Campus Field Guide" },
      { name: "description", content: "All engineering, science and management departments at SIT Tumakuru with HODs, labs and locations." },
      { property: "og:title", content: "Departments at SIT Tumakuru" },
      { property: "og:description", content: "HODs, labs, student counts and locations for every SIT department." },
    ],
  }),
  component: Departments,
});

type Cat = "all" | "engineering" | "science" | "management";

function Departments() {
  const [cat, setCat] = useState<Cat>("all");
  const list = cat === "all" ? departments : departments.filter((d) => d.cat === cat);
  return (
    <div>
      <PageHead eyebrow="Academics" title="Departments" sub="Explore all departments at Siddaganga Institute of Technology." />
      <Chips value={cat} onChange={setCat} options={[{ v: "all", label: "All" }, { v: "engineering", label: "Engineering" }, { v: "science", label: "Science" }, { v: "management", label: "Management" }]} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => (
          <Link key={d.id} to="/departments/$id" params={{ id: d.id }} className="group overflow-hidden rounded-xl border bg-card shadow-card transition-transform hover:-translate-y-1">
            <div className="flex aspect-[16/10] items-center justify-center overflow-hidden bg-secondary text-5xl">
              {d.image ? <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : d.emoji}
            </div>
            <div className="p-5">
              <div className="eyebrow text-accent">{d.short}</div>
              <h2 className="mt-1 text-xl font-semibold leading-snug text-primary">{d.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{d.location}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
