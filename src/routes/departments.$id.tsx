import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { departments, locations } from "@/data/campus";
import { LocationDetail } from "@/components/LocationCard";

export const Route = createFileRoute("/departments/$id")({
  loader: ({ params }) => {
    const dept = departments.find((d) => d.id === params.id);
    if (!dept) throw notFound();
    return { dept };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.dept.name} — SIT Campus Field Guide` },
          { name: "description", content: loaderData.dept.desc },
          { property: "og:title", content: `${loaderData.dept.name} (${loaderData.dept.short}) at SIT` },
          { property: "og:description", content: loaderData.dept.desc },
        ]
      : [{ title: "Department unavailable" }, { name: "robots", content: "noindex" }],
  }),
  component: DeptPage,
});

function DeptPage() {
  const { dept: d } = Route.useLoaderData();
  const loc = locations.find((l) => l.id === d.id);
  const facts = [
    ["Short name", d.short],
    ["Established", String(d.founded)],
    ["HOD", d.hod],
    ["Location", d.location],
    ["Students", d.students ? String(d.students) : "—"],
  ];
  return (
    <div>
      <Link to="/departments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />All departments</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="rise">
          <div className="eyebrow text-accent">{d.cat}</div>
          <h1 className="mt-2 text-4xl font-semibold text-primary md:text-5xl">{d.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{d.desc}</p>
          {d.image ? (
            <img src={d.image} alt={d.name} className="mt-6 aspect-[16/9] w-full rounded-xl object-cover" />
          ) : (
            <div className="mt-6 flex aspect-[16/9] items-center justify-center rounded-xl bg-secondary text-7xl">{d.emoji}</div>
          )}
        </div>
        <div className="space-y-5">
          <dl className="divide-y rounded-xl border bg-card">
            {facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-3 text-sm">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
            <div className="px-5 py-3 text-sm">
              <dt className="text-muted-foreground">Labs</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {d.labs.split(",").map((l) => <span key={l} className="rounded-full bg-secondary px-3 py-1 text-xs">{l.trim()}</span>)}
              </dd>
            </div>
          </dl>
          {d.faculty && (
            <div className="rounded-xl bg-primary p-5 text-primary-foreground">
              <div className="eyebrow text-accent">Faculty contact</div>
              <p className="mt-2 font-display text-xl">{d.faculty.name}</p>
              {d.faculty.contact && <a href={`tel:${d.faculty.contact.replace(/\s/g, "")}`} className="mt-2 flex items-center gap-2 text-sm"><Phone className="h-4 w-4" />{d.faculty.contact}</a>}
              {d.faculty.email && <a href={`mailto:${d.faculty.email}`} className="mt-1 flex items-center gap-2 text-sm"><Mail className="h-4 w-4" />{d.faculty.email}</a>}
            </div>
          )}
          {loc && (
            <div className="rounded-xl border bg-card p-5">
              <div className="eyebrow mb-3 text-muted-foreground">How to get here</div>
              <LocationDetail loc={loc} compact />
              <Link to="/map" search={{ loc: loc.id }} className="mt-4 inline-block text-sm font-semibold text-primary underline">Open on campus map</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
