import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { searchCampus, departments, locations, facilities, clubs } from "@/data/campus";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIT Campus Field Guide — Find anything at SIT Tumakuru" },
      { name: "description", content: "Search departments, GJCB classrooms, facilities, clubs and walking routes across Siddaganga Institute of Technology." },
      { property: "og:title", content: "SIT Campus Field Guide" },
      { property: "og:description", content: "Search departments, classrooms, facilities and routes at SIT Tumakuru." },
    ],
  }),
  component: Index,
});

const QUICK = [
  { to: "/gjcb", n: "01", title: "GJCB Block", desc: "Floor-by-floor guide for first-year students" },
  { to: "/departments", n: "02", title: "Departments", desc: "Engineering, Science & Management" },
  { to: "/map", n: "03", title: "Campus Map", desc: "Walking routes from the Main Gate" },
  { to: "/facilities", n: "04", title: "Facilities", desc: "Library, canteen, hostels, sports and more" },
  { to: "/clubs", n: "05", title: "Clubs", desc: "Technical, cultural, innovation & sports" },
  { to: "/tour", n: "06", title: "Virtual Tour", desc: "Two video walkthroughs of campus" },
] as const;

function Index() {
  const [q, setQ] = useState("");
  const hits = searchCampus(q);
  return (
    <div>
      <section className="bg-hero -mx-5 -mt-8 px-6 py-14 text-primary-foreground md:-mx-10 md:-mt-12 md:rounded-b-3xl md:px-12 md:py-20">
        <div className="eyebrow text-accent rise">Siddaganga Institute of Technology · Tumakuru</div>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.05] md:text-7xl rise">Find your way around campus.</h1>
        <p className="mt-5 max-w-xl text-primary-foreground/75 rise">Rooms, departments, hostels, the nearest ATM — and the exact walk to get there.</p>
        <div className="relative mt-8 max-w-2xl rise">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try “CSE”, “Library”, “Seminar Hall”, “Hostel”…"
            className="w-full rounded-full bg-card py-4 pl-12 pr-5 text-foreground shadow-lg outline-none ring-accent focus:ring-2"
          />
        </div>
        <dl className="mt-10 grid max-w-2xl grid-cols-4 gap-4 text-center md:text-left">
          {[["20+", "Departments"], ["A++", "NAAC"], ["Top 100", "NIRF"], ["15000+", "Students"]].map(([n, l]) => (
            <div key={l}><dt className="font-display text-2xl text-accent md:text-3xl">{n}</dt><dd className="text-xs text-primary-foreground/60">{l}</dd></div>
          ))}
        </dl>
      </section>

      {q.trim().length >= 2 && (
        <section className="mt-8 rounded-xl border bg-card p-4 shadow-card">
          <div className="eyebrow mb-3 text-muted-foreground">{hits.length} result{hits.length === 1 ? "" : "s"} for “{q}”</div>
          {hits.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Nothing matched. Try a department code like “ECE” or ask the <Link to="/assistant" className="underline">guide</Link>.</p>
          ) : (
            <ul className="divide-y">
              {hits.map((h, i) => (
                <li key={i}>
                  <Link to={h.to as "/"} params={h.params as never} search={h.search as never} className="flex items-center justify-between gap-3 py-3 hover:text-primary">
                    <div>
                      <div className="font-medium">{h.title}</div>
                      <div className="text-xs text-muted-foreground">{h.sub}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs">{h.kind}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <section className="mt-14">
        <div className="eyebrow text-accent">Start here</div>
        <div className="mt-4 grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {QUICK.map((c) => (
            <Link key={c.to} to={c.to} className="group bg-card p-6 transition-colors hover:bg-secondary">
              <div className="flex items-start justify-between">
                <span className="font-display text-sm text-accent">{c.n}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-primary">{c.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <div className="eyebrow text-muted-foreground">In this guide</div>
          <p className="mt-3 font-display text-xl text-primary">
            {departments.length} departments · {locations.length} mapped places · {facilities.length} facilities · {clubs.length} clubs
          </p>
        </div>
        <Link to="/feedback" className="rounded-xl bg-accent p-6 text-accent-foreground transition-transform hover:-translate-y-0.5">
          <div className="eyebrow">Have feedback?</div>
          <p className="mt-3 font-display text-xl">Tell us what to add or fix →</p>
        </Link>
      </section>
    </div>
  );
}
