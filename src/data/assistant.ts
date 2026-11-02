import { clubs, departments, facilities, floors, locations, type Department, type Location } from "./campus";

/** Rule-based campus assistant, mirroring the reference guide's local knowledge base. */
export type Reply =
  | { type: "text"; text: string }
  | { type: "location"; loc: Location }
  | { type: "department"; dept: Department }
  | { type: "list"; title: string; items: string[]; footer?: string };

export const SUGGESTIONS = [
  { label: "GJCB", q: "Route to GJCB block" },
  { label: "CSE", q: "How to reach CSE department" },
  { label: "Library", q: "Route to Central Library" },
  { label: "Canteen", q: "How to reach canteen" },
  { label: "Bank", q: "Where is Karnataka ATM" },
  { label: "Medical", q: "Route to medical centre" },
];

const HELP: Reply = {
  type: "list",
  title: "I can help with:",
  items: [
    "Departments (CSE, ISE, AIML, ECE, ETE, EEE, MECH, CIVIL, MBA, MCA, CHEM, PHY, MATH…)",
    "Locations & routes (Admin, GJCB, Library, Canteen, Hostels, Sports, Medical, Bank)",
    'GJCB rooms (e.g. "101", "Seminar Hall")',
    'Floors (e.g. "what\'s on the 4th floor?")',
    "Clubs & Facilities",
  ],
  footer: 'Try: "How do I get to CSE?" or "Where is the Karnataka ATM?"',
};

export function answer(input: string): Reply {
  const t = input.toLowerCase().trim();
  if (!t) return HELP;
  if (/\b(hi|hello|hey|hola)\b/.test(t))
    return { type: "text", text: "Hi! I'm the SIT Campus Assistant. Ask me about any department, classroom, hostel or facility — I have full route directions too!" };
  if (/(thanks|thank you|thx)/.test(t)) return { type: "text", text: "You're welcome! Anything else?" };
  if (/\b(wifi|internet)\b/.test(t)) return { type: "text", text: "Campus WiFi network: SIT-Campus — available across campus." };

  const roomM = t.match(/\b([a-z]{1,3})[-\s]?(\d{2,3})\b/i) || t.match(/\broom\s*(\d{3})\b/);
  if (roomM) {
    const code = (roomM.length > 2 && roomM[2] ? `${roomM[1]}-${roomM[2]}` : roomM[1]).toUpperCase();
    for (const f of Object.values(floors)) {
      const r = f.rooms.find((x) => x.num.toUpperCase() === code);
      if (r) return { type: "text", text: `Room ${r.num} — ${f.name} (GJCB Block). Type: ${r.type} · Name: ${r.name}` };
    }
  }

  const fm = t.match(/\b(ground|1st|2nd|3rd|4th|first|second|third|fourth)\b.*floor|floor\s*(\d)/);
  if (fm) {
    const map: Record<string, string> = { ground: "gf", first: "f1", "1st": "f1", second: "f2", "2nd": "f2", third: "f3", "3rd": "f3", fourth: "f4", "4th": "f4" };
    const f = floors[map[fm[1]] || "f" + fm[2]];
    if (f) return { type: "list", title: `${f.name} — GJCB Block`, items: [f.desc, "Rooms: " + f.rooms.map((r) => r.num).join(", ")] };
  }

  const words = t.split(/\s+/);
  for (const l of locations) {
    const hay = (l.id + " " + l.name).toLowerCase();
    if (words.some((w) => w.length >= 3 && hay.includes(w))) return { type: "location", loc: l };
  }
  for (const d of departments) {
    const hay = (d.id + " " + d.name + " " + d.short).toLowerCase();
    if (words.some((w) => w.length >= 2 && hay.split(/\s+/).includes(w)) || hay.includes(t)) return { type: "department", dept: d };
  }
  if (/\b(club|clubs|activities)\b/.test(t))
    return { type: "list", title: "Clubs at SIT", items: clubs.slice(0, 8).map((c) => `${c.emoji} ${c.name} — ${c.desc}`), footer: "Open the Clubs page for the full list." };
  if (/\b(facility|facilities)\b/.test(t))
    return { type: "list", title: "Campus Facilities", items: facilities.map((f) => `${f.name} — ${f.loc}`) };
  if (/\bprincipal\b/.test(t)) return { type: "text", text: "Principal Office — Ground Floor, GJCB Block (Room GF-01)." };
  return HELP;
}
