import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Building2, Compass, Layers, Map, MessageCircle, MessagesSquare, Menu, PlayCircle, Sparkles, Users, X } from "lucide-react";

const NAV = [
  { to: "/", label: "Overview", icon: Compass },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/gjcb", label: "GJCB Block", icon: Layers },
  { to: "/map", label: "Campus Map", icon: Map },
  { to: "/facilities", label: "Facilities", icon: Sparkles },
  { to: "/clubs", label: "Clubs", icon: Users },
  { to: "/tour", label: "Virtual Tour", icon: PlayCircle },
  { to: "/assistant", label: "Ask the Guide", icon: MessagesSquare },
  { to: "/feedback", label: "Feedback", icon: MessageCircle },
] as const;

function NavList({ onPick }: { onPick?: () => void }) {
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onPick}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{ className: "bg-sidebar-accent !text-sidebar-primary font-semibold" }}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="block">
      <div className="eyebrow text-sidebar-primary">Field Guide</div>
      <div className="font-display text-2xl leading-tight text-sidebar-foreground">SIT Tumakuru</div>
      <div className="text-xs text-sidebar-foreground/60">Siddaganga Institute of Technology</div>
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between bg-sidebar p-6 lg:flex">
        <div className="space-y-8">
          <Brand />
          <NavList />
        </div>
        <p className="text-xs italic text-sidebar-foreground/50">“Work is Worship”</p>
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between bg-sidebar px-4 py-3 lg:hidden">
        <Brand />
        <button aria-label="Menu" onClick={() => setOpen((o) => !o)} className="text-sidebar-foreground">
          {open ? <X /> : <Menu />}
        </button>
      </header>
      {open && (
        <div className="fixed inset-x-0 top-[68px] z-30 bg-sidebar p-4 shadow-lg lg:hidden">
          <NavList onPick={() => setOpen(false)} />
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">{children}</div>
        <footer className="border-t px-5 py-6 text-center text-xs text-muted-foreground md:px-10">
          Siddaganga Institute of Technology, Tumakuru, Karnataka ·{" "}
          <a href="https://sit.ac.in" target="_blank" rel="noreferrer" className="underline">sit.ac.in</a>
        </footer>
      </main>
    </div>
  );
}

export function PageHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mb-8 rise">
      <div className="eyebrow text-accent">{eyebrow}</div>
      <h1 className="mt-2 text-4xl font-semibold text-primary md:text-5xl">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Chips<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={
            "rounded-full border px-4 py-1.5 text-sm transition-colors " +
            (value === o.v ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-primary")
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
