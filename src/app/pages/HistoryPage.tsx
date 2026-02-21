import React, { useMemo, useState } from "react";
import * as ReactRouter from "react-router";
const { Link, useLocation, useNavigate } = ReactRouter;
import {
  Home,
  Library,
  History,
  BarChart3,
  User,
  Clock,
  Search,
  ArrowRight,
  Copy,
  FileText,
} from "lucide-react";
import { usePilotStore } from "../state/pilotStore";
import type { SavedPrompt } from "../state/pilotStore";

function LeftRail() {
  const location = useLocation();
  const navItems = [
    { path: "/app", label: "Home", icon: Home },
    { path: "/app/library", label: "Library", icon: Library },
    { path: "/app/history", label: "History", icon: History },
    { path: "/app/usage", label: "Usage", icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === "/app") return location.pathname === "/app";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-56 flex flex-col border-r" style={{ backgroundColor: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>
      <div className="p-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <Link to="/app" className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-serif font-bold text-lg" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>P</div>
          <span className="font-serif font-semibold text-lg tracking-tight" style={{ color: "var(--text-primary)" }}>PromptPilot</span>
        </Link>
        <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: "var(--text-muted)" }}>Home</p>
      </div>
      <nav className="flex-1 px-2 py-5 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "" : "hover:opacity-80"}`}
              style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)", backgroundColor: active ? "var(--overlay)" : "transparent" }}
            >
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t space-y-0.5" style={{ borderColor: "var(--border-subtle)" }}>
        <Link to="/app/account" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === "/app/account" ? "" : "hover:opacity-80"}`} style={{ color: location.pathname === "/app/account" ? "var(--text-primary)" : "var(--text-secondary)", backgroundColor: location.pathname === "/app/account" ? "var(--overlay)" : "transparent" }}>
          <User size={18} strokeWidth={1.8} />
          Account
        </Link>
        <div className="mx-2 mt-2 p-3 rounded-xl border" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-subtle)" }}>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Free</p>
            <Link to="/pricing" className="text-xs font-medium transition-colors" style={{ color: "var(--accent)" }}>Upgrade</Link>
          </div>
        </div>
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Extension</p>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return then.toLocaleDateString();
}

export function HistoryPage() {
  const navigate = useNavigate();
  const saved = usePilotStore((s) => s.prompts.saved);
  const incrementCopy = usePilotStore((s) => s.incrementCopy);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return saved;
    return saved.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.input.toLowerCase().includes(q) ||
        (p.enhancedPrompt && p.enhancedPrompt.toLowerCase().includes(q)) ||
        (p.structure && p.structure.toLowerCase().includes(q))
    );
  }, [saved, query]);

  const handleUseAgain = (prompt: SavedPrompt) => {
    sessionStorage.setItem("pp_continue_prompt", JSON.stringify(prompt));
    navigate("/app/input");
  };

  const handleCopyEnhanced = async (prompt: SavedPrompt) => {
    if (prompt.enhancedPrompt) {
      await navigator.clipboard.writeText(prompt.enhancedPrompt);
      incrementCopy();
      setCopiedId(prompt.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <LeftRail />

      <div className="ml-56 min-h-screen">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-10">
            <h1 className="font-serif text-2xl font-medium tracking-tight" style={{ color: "var(--text-primary)" }}>History</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              Your enhanced prompts. Use again or copy the result.
            </p>
          </div>

          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, content, or type…"
              className="w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition-colors"
              style={{ backgroundColor: "var(--surface-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-primary)" }}
              aria-label="Search history"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border p-16 text-center" style={{ backgroundColor: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>
              <FileText className="mx-auto h-12 w-12" style={{ color: "var(--text-muted)" }} aria-hidden />
              <h2 className="mt-4 font-serif text-lg font-medium" style={{ color: "var(--text-secondary)" }}>
                {saved.length === 0 ? "No history yet" : "No matches"}
              </h2>
              <p className="mt-2 max-w-sm mx-auto text-sm" style={{ color: "var(--text-muted)" }}>
                {saved.length === 0
                  ? "Enhanced prompts will appear here. Start from the Command Center or Prompt Library."
                  : "Try a different search term."}
              </p>
              {saved.length === 0 && (
                <Link
                  to="/app"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{ backgroundColor: "var(--accent)", color: "#fff" }}
                >
                  Go to Command Center
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ) : (
            <ul className="space-y-3" role="list">
              {filtered.map((prompt) => (
                <li key={prompt.id}>
                  <article
                    className="rounded-2xl border p-5 transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}
                    aria-label={`Prompt: ${prompt.title}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <h2 className="font-medium line-clamp-2" style={{ color: "var(--text-primary)" }}>{prompt.title}</h2>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
                          {prompt.structure && (
                            <span className="rounded-full border px-2.5 py-1 text-[12px]" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface)" }}>{prompt.structure}</span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {formatTimeAgo(prompt.lastUsed || prompt.createdAt)}
                          </span>
                        </div>
                        {prompt.enhancedPrompt && (
                          <p className="mt-3 line-clamp-2 text-sm" style={{ color: "var(--text-secondary)" }}>{prompt.enhancedPrompt}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                        <button type="button" onClick={() => handleUseAgain(prompt)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
                          Use again
                          <ArrowRight size={14} />
                        </button>
                        {prompt.enhancedPrompt && (
                          <button type="button" onClick={() => handleCopyEnhanced(prompt)} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors" style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }} title="Copy enhanced prompt">
                            <Copy size={14} />
                            {copiedId === prompt.id ? "Copied" : "Copy"}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}

          {saved.length > 0 && (
            <p className="mt-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
              {saved.length} prompt{saved.length === 1 ? "" : "s"} saved (most recent first)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
