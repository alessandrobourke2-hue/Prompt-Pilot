import React, { useState } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useOnboardingProfile } from '../hooks/useOnboardingProfile';
import type { OnboardingProfile } from '../state/pilotStore';

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = OnboardingProfile['role'];
type UseCase = OnboardingProfile['useCases'][number];
type AiExperience = OnboardingProfile['aiExperience'];
type Tool = OnboardingProfile['tools'][number];
type TonePreference = OnboardingProfile['tonePreference'];
type PrimaryGoal = OnboardingProfile['primaryGoal'];

type Answers = Partial<{
  role: Role;
  roleOther: string;
  useCases: UseCase[];
  aiExperience: AiExperience;
  tools: Tool[];
  tonePreference: TonePreference;
  primaryGoal: PrimaryGoal;
  displayName: string;
  orgName: string;
  workspaceName: string;
}>;

const TOTAL_STEPS = 7;

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full border-b" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-[640px] mx-auto px-6 py-4">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <motion.div
              key={i}
              className="h-1 flex-1 rounded-full"
              style={{ backgroundColor: i < step ? 'var(--accent)' : 'var(--border-subtle)' }}
              animate={{ backgroundColor: i < step ? 'var(--accent)' : 'var(--border-subtle)' }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <p className="text-[11px] mt-2 text-right" style={{ color: 'var(--text-muted)' }}>
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>
    </div>
  );
}

// ─── Option Card (single-select) ──────────────────────────────────────────────

function OptionCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl p-5 border transition-all duration-200"
      style={{
        borderColor: selected ? 'var(--accent)' : 'var(--border-default)',
        backgroundColor: selected ? 'rgba(30,58,95,0.04)' : 'var(--surface-elevated)',
        boxShadow: selected ? '0 0 0 1px var(--accent)' : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-medium text-[15px]" style={{ color: 'var(--text-primary)' }}>{label}</p>
          {description && (
            <p className="text-[13px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          )}
        </div>
        <div
          className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
          style={{
            borderColor: selected ? 'var(--accent)' : 'var(--border-default)',
            backgroundColor: selected ? 'var(--accent)' : 'transparent',
          }}
        >
          {selected && <Check size={11} color="#fff" strokeWidth={3} />}
        </div>
      </div>
    </button>
  );
}

// ─── Multi-select Card ────────────────────────────────────────────────────────

function MultiCard({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl p-5 border transition-all duration-200"
      style={{
        borderColor: selected ? 'var(--accent)' : 'var(--border-default)',
        backgroundColor: selected ? 'rgba(30,58,95,0.04)' : 'var(--surface-elevated)',
        boxShadow: selected ? '0 0 0 1px var(--accent)' : undefined,
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200"
          style={{
            borderColor: selected ? 'var(--accent)' : 'var(--border-default)',
            backgroundColor: selected ? 'var(--accent)' : 'transparent',
          }}
        >
          {selected && <Check size={11} color="#fff" strokeWidth={3} />}
        </div>
        <div>
          <p className="font-medium text-[15px]" style={{ color: 'var(--text-primary)' }}>{label}</p>
          {description && (
            <p className="text-[13px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Slide wrapper ────────────────────────────────────────────────────────────

function StepSlide({ children, direction, step }: { children: React.ReactNode; direction: 'forward' | 'back'; step: number }) {
  const xIn = direction === 'forward' ? 40 : -40;
  const xOut = direction === 'forward' ? -40 : 40;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        initial={{ opacity: 0, x: xIn }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: xOut }}
        transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Nav buttons ──────────────────────────────────────────────────────────────

function NavRow({
  onBack,
  onNext,
  nextLabel = 'Continue',
  nextDisabled = false,
  loading = false,
  showBack = true,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  showBack?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-10">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      ) : <div />}
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || loading}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
      >
        {loading ? 'Saving…' : nextLabel}
        {!loading && <ArrowRight size={16} strokeWidth={2} />}
      </button>
    </div>
  );
}

// ─── Screen heading ───────────────────────────────────────────────────────────

function ScreenHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-[11px] uppercase tracking-widest font-medium mb-3" style={{ color: 'var(--accent)' }}>
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif font-medium text-[28px] md:text-[32px] leading-tight mb-3" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function OnboardingPage() {
  const navigate = useNavigate();
  const { saveOnboardingProfile } = useOnboardingProfile();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goNext() {
    setDirection('forward');
    setStep((s) => s + 1);
  }
  function goBack() {
    setDirection('back');
    setStep((s) => s - 1);
  }

  function toggleUseCase(uc: UseCase) {
    setAnswers((prev) => {
      const current = prev.useCases ?? [];
      return {
        ...prev,
        useCases: current.includes(uc) ? current.filter((x) => x !== uc) : [...current, uc],
      };
    });
  }

  function toggleTool(t: Tool) {
    setAnswers((prev) => {
      const current = prev.tools ?? [];
      if (t === 'none') return { ...prev, tools: ['none'] };
      const withoutNone = current.filter((x) => x !== 'none');
      return {
        ...prev,
        tools: withoutNone.includes(t) ? withoutNone.filter((x) => x !== t) : [...withoutNone, t],
      };
    });
  }

  async function handleFinish() {
    const profile: OnboardingProfile = {
      role: answers.role ?? 'solo_professional',
      roleOther: answers.roleOther,
      useCases: answers.useCases ?? [],
      aiExperience: answers.aiExperience ?? 'occasional',
      tools: answers.tools ?? ['none'],
      tonePreference: answers.tonePreference ?? 'professional_approachable',
      primaryGoal: answers.primaryGoal ?? 'save_time',
      displayName: answers.displayName ?? '',
      orgName: answers.orgName,
      workspaceName: answers.workspaceName,
      onboardingComplete: true,
    };

    setLoading(true);
    setError(null);
    try {
      await saveOnboardingProfile(profile);
      navigate('/dashboard');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--background)' }}>
      <ProgressBar step={step} />

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[600px]">
          <StepSlide direction={direction} step={step}>
            {step === 1 && (
              <Step1
                value={answers.role}
                onChange={(r) => setAnswers((p) => ({ ...p, role: r }))}
                onNext={goNext}
              />
            )}
            {step === 2 && (
              <Step2
                value={answers.useCases ?? []}
                onChange={toggleUseCase}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 3 && (
              <Step3
                value={answers.aiExperience}
                onChange={(v) => setAnswers((p) => ({ ...p, aiExperience: v }))}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 4 && (
              <Step4
                value={answers.tools ?? []}
                onChange={toggleTool}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 5 && (
              <Step5
                value={answers.tonePreference}
                onChange={(v) => setAnswers((p) => ({ ...p, tonePreference: v }))}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 6 && (
              <Step6
                value={answers.primaryGoal}
                onChange={(v) => setAnswers((p) => ({ ...p, primaryGoal: v }))}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {step === 7 && (
              <Step7
                displayName={answers.displayName ?? ''}
                orgName={answers.orgName ?? ''}
                workspaceName={answers.workspaceName ?? ''}
                onDisplayName={(v) => setAnswers((p) => ({ ...p, displayName: v }))}
                onOrgName={(v) => setAnswers((p) => ({ ...p, orgName: v }))}
                onWorkspaceName={(v) => setAnswers((p) => ({ ...p, workspaceName: v }))}
                onFinish={handleFinish}
                onBack={goBack}
                loading={loading}
                error={error}
              />
            )}
          </StepSlide>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Role ─────────────────────────────────────────────────────────────

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: 'solo_professional', label: 'Solo professional', description: 'Consultant, freelancer, or independent operator' },
  { value: 'small_business',    label: 'Small business',    description: 'Founder or team of fewer than 20 people' },
  { value: 'team_lead',         label: 'Team lead',         description: 'Manager leading a function or squad' },
  { value: 'enterprise',        label: 'Enterprise',        description: 'Large organisation, 500+ employees' },
  { value: 'public_sector',     label: 'Public sector',     description: 'Government, council, or not-for-profit' },
  { value: 'other',             label: 'Other',             description: '' },
];

function Step1({ value, onChange, onNext }: { value?: Role; onChange: (r: Role) => void; onNext: () => void }) {
  return (
    <div>
      <ScreenHeading
        eyebrow="About you"
        title="Which best describes your role?"
        subtitle="This helps us tailor templates and defaults to your context."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROLES.map((r) => (
          <OptionCard
            key={r.value}
            label={r.label}
            description={r.description}
            selected={value === r.value}
            onClick={() => onChange(r.value)}
          />
        ))}
      </div>
      <NavRow showBack={false} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

// ─── Step 2: Use Cases ────────────────────────────────────────────────────────

const USE_CASES: { value: UseCase; label: string; description: string }[] = [
  { value: 'writing_comms',     label: 'Writing & communications', description: 'Articles, emails, announcements, content' },
  { value: 'policy_compliance', label: 'Policy & compliance',      description: 'Risk registers, governance documents, audits' },
  { value: 'client_reports',    label: 'Client reports',           description: 'Proposals, project updates, deliverables' },
  { value: 'team_briefs',       label: 'Team briefs',              description: 'Roadmaps, sprint plans, kickoff docs' },
  { value: 'meeting_summaries', label: 'Meeting summaries',        description: 'Decisions, action items, minutes' },
  { value: 'research_analysis', label: 'Research & analysis',      description: 'Market research, competitive intel, data' },
  { value: 'customer_service',  label: 'Customer-facing copy',     description: 'Support scripts, product messaging, FAQs' },
];

function Step2({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: UseCase[];
  onChange: (uc: UseCase) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <ScreenHeading
        eyebrow="Your work"
        title="What will you use PromptPilot for?"
        subtitle="Select all that apply — we'll surface the right templates."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {USE_CASES.map((uc) => (
          <MultiCard
            key={uc.value}
            label={uc.label}
            description={uc.description}
            selected={value.includes(uc.value)}
            onClick={() => onChange(uc.value)}
          />
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={value.length === 0} />
    </div>
  );
}

// ─── Step 3: AI Experience ────────────────────────────────────────────────────

const AI_LEVELS: { value: AiExperience; label: string; description: string }[] = [
  { value: 'beginner',    label: 'Just getting started', description: "I've used AI tools a few times or not at all" },
  { value: 'occasional',  label: 'Occasional user',      description: 'I use AI tools a few times a month' },
  { value: 'regular',     label: 'Regular user',         description: 'AI is part of my weekly workflow' },
  { value: 'power_user',  label: 'Power user',           description: 'I prompt daily and know my way around models' },
];

function Step3({ value, onChange, onNext, onBack }: { value?: AiExperience; onChange: (v: AiExperience) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <ScreenHeading
        eyebrow="Experience"
        title="How familiar are you with AI tools?"
        subtitle="We'll calibrate guidance and shortcuts to your comfort level."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AI_LEVELS.map((l) => (
          <OptionCard
            key={l.value}
            label={l.label}
            description={l.description}
            selected={value === l.value}
            onClick={() => onChange(l.value)}
          />
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

// ─── Step 4: Tools ────────────────────────────────────────────────────────────

const TOOLS: { value: Tool; label: string; description: string }[] = [
  { value: 'microsoft_365',    label: 'Microsoft 365',      description: 'Word, Outlook, Teams, SharePoint' },
  { value: 'google_workspace', label: 'Google Workspace',   description: 'Docs, Gmail, Drive, Meet' },
  { value: 'notion',           label: 'Notion',             description: 'Docs, wikis, databases' },
  { value: 'slack',            label: 'Slack',              description: 'Team messaging and channels' },
  { value: 'email',            label: 'Email only',         description: 'Outlook or Gmail as primary workflow' },
  { value: 'gov_systems',      label: 'Government systems', description: 'TRIM, HPE, or other records systems' },
  { value: 'none',             label: 'None of the above',  description: '' },
];

function Step4({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: Tool[];
  onChange: (t: Tool) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <ScreenHeading
        eyebrow="Your stack"
        title="Which tools do you work in?"
        subtitle="Select all that apply — we'll surface relevant integrations."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TOOLS.map((t) => (
          <MultiCard
            key={t.value}
            label={t.label}
            description={t.description}
            selected={value.includes(t.value)}
            onClick={() => onChange(t.value)}
          />
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={value.length === 0} />
    </div>
  );
}

// ─── Step 5: Tone Preference ──────────────────────────────────────────────────

const TONES: { value: TonePreference; label: string; example: string }[] = [
  {
    value: 'formal',
    label: 'Formal',
    example: '"The committee has approved the proposed budgetary allocation for Q3."',
  },
  {
    value: 'professional_approachable',
    label: 'Professional & approachable',
    example: '"Great news — the committee\'s signed off on the Q3 budget."',
  },
  {
    value: 'concise_direct',
    label: 'Concise & direct',
    example: '"Q3 budget approved. Next step: procurement."',
  },
  {
    value: 'warm_conversational',
    label: 'Warm & conversational',
    example: '"We just got the green light on Q3 budget — exciting times ahead!"',
  },
];

function Step5({ value, onChange, onNext, onBack }: { value?: TonePreference; onChange: (v: TonePreference) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <ScreenHeading
        eyebrow="Your voice"
        title="What's your preferred communication tone?"
        subtitle="We'll match outputs to your style. You can always adjust per document."
      />
      <div className="grid grid-cols-1 gap-3">
        {TONES.map((t) => (
          <button
            type="button"
            key={t.value}
            onClick={() => onChange(t.value)}
            className="w-full text-left rounded-xl p-5 border transition-all duration-200"
            style={{
              borderColor: value === t.value ? 'var(--accent)' : 'var(--border-default)',
              backgroundColor: value === t.value ? 'rgba(30,58,95,0.04)' : 'var(--surface-elevated)',
              boxShadow: value === t.value ? '0 0 0 1px var(--accent)' : undefined,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[15px] mb-2" style={{ color: 'var(--text-primary)' }}>{t.label}</p>
                <p className="text-[13px] leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>{t.example}</p>
              </div>
              <div
                className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                style={{
                  borderColor: value === t.value ? 'var(--accent)' : 'var(--border-default)',
                  backgroundColor: value === t.value ? 'var(--accent)' : 'transparent',
                }}
              >
                {value === t.value && <Check size={11} color="#fff" strokeWidth={3} />}
              </div>
            </div>
          </button>
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

// ─── Step 6: Primary Goal ─────────────────────────────────────────────────────

const GOALS: { value: PrimaryGoal; label: string; description: string }[] = [
  { value: 'save_time',          label: 'Save time',              description: 'Get to a usable draft faster, reduce rework' },
  { value: 'quality_documents',  label: 'Higher-quality output',  description: 'Produce more polished, professional documents' },
  { value: 'compliance_risk',    label: 'Reduce compliance risk',  description: 'Consistent language, fewer policy gaps' },
  { value: 'team_adoption',      label: 'Drive team adoption',    description: 'Get my team using AI consistently' },
  { value: 'less_overwhelmed',   label: 'Feel less overwhelmed',  description: 'Manage writing load without burning out' },
];

function Step6({ value, onChange, onNext, onBack }: { value?: PrimaryGoal; onChange: (v: PrimaryGoal) => void; onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <ScreenHeading
        eyebrow="Your goal"
        title="What's the one thing you most want from PromptPilot?"
        subtitle="This shapes your dashboard and the way we measure your progress."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {GOALS.map((g) => (
          <OptionCard
            key={g.value}
            label={g.label}
            description={g.description}
            selected={value === g.value}
            onClick={() => onChange(g.value)}
          />
        ))}
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!value} />
    </div>
  );
}

// ─── Step 7: Identity ─────────────────────────────────────────────────────────

function Step7({
  displayName,
  orgName,
  workspaceName,
  onDisplayName,
  onOrgName,
  onWorkspaceName,
  onFinish,
  onBack,
  loading,
  error,
}: {
  displayName: string;
  orgName: string;
  workspaceName: string;
  onDisplayName: (v: string) => void;
  onOrgName: (v: string) => void;
  onWorkspaceName: (v: string) => void;
  onFinish: () => void;
  onBack: () => void;
  loading: boolean;
  error: string | null;
}) {
  const isReady = displayName.trim().length > 0;
  const resolvedWorkspace = workspaceName.trim() || 'workspace';

  return (
    <div>
      <ScreenHeading
        eyebrow="Almost there"
        title="What should we call you?"
        subtitle="Just your name — no password required. You're already signed in."
      />
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Your name <span style={{ color: 'var(--accent)' }}>*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => onDisplayName(e.target.value)}
            placeholder="Alex Chen"
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-[15px] border outline-none transition-all duration-200"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--surface-elevated)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Organisation <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => onOrgName(e.target.value)}
            placeholder="Acme Corp"
            className="w-full rounded-xl px-4 py-3 text-[15px] border outline-none transition-all duration-200"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--surface-elevated)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
          />
        </div>
        <div>
          <label className="block text-[13px] font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Workspace name <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(optional)</span>
          </label>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => onWorkspaceName(e.target.value)}
            placeholder="My workspace"
            className="w-full rounded-xl px-4 py-3 text-[15px] border outline-none transition-all duration-200"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--surface-elevated)',
              color: 'var(--text-primary)',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border-default)')}
          />
        </div>
      </div>

      {/* Welcome preview — visible once name is entered */}
      <AnimatePresence>
        {isReady && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border p-5 mb-6"
            style={{ backgroundColor: 'rgba(30,58,95,0.04)', borderColor: 'var(--accent)' }}
          >
            <p className="font-serif text-[18px] font-medium" style={{ color: 'var(--text-primary)' }}>
              Welcome, {displayName.trim()}.
            </p>
            <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
              Your <span className="font-medium">{resolvedWorkspace}</span> is ready.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-[13px] mb-4" style={{ color: '#c0392b' }}>{error}</p>
      )}

      <NavRow
        onBack={onBack}
        onNext={onFinish}
        nextLabel="Start using PromptPilot"
        nextDisabled={!isReady}
        loading={loading}
      />
    </div>
  );
}
