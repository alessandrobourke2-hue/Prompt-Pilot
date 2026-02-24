import React from 'react';
import * as ReactRouter from 'react-router';
const { Link, useNavigate } = ReactRouter;
import {
  Home,
  Library,
  History,
  BarChart3,
  User,
  ArrowRight,
  Edit3,
  Zap,
  Target,
  Keyboard,
} from 'lucide-react';
import { motion } from 'motion/react';
import { usePilotStore } from '../state/pilotStore';
import { usePersonalisedPrompts } from '../hooks/usePersonalisedPrompts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const ROLE_LABELS: Record<string, string> = {
  solo_professional: 'Solo professional',
  small_business:    'Small business owner',
  team_lead:         'Team lead',
  enterprise:        'Enterprise professional',
  public_sector:     'Public sector professional',
  other:             'Professional',
};

const TONE_LABELS: Record<string, string> = {
  formal:                    'Formal',
  professional_approachable: 'Professional & approachable',
  concise_direct:            'Concise & direct',
  warm_conversational:       'Warm & conversational',
};

const TOOL_LOGOS: Record<string, string> = {
  microsoft_365:    'M365',
  google_workspace: 'GWS',
  notion:           'Notion',
  slack:            'Slack',
  email:            'Email',
  gov_systems:      'Gov',
};

// ─── Left Rail ────────────────────────────────────────────────────────────────

function LeftRail() {
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/app/library', label: 'Library', icon: Library },
    { path: '/app/history', label: 'History', icon: History },
    { path: '/app/usage', label: 'Usage', icon: BarChart3 },
  ];

  return (
    <div
      className="fixed left-0 top-0 h-screen w-56 flex flex-col border-r"
      style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link to="/dashboard" className="flex items-center gap-2 mb-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-serif font-bold text-lg"
            style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
          >
            P
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            PromptPilot
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-5 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link
          to="/app/account"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
        >
          <User size={18} strokeWidth={1.8} />
          Account
        </Link>
        <div className="mx-2 mt-2 p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Free</p>
            <Link to="/pricing" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Upgrade
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Start Card ─────────────────────────────────────────────────────────

function QuickStartCard({
  id,
  title,
  description,
  index,
}: {
  id: string;
  title: string;
  description: string;
  index: number;
}) {
  const navigate = useNavigate();

  function handleClick() {
    sessionStorage.setItem('pp_preselect_blueprint', id);
    navigate('/app/library');
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
      className="w-full text-left rounded-xl p-5 border transition-all duration-200 hover:shadow-sm group"
      style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-serif font-medium text-[17px] mb-1" style={{ color: 'var(--text-primary)' }}>{title}</p>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
        </div>
        <ArrowRight
          size={16}
          className="mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
          style={{ color: 'var(--text-muted)' }}
        />
      </div>
    </motion.button>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function DashboardPage() {
  const profile = usePilotStore((s) => s.onboardingProfile);
  const usage = usePilotStore((s) => s.usage);
  const templates = usePersonalisedPrompts();

  const displayName = profile?.displayName ?? 'there';
  const role = profile?.role ?? 'solo_professional';
  const roleLabel = ROLE_LABELS[role] ?? 'Professional';
  const toneLabel = profile?.tonePreference ? TONE_LABELS[profile.tonePreference] : null;
  const aiExperience = profile?.aiExperience ?? 'occasional';
  const tools = (profile?.tools ?? []).filter((t) => t !== 'none');
  const isPowerUser = aiExperience === 'power_user';
  const isBeginner = aiExperience === 'beginner';

  // Estimated hours saved: each enhance ≈ 3 minutes → convert to hours this "week"
  const estMinutes = usage.enhanceCount * 3;
  const estHours = (estMinutes / 60).toFixed(1);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left rail hidden on mobile */}
      <div className="hidden md:block">
        <LeftRail />
      </div>

      <div className="md:ml-56 min-h-screen">
        <main className="px-6 md:px-8 py-16 max-w-[800px] mx-auto">

          {/* ── Greeting ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="mb-12"
          >
            <p className="text-[13px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {getGreeting()}
            </p>
            <h1 className="font-serif font-medium text-[36px] md:text-[42px] leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
              {displayName}
            </h1>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
              {roleLabel} · Your workspace is ready.
            </p>
          </motion.div>

          {/* ── Quick Start Panel ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Recommended for you
              </h2>
              <Link to="/app/library" className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((t, i) => (
                <QuickStartCard key={t.id} id={t.id} title={t.title} description={t.description} index={i} />
              ))}
            </div>
          </motion.section>

          {/* ── Tone + Power user hints row ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="flex flex-wrap gap-3 mb-12"
          >
            {toneLabel && (
              <Link
                to="/app/account"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px] font-medium transition-colors hover:opacity-80"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>Tone:</span>
                <span style={{ color: 'var(--text-primary)' }}>{toneLabel}</span>
                <Edit3 size={13} style={{ color: 'var(--text-muted)' }} />
              </Link>
            )}

            {isPowerUser && (
              <div
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-[13px]"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-muted)',
                }}
              >
                <Keyboard size={13} />
                <span>⌘ Enter to enhance · ⌘ K for library</span>
              </div>
            )}
          </motion.div>

          {/* ── Goal Tracker ── */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="mb-12"
          >
            <div
              className="rounded-xl border p-5 flex items-center gap-5"
              style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(30,58,95,0.08)' }}
              >
                <Target size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                {usage.enhanceCount === 0 ? (
                  <>
                    <p className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>
                      Your first enhancement is waiting
                    </p>
                    <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Start a draft above to see your time savings here.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[15px] font-medium" style={{ color: 'var(--text-primary)' }}>
                      You've saved an estimated{' '}
                      <span style={{ color: 'var(--accent)' }}>
                        {Number(estHours) < 0.1 ? `${estMinutes} min` : `${estHours} hrs`}
                      </span>
                    </p>
                    <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      Based on {usage.enhanceCount} enhancement{usage.enhanceCount !== 1 ? 's' : ''} × ~3 min each
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.section>

          {/* ── Connections Panel (only if non-none tools) ── */}
          {tools.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="mb-12"
            >
              <h2 className="text-[13px] font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Integrations
              </h2>
              <div className="flex flex-wrap gap-3">
                {tools.map((t) => (
                  <div
                    key={t}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-medium"
                    style={{
                      backgroundColor: 'var(--surface-elevated)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <span
                      className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'var(--overlay)', color: 'var(--text-muted)' }}
                    >
                      {TOOL_LOGOS[t] ?? t}
                    </span>
                    <span>Coming soon</span>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── Beginner tips ── */}
          {isBeginner && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="mb-12"
            >
              <h2 className="text-[13px] font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                Getting started tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { icon: Zap, tip: 'Start with a rough idea', detail: 'Paste anything — messy notes, bullet points, half-formed thoughts. We\'ll structure it.' },
                  { icon: Library, tip: 'Explore the Library', detail: 'Browse 15+ templates designed for common professional documents.' },
                ].map(({ icon: Icon, tip, detail }) => (
                  <div
                    key={tip}
                    className="rounded-xl border p-5"
                    style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: 'rgba(30,58,95,0.08)' }}
                    >
                      <Icon size={16} style={{ color: 'var(--accent)' }} />
                    </div>
                    <p className="font-medium text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>{tip}</p>
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{detail}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
            >
              {isBeginner ? 'Start your first draft' : 'Go to workspace'}
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </motion.div>

        </main>
      </div>
    </div>
  );
}
