import raw from "./campus.json";

export type Department = {
  id: string;
  name: string;
  short: string;
  cat: "engineering" | "science" | "management";
  emoji: string;
  desc: string;
  location: string;
  hod: string;
  students?: number;
  labs: string;
  founded: number;
  image?: string;
  faculty?: { name: string; contact?: string; email?: string };
};
export type Location = {
  id: string;
  name: string;
  icon: string;
  cat: string;
  desc: string;
  dist: string;
  time: string;
  steps: string[];
};
export type Club = { name: string; cat: string; emoji: string; color: string; desc: string; contact: string };
export type Facility = { name: string; icon: string; color: string; loc: string; desc: string; image?: string };
export type Room = { num: string; name: string; type: string };
export type Floor = { name: string; icon: string; desc: string; rooms: Room[]; tags: string[] };
export type Tour = { id: string; url: string; title: string; desc: string };

const data = raw as unknown as {
  departments: Department[];
  locations: Location[];
  clubs: Club[];
  facilities: Facility[];
  floors: Record<string, Floor>;
  tours: Tour[];
};

export const departments = data.departments;
export const locations = data.locations;
export const clubs = data.clubs;
export const facilities = data.facilities;
export const floors = data.floors;
export const tours = data.tours;

export const GJCB_OVERVIEW = [
  { label: "Location", value: "Near Main Gate" },
  { label: "Floors", value: "4 Floors" },
  { label: "Classrooms", value: "30+ Rooms" },
  { label: "Access", value: "2 Staircases + Ramp" },
  { label: "Open", value: "8 AM – 6 PM" },
];

export const MAP_EMBED = "https://maps.google.com/maps?q=13.3269794,77.1262445&t=k&z=18&output=embed";

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export type SearchHit = { kind: string; title: string; sub: string; to: string; params?: Record<string, string>; search?: Record<string, string> };

export function searchCampus(q: string): SearchHit[] {
  const t = q.trim().toLowerCase();
  if (t.length < 2) return [];
  const has = (...f: (string | undefined)[]) => f.some((x) => x?.toLowerCase().includes(t));
  const hits: SearchHit[] = [];
  departments.forEach((d) => {
    if (has(d.name, d.short, d.desc, d.labs, d.hod, d.location))
      hits.push({ kind: "Department", title: `${d.name} (${d.short})`, sub: d.location, to: "/departments/$id", params: { id: d.id } });
  });
  locations.forEach((l) => {
    if (has(l.name, l.desc, l.id))
      hits.push({ kind: "Map", title: l.name, sub: `${l.dist} · ${l.time}`, to: "/map", search: { loc: l.id } });
  });
  facilities.forEach((f) => {
    if (has(f.name, f.desc, f.loc)) hits.push({ kind: "Facility", title: f.name, sub: f.loc, to: "/facilities" });
  });
  clubs.forEach((c) => {
    if (has(c.name, c.desc, c.cat)) hits.push({ kind: "Club", title: c.name, sub: c.cat, to: "/clubs" });
  });
  Object.entries(floors).forEach(([k, f]) =>
    f.rooms.forEach((r) => {
      if (has(r.num, r.name, r.type))
        hits.push({ kind: "GJCB Room", title: `${r.num} — ${r.name}`, sub: f.name, to: "/gjcb", search: { floor: k } });
    }),
  );
  return hits.slice(0, 40);
}
