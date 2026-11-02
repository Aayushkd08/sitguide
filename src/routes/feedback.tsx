import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHead } from "@/components/Shell";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback — SIT Campus Field Guide" },
      { name: "description", content: "Tell us what worked, what didn't and what to add to the SIT campus guide." },
      { property: "og:title", content: "Share feedback on the SIT Campus Guide" },
      { property: "og:description", content: "Help improve the SIT Tumakuru campus guide." },
    ],
  }),
  component: Feedback,
});

export const isValidPhone = (p: string) => /^[6-9]\d{9}$/.test(p.trim());

function Feedback() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState<{ name?: string; phone?: string; msg?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: { name?: string; phone?: string; msg?: string } = {};
    if (name.trim().length < 2) er.name = "Please enter your name";
    if (!isValidPhone(phone)) er.phone = "Enter a valid 10-digit mobile number";
    if (msg.trim().length < 3) er.msg = "Please enter at least a few words of feedback";
    setErr(er);
    if (Object.keys(er).length) return;
    const all = JSON.parse(localStorage.getItem("sit_feedback") || "[]");
    all.push({ name: name.trim(), phone: phone.trim(), message: msg.trim(), at: new Date().toISOString() });
    localStorage.setItem("sit_feedback", JSON.stringify(all));
    setMsg("");
    toast.success("Thank you! Feedback submitted.");
  };

  const field = "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";
  return (
    <div className="max-w-2xl">
      <PageHead eyebrow="Help us improve" title="Share your feedback" sub="We read every message. Help us make the SIT Campus Guide better." />
      <form onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-6" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-medium">Full name
            <input value={name} onChange={(e) => setName(e.target.value)} className={field + " mt-1.5"} />
            {err.name && <span className="mt-1 block text-xs text-destructive">{err.name}</span>}
          </label>
          <label className="block text-sm font-medium">Phone number
            <input value={phone} inputMode="numeric" maxLength={10} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} className={field + " mt-1.5"} />
            {err.phone && <span className="mt-1 block text-xs text-destructive">{err.phone}</span>}
          </label>
        </div>
        <label className="block text-sm font-medium">Your feedback
          <textarea rows={6} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="What worked? What didn't? What should we add?" className={field + " mt-1.5"} />
          {err.msg && <span className="mt-1 block text-xs text-destructive">{err.msg}</span>}
        </label>
        <button className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Submit feedback</button>
      </form>
    </div>
  );
}
