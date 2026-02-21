import React from 'react';
import * as ReactRouter from 'react-router';
const { Link, useLocation } = ReactRouter;
import { 
  Home, 
  Library, 
  History, 
  BarChart3, 
  User,
  Workflow,
} from 'lucide-react';

// Shared Left Rail Navigation
function LeftRail() {
  const location = useLocation();
  
  const navItems = [
    { path: '/app', label: 'Home', icon: Home },
    { path: '/app/library', label: 'Library', icon: Library },
    { path: '/app/history', label: 'History', icon: History },
    { path: '/app/usage', label: 'Usage', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-56 flex flex-col border-r" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link to="/app" className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-serif font-bold text-lg" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>P</div>
          <span className="font-serif font-semibold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>PromptPilot</span>
        </Link>
        <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>Home</p>
      </div>
      <nav className="flex-1 px-2 py-5 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? '' : 'hover:opacity-80'}`} style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)', backgroundColor: active ? 'var(--overlay)' : 'transparent' }}>
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t space-y-0.5" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link to="/app/account" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === '/app/account' ? '' : 'hover:opacity-80'}`} style={{ color: location.pathname === '/app/account' ? 'var(--text-primary)' : 'var(--text-secondary)', backgroundColor: location.pathname === '/app/account' ? 'var(--overlay)' : 'transparent' }}>
          <User size={18} strokeWidth={1.8} />
          Account
        </Link>
        <div className="mx-2 mt-2 p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Free</p>
            <Link to="/pricing" className="text-xs font-medium transition-colors" style={{ color: 'var(--accent)' }}>Upgrade</Link>
          </div>
        </div>
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Extension</p>
        </div>
      </div>
    </div>
  );
}

// Shared Top Bar
function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="border-b border-gray-200 bg-white px-8 py-6">
      <h1 className="text-2xl font-serif font-bold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
}

// Placeholder pages
export function Workflows() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <LeftRail />
      <div className="ml-60">
        <TopBar title="Workflows" subtitle="Create and manage prompt workflows" />
        <div className="p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <Workflow size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-serif font-bold text-gray-800 mb-2">Workflows Coming Soon</h2>
            <p className="text-gray-600">Chain multiple prompts together into automated workflows.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


export function UsagePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <LeftRail />
      <div className="ml-56 min-h-screen">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <h1 className="font-serif text-2xl font-medium tracking-tight" style={{ color: 'var(--text-primary)' }}>Usage</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Monitor your usage and plan details.</p>
          <div className="mt-12 rounded-2xl border p-12 text-center" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
            <BarChart3 className="mx-auto h-14 w-14" style={{ color: 'var(--text-muted)' }} aria-hidden />
            <h2 className="mt-4 font-serif text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Usage analytics</h2>
            <p className="mt-2 text-sm max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
              Track your prompt enhancements and API usage. Coming soon.
            </p>
            <Link to="/pricing" className="mt-6 inline-block text-sm font-medium transition-colors" style={{ color: 'var(--accent)' }}>
              View plans →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
