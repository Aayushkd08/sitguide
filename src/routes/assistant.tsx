import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { answer, SUGGESTIONS, type Reply } from "@/data/assistant";
import { PageHead } from "@/components/Shell";
import { LocationDetail } from "@/components/LocationCard";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Ask the Guide — SIT Campus Field Guide" },
      { name: "description", content: "Ask where any department, room or facility is at SIT Tumakuru and get walking directions." },
      { property: "og:title", content: "Ask the SIT Campus Guide" },
      { property: "og:description", content: "Instant answers and walking routes for SIT Tumakuru." },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user"; text: string } | { role: "bot"; reply: Reply };

function ReplyView({ r }: { r: Reply }) {
  if (r.type === "text") return <p>{r.text}</p>;
  if (r.type === "location") return <LocationDetail loc={r.loc} compact />;
  if (r.type === "department") {
    const d = r.dept;
    return (
      <div className="space-y-1 text-sm">
        <p className="font-display text-lg text-primary">{d.emoji} {d.name} ({d.short})</p>
        <p className="text-muted-foreground">{d.desc}</p>
        <p><b>Location:</b> {d.location}</p>
        <p><b>HOD:</b> {d.hod} · <b>Students:</b> {d.students ?? "—"} · <b>Founded:</b> {d.founded}</p>
        <p><b>Labs:</b> {d.labs}</p>
        <Link to="/departments/$id" params={{ id: d.id }} className="inline-block pt-1 font-semibold text-primary underline">Open department</Link>
      </div>
    );
  }
  return (
    <div className="text-sm">
      <p className="font-semibold">{r.title}</p>
      <ul className="mt-1 list-disc space-y-0.5 pl-5">{r.items.map((i) => <li key={i}>{i}</li>)}</ul>
      {r.footer && <p className="mt-2 italic text-muted-foreground">{r.footer}</p>}
    </div>
  );
}

function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", reply: { type: "text", text: "Hi! I'm the SIT Campus Assistant. Ask me about any classroom, department or facility." } }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [msgs, typing]);

  const send = (q: string) => {
    const text = q.trim();
    if (!text || typing) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", reply: answer(text) }]);
    }, 500);
  };

  return (
    <div>
      <PageHead eyebrow="Assistant" title="Ask the Guide" sub="Ask in plain words — “Where is the library?”, “What's on the 2nd floor?”, “Route to the hostel”." />
      <div className="flex h-[70vh] flex-col overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end"><div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground">{m.text}</div></div>
            ) : (
              <div key={i} className="max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-3 text-sm"><ReplyView r={m.reply} /></div>
            ),
          )}
          {typing && <div className="w-16 rounded-2xl bg-secondary px-4 py-3 text-center text-sm tracking-widest text-muted-foreground">•••</div>}
          <div ref={end} />
        </div>
        <div className="flex flex-wrap gap-2 border-t px-4 pt-3">
          {SUGGESTIONS.map((s) => <button key={s.label} onClick={() => send(s.q)} className="rounded-full border px-3 py-1 text-xs hover:border-primary">{s.label}</button>)}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 p-4">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about campus locations…" className="flex-1 rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary" />
          <button aria-label="Send" className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground"><Send className="h-4 w-4" /></button>
        </form>
      </div>
    </div>
  );
}
