import React, { useState } from "react";
import * as ReactRouter from "react-router";
const { Link, useLocation } = ReactRouter;
import {
  Home,
  Library,
  History,
  BarChart3,
  User,
  Lock,
  CreditCard,
  Pencil,
  Check,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { usePilotStore } from "../state/pilotStore";
import { supabase } from "../../utils/supabase/client";

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
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? "" : "hover:opacity-80"}`} style={{ color: active ? "var(--text-primary)" : "var(--text-secondary)", backgroundColor: active ? "var(--overlay)" : "transparent" }}>
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

type AccountSection = "profile" | "security" | "billing";

export function AccountPage() {
  const account = usePilotStore((s) => s.account);
  const logout = usePilotStore((s) => s.logout);
  const [section, setSection] = useState<AccountSection>("profile");

  const [fullName, setFullName] = useState(account.userName ?? "");
  const [email, setEmail] = useState(account.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const accountNav: { id: AccountSection; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Edit profile", icon: Pencil },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    // Clear all session storage
    sessionStorage.clear();
    // Sign out from Supabase — clears its session from localStorage
    await supabase.auth.signOut();
    // Clear Zustand auth + user data
    logout();
    // Full page reload to "/" so no stale React/Supabase state survives
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <LeftRail />

      <div className="ml-56 min-h-screen">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="mb-10">
            <h1 className="font-serif text-2xl font-medium tracking-tight" style={{ color: "var(--text-primary)" }}>Account</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Manage your profile, password, and billing.</p>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            {/* Account sub-nav */}
            <nav className="flex shrink-0 flex-col gap-1 md:w-48">
              {accountNav.map((item) => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${active ? "" : "hover:opacity-80"}`}
                    style={active ? { backgroundColor: "var(--accent)", color: "#fff" } : { color: "var(--text-secondary)" }}
                  >
                    <Icon size={18} />
                    {item.label}
                  </button>
                );
              })}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--text-muted)" }}
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </div>
            </nav>

            <div className="min-w-0 flex-1 rounded-2xl border p-8" style={{ backgroundColor: "var(--surface-elevated)", borderColor: "var(--border-subtle)" }}>
              {section === "profile" && (
                <>
                  <h2 className="font-serif text-lg font-medium" style={{ color: "var(--text-primary)" }}>Edit profile</h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Update your name and email.</p>
                  <div className="mt-8 space-y-6">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Full name</label>
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" className="mt-2 w-full border-b py-2.5 bg-transparent outline-none" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Email</label>
                      <div className="mt-2 flex items-center gap-2">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="flex-1 border-b py-2.5 bg-transparent outline-none" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: "var(--success)" }} title="Verified"><Check size={12} /></span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {section === "security" && (
                <>
                  <h2 className="font-serif text-lg font-medium" style={{ color: "var(--text-primary)" }}>Security</h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Update your password.</p>
                  <div className="mt-8 space-y-6">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Current password</label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" className="mt-2 w-full border-b py-2.5 bg-transparent outline-none" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>New password</label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="mt-2 w-full border-b py-2.5 bg-transparent outline-none" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Confirm new password</label>
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="mt-2 w-full border-b py-2.5 bg-transparent outline-none" style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }} />
                    </div>
                  </div>
                </>
              )}
              {section === "billing" && (
                <>
                  <h2 className="font-serif text-lg font-medium" style={{ color: "var(--text-primary)" }}>Billing</h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>Your plan and payment details.</p>
                  <div className="mt-8">
                    <div className="rounded-xl border p-4" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-subtle)" }}>
                      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>Current plan</p>
                      <p className="mt-2 text-lg font-medium capitalize" style={{ color: "var(--text-primary)" }}>{account.tier}</p>
                      <Link to="/pricing" className="mt-3 inline-block text-sm font-medium transition-colors" style={{ color: "var(--accent)" }}>Upgrade plan →</Link>
                    </div>
                  </div>
                </>
              )}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t pt-8" style={{ borderColor: "var(--border-subtle)" }}>
                <Link to="/app" className="text-sm font-medium flex items-center gap-2 transition-colors" style={{ color: "var(--text-muted)" }}>
                  <ArrowLeft size={16} />
                  Back to Home
                </Link>
                <button type="button" onClick={handleSave} className="rounded-xl px-5 py-2.5 text-sm font-medium transition-colors" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
                  {saved ? "Saved" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
