import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Search, 
  Chrome, 
  X, 
  Check, 
  ChevronUp, 
  ChevronDown,
  Copy,
  ExternalLink
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import * as ReactRouter from 'react-router';
const { Link, useNavigate } = ReactRouter;
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);
import { InteractiveBeforeAfter } from '../components/InteractiveBeforeAfter';
import { FrameworkCarousel } from '../components/FrameworkCarousel';
import { SideSignupModal } from '../components/SideSignupModal';

// --- Types & Mock Data ---

type Phase = 'input' | 'processing' | 'result';
type Intent = 'auto' | 'linkedin' | 'email' | 'outreach' | 'blog' | 'product' | 'strategy' | 'tech';

interface PromptBlock {
  label: string;
  content: string;
}

interface ElevateOptions {
  depth: 'standard' | 'advanced' | 'expert';
  tone?: 'direct' | 'persuasive' | 'analytical' | 'strategic' | 'bold';
  structure?: 'concise' | 'structured' | 'comprehensive';
  extraNotes?: string;
}

interface GeneratedResult {
  headline: string;
  summary: string;
  prompt_blocks: PromptBlock[];
  enhanced_prompt_compiled: string;
  improvements: string[];
  follow_up_questions?: Array<{
    question: string;
    type?: 'text' | 'choice';
    options?: string[];
  }>;
  intent?: 'linkedin' | 'email' | 'outreach' | 'blog' | 'product' | 'strategy' | 'tech';
  routed_by?: 'override' | 'rules' | 'model';
  elevated?: boolean;
}

const ROTATING_PLACEHOLDERS = [
  "I'm going to paste a rough email draft… help me make it sharper",
  "Help me structure a LinkedIn post about our product launch",
  "I need to write a PRD for a new feature… where do I start",
  "Turn this sales email into something that actually gets responses",
  "I'm stuck on how to debug this API error… give me a framework",
  "Help me craft a cold outreach message that doesn't feel pushy",
  "I have strategy thoughts but they're messy… help me structure them",
  "Take this product idea and turn it into clear requirements",
  "I need to write an email update but don't know what to include",
  "Help me turn these scattered thoughts into a solid blog outline",
  "I'm writing a technical doc… help me make it systematic",
  "Take my rough pitch and make it land with decision-makers"
];

// --- Components ---

function Header() {
  const scrollToDemo = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-serif font-bold text-xl" style={{ backgroundColor: '#000', color: '#fff' }}>
          P
        </div>
        <span className="font-serif font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>PromptPilot</span>
      </Link>
      <div className="flex items-center gap-4">
        <button onClick={scrollToDemo} className="text-sm font-medium hidden sm:block transition-colors duration-200 hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
          See how it works
        </button>
        <Link to="/pricing" className="text-sm font-medium hidden sm:block transition-colors duration-200 hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
          Pricing
        </Link>
        <a href="#" className="text-sm font-medium hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 hover:opacity-90" style={{ border: '1px solid var(--border-default)', backgroundColor: 'var(--surface-elevated)', color: 'var(--text-primary)' }}>
          <Chrome size={14} />
          Install Extension
        </a>
        <Link to="/app" className="text-sm font-medium transition-colors duration-200 hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
          Sign In
        </Link>
      </div>
    </nav>
  );
}

function Companion({ minimized = true }: { minimized?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white p-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 cursor-pointer hover:shadow-xl transition-shadow`}
    >
      <div className="text-2xl">✈️</div>
      {!minimized && (
        <span className="text-sm font-medium text-gray-600 pr-2">Ready to help</span>
      )}
    </motion.div>
  );
}

function ExtensionFloatingCard({ show }: { show: boolean }) {
  const [dismissed, setDismissed] = useState(false);

  if (!show || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="fixed right-6 top-32 z-40 w-72 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-gray-100 p-6 group hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)] transition-shadow"
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-gray-300 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          <Chrome size={20} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-serif text-base font-semibold text-gray-900 leading-tight">
            Use inside ChatGPT
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">One-click insert</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Skip the copy-paste. Enhance prompts directly in ChatGPT with our extension.
      </p>

      <a
        href="#"
        className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5"
      >
        <Chrome size={16} />
        Install Extension
      </a>
    </motion.div>
  );
}

function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const steps = [
    {
      title: "Analyzing intent",
      description: "Understanding your goal and context"
    },
    {
      title: "Building structure",
      description: "Applying frameworks and constraints"
    },
    {
      title: "Refining output",
      description: "Optimizing for clarity and precision"
    }
  ];

  const tips = [
    "Pro tip: Prompts perform better with explicit constraints.",
    "Pro tip: Add a target audience to sharpen tone.",
    "Pro tip: Structured prompts get 3x better AI output.",
    "Pro tip: Clear output formats reduce ambiguity."
  ];

  // Progress gradually to 95%, then backend completion will jump to 100%
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 1, 95);
        
        // Update step based on progress
        if (newProgress < 30) setCurrentStep(0);
        else if (newProgress < 70) setCurrentStep(1);
        else setCurrentStep(2);
        
        return newProgress;
      });
    }, 80); // Fills to 95% in ~7.6 seconds

    return () => clearInterval(interval);
  }, []);

  // Rotate tips
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3500);

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto py-16 px-6">
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
          Working
        </span>
      </motion.div>

      {/* Title & Subtext */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-12"
      >
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
          Structuring your prompt
        </h2>
        <p className="text-gray-500 text-base md:text-lg">
          Turning your intent into a clear, reusable prompt system.
        </p>
      </motion.div>

      {/* 3-Step Ritual */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full mb-12 space-y-4"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
              currentStep === index
                ? 'border-gray-300 bg-gray-50/50 shadow-sm'
                : currentStep > index
                  ? 'border-gray-200 bg-white opacity-60'
                  : 'border-gray-100 bg-white'
            }`}
          >
            <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
              currentStep === index
                ? 'bg-black text-white'
                : currentStep > index
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
            }`}>
              {currentStep > index ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                <span className="text-xs font-bold">{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-1">
                {step.title}
              </p>
              <AnimatePresence mode="wait">
                {currentStep === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22 }}
                    className="text-sm text-gray-500"
                  >
                    {step.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full mb-6"
      >
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gray-700 to-gray-900 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Rotating Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center h-6"
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-400 italic"
          >
            {tips[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function ElevateSection({
  onElevate,
  isElevating
}: {
  onElevate: (options: ElevateOptions) => void;
  isElevating: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [depth, setDepth] = useState<'standard' | 'advanced' | 'expert'>('advanced');
  const [tone, setTone] = useState<string | undefined>();
  const [structure, setStructure] = useState<string | undefined>();
  const [extraNotes, setExtraNotes] = useState('');

  const Chip = ({
    active,
    onClick,
    children
  }: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all
        border
        ${active
          ? 'border-[#C6A75E] text-gray-900 bg-[#C6A75E]/10 shadow-[0_0_0_1px_#C6A75E]'
          : 'border-gray-200 text-gray-600 hover:border-gray-400'}
      `}
    >
      {children}
    </button>
  );

  return (
    <div className="mt-8 border-t border-gray-100 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-lg font-medium text-gray-900 mb-1">
              Elevate This
            </p>
            <p className="text-sm text-gray-500">
              Optional — add clarity, specificity, or depth.
            </p>
          </div>
          <div className="text-gray-400">
            {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-6 p-6 rounded-2xl border border-[#C6A75E]/40 bg-white shadow-sm"
          >
            {/* Depth */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-bold">
                Depth
              </p>
              <div className="flex gap-3 flex-wrap">
                <Chip active={depth === 'standard'} onClick={() => setDepth('standard')}>
                  Standard
                </Chip>
                <Chip active={depth === 'advanced'} onClick={() => setDepth('advanced')}>
                  Advanced
                </Chip>
                <Chip active={depth === 'expert'} onClick={() => setDepth('expert')}>
                  Expert
                </Chip>
              </div>
            </div>

            {/* Tone */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-bold">
                Tone
              </p>
              <div className="flex gap-3 flex-wrap">
                {['direct', 'persuasive', 'analytical', 'strategic', 'bold'].map(t => (
                  <Chip
                    key={t}
                    active={tone === t}
                    onClick={() => setTone(tone === t ? undefined : t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Structure */}
            <div className="mb-6">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-bold">
                Structure
              </p>
              <div className="flex gap-3 flex-wrap">
                {['concise', 'structured', 'comprehensive'].map(s => (
                  <Chip
                    key={s}
                    active={structure === s}
                    onClick={() => setStructure(structure === s ? undefined : s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Extra Notes */}
            <div className="mb-6">
              <textarea
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="Add any missing details, constraints, or examples."
                rows={3}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C6A75E]/40 focus:border-[#C6A75E]/40 transition-all resize-none"
              />
            </div>

            <button
              onClick={() =>
                onElevate({
                  depth,
                  tone: tone as any,
                  structure: structure as any,
                  extraNotes
                })
              }
              disabled={isElevating}
              className="px-6 py-3 rounded-full border border-[#C6A75E] text-gray-900 font-medium hover:bg-[#C6A75E]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isElevating ? 'Elevating…' : 'Elevate Prompt'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ result, onCopy, onReset, isFirstSearch, onElevate, isElevating, showExtensionBanner }: { 
  result: GeneratedResult; 
  onCopy: () => void; 
  onReset: () => void; 
  isFirstSearch: boolean;
  onElevate: (options: ElevateOptions) => void;
  isElevating: boolean;
  showExtensionBanner: boolean;
}) {
  const [showImprovements, setShowImprovements] = useState(false);
  const [expandedPrompt, setExpandedPrompt] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Dock the action pill after 5 seconds (increased from 2 for better recognition time)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDocked(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Get first chunk of prompt (first 4 lines)
  const getPromptPreview = () => {
    const lines = result.prompt.split('\n');
    if (lines.length <= 4) return { preview: result.prompt, hasMore: false };
    
    const preview = lines.slice(0, 4).join('\n');
    return { preview, hasMore: true };
  };

  const { preview, hasMore } = getPromptPreview();

  const handleUseChatGPT = () => {
    // Open ChatGPT with the prompt
    const chatGPTUrl = `https://chat.openai.com/`;
    window.open(chatGPTUrl, '_blank');
    onCopy(); // Also copy to clipboard
    setDismissed(true);
  };

  const handleCopy = () => {
    onCopy();
    // Optional: Auto-dismiss after copy
    setTimeout(() => setDismissed(true), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.10)] border ${
        result.elevated ? 'border-[#C6A75E] shadow-[0_0_0_1px_#C6A75E]/20' : 'border-gray-100'
      } overflow-hidden transition-all relative`}
    >
      {/* Close button - always visible top-right */}
      <button
        onClick={onReset}
        aria-label="Close result"
        className="absolute top-6 right-6 z-20 text-gray-400 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
      >
        <X size={18} />
      </button>

      {/* Unified Action Pill - Hero → Docked */}
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={
              isDocked
                ? {
                    opacity: 1,
                    y: 0,
                    scale: 0.85,
                    x: 'calc(50vw - 280px)', // Move to bottom-right
                  }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: 0,
                  }
            }
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 150,
              duration: 0.32,
            }}
            className={`${
              isDocked
                ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50'
                : 'absolute top-6 left-1/2 -translate-x-1/2 z-10'
            } max-w-2xl transition-all`}
            style={{
              transformOrigin: isDocked ? 'center' : 'center top',
            }}
          >
            <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-[28px] border border-white/60 flex items-center gap-4 transition-all ${
              isDocked ? 'h-[50px] px-5' : 'h-auto p-4'
            }">
              {!isDocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="text-2xl">💬</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      Your prompt is ready
                    </h3>
                    <p className="text-xs text-gray-500">
                      Deploy instantly or copy to reuse anywhere
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 bg-gray-100 text-gray-900 font-medium rounded-full hover:bg-gray-200 transition-all duration-[var(--dur-med)] ${
                    isDocked ? 'px-4 py-2.5 text-base' : 'px-5 py-2.5 text-sm'
                  }`}
                >
                  <Copy size={isDocked ? 16 : 14} />
                  {isDocked ? '' : 'Copy'}
                </button>

                <button
                  onClick={handleUseChatGPT}
                  className={`flex items-center gap-2 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-all duration-[var(--dur-med)] hover:-translate-y-0.5 shadow-lg shadow-black/10 ${
                    isDocked ? 'px-5 py-2.5 text-base' : 'px-5 py-2.5 text-sm'
                  }`}
                >
                  <ExternalLink size={isDocked ? 16 : 14} />
                  {isDocked ? 'Use in ChatGPT' : 'Use in ChatGPT'}
                </button>

                {isDocked && (
                  <button
                    onClick={() => setDismissed(true)}
                    className="text-gray-400 hover:text-gray-700 transition-colors p-2"
                    aria-label="Dismiss"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-8 md:p-10 pt-20">
        {/* Intent Label */}
        {result.intent && (
          <div className="mb-4">
            <p className="text-xs text-gray-400">
              {result.routed_by === 'override' 
                ? `Using: ${result.intent.charAt(0).toUpperCase() + result.intent.slice(1)} (override)` 
                : `Detected: ${result.intent.charAt(0).toUpperCase() + result.intent.slice(1)}`}
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 mb-6">
          {result.elevated ? (
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-1 bg-[#C6A75E]/20 text-[#946B3E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            >
              Elevated
            </motion.span>
          ) : (
            <span className="mt-1 bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Ready
            </span>
          )}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
              {result.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Optimized for clarity, constraints, and stronger AI output.
            </p>
          </div>
        </div>

        {/* Collapsed Prompt Preview */}
        <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
          <pre className="font-sans text-base leading-relaxed text-gray-800 whitespace-pre-wrap font-medium">
            {expandedPrompt ? result.prompt : preview}
          </pre>
          
          {hasMore && (
            <button
              onClick={() => setExpandedPrompt(!expandedPrompt)}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {expandedPrompt ? (
                <>
                  <ChevronUp size={16} />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown size={16} />
                  Expand full prompt
                </>
              )}
            </button>
          )}
        </div>

        {/* Elevate Section - Now Prominent */}
        <ElevateSection onElevate={onElevate} isElevating={isElevating} />

        {/* What We Improved - Emotive, at bottom */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <button
            onClick={() => setShowImprovements(!showImprovements)}
            className="w-full flex items-start justify-between gap-4 text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1">
                  Your thinking, structured
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We turned your rough idea into something AI can actually work with — clear constraints, context, and purpose.
                </p>
              </div>
            </div>
            <div className="text-gray-400 mt-1">
              {showImprovements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>

          <AnimatePresence>
            {showImprovements && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-6 ml-16"
              >
                <div className="space-y-3">
                  {result.improvements.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                    >
                      <div className="mt-0.5 text-green-600 shrink-0">
                        <Check size={16} strokeWidth={2.5} />
                      </div>
                      {item}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Extension + account nudge */}
        {showExtensionBanner && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 border-l-4 border-[#C6A75E] bg-gray-50 rounded-xl"
          >
            <p className="text-sm text-gray-700 mb-2">
              Use this directly inside ChatGPT.
            </p>
            <button className="text-sm font-medium text-[#9C7F3B] hover:text-[#7A5F2F] transition-colors flex items-center gap-1">
              Install Extension →
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function SignInModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Signed in successfully');
      onClose();
      // Redirect to app dashboard
      window.location.href = '/app';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white font-medium py-3.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('input');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [selectedIntent, setSelectedIntent] = useState<Intent>('auto');
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [showFollowUps, setShowFollowUps] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isElevating, setIsElevating] = useState(false);
  const [elevateCount, setElevateCount] = useState(0);
  const [copyCount, setCopyCount] = useState(0);
  const [firstInteractionTime, setFirstInteractionTime] = useState<number | null>(null);
  const [showExtension, setShowExtension] = useState(false);

  // Rotate placeholders
  useEffect(() => {
    if (phase !== 'input') return;
    
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [phase]);

  // Smart extension banner trigger
  useEffect(() => {
    // Set first interaction time when user starts
    if (!firstInteractionTime && searchCount > 0) {
      setFirstInteractionTime(Date.now());
    }

    // Check if user has proven intent
    const shouldShow =
      searchCount >= 3 ||
      elevateCount >= 1 ||
      copyCount >= 2;

    if (shouldShow && firstInteractionTime) {
      const timeSinceFirstInteraction = Date.now() - firstInteractionTime;
      
      // Wait at least 30 seconds since first interaction
      if (timeSinceFirstInteraction >= 30000) {
        setShowExtension(true);
      } else {
        // Set a timer for the remaining time
        const remainingTime = 30000 - timeSinceFirstInteraction;
        const timer = setTimeout(() => {
          setShowExtension(true);
        }, remainingTime);

        return () => clearTimeout(timer);
      }
    }
  }, [searchCount, elevateCount, copyCount, firstInteractionTime]);
  
  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error('Please enter a prompt to enhance');
      return;
    }

    if (query.trim().length < 10) {
      toast.error('Prompt must be at least 10 characters');
      return;
    }
    
    setPhase('processing');
    
    try {
      // Call the enhance endpoint on the server
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e52adb92/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
          input: query,
          context: {
            intent_override: selectedIntent,
            channel: 'ChatGPT',
            tone: 'professional'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Enhancement error:', response.status, errorText);
        
        // Try to parse error details
        let errorMessage = 'Enhancement failed. Please try again.';
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.details) {
            errorMessage = `Enhancement failed: ${errorData.details}`;
          }
        } catch (e) {
          // If we can't parse, use the raw text
          if (errorText && errorText.length < 100) {
            errorMessage = `Enhancement failed: ${errorText}`;
          }
        }
        
        toast.error(errorMessage);
        setPhase('input');
        return;
      }

      const data = await response.json();

      // Validate response has required fields
      if (!data || !data.enhanced_prompt) {
        console.error('Invalid response from enhancement service');
        toast.error('Enhancement failed. Please try again.');
        setPhase('input');
        return;
      }

      // Map response to existing result format
      const generated: GeneratedResult = {
        title: data.title || 'Enhanced Prompt',
        prompt: data.enhanced_prompt,
        improvements: Array.isArray(data.improvements) ? data.improvements : [],
        intent: data.intent,
        assumptions: Array.isArray(data.assumptions) ? data.assumptions : [],
        follow_up_questions: Array.isArray(data.follow_up_questions) ? data.follow_up_questions : [],
        routed_by: data.meta?.routed_by
      };

      setResult(generated);
      setPhase('result');
      setSearchCount(prev => prev + 1);
      
      // Check for modal trigger if not logged in
      if (!session && searchCount >= 1) {
        setTimeout(() => setShowSignupModal(true), 1500);
      }
    } catch (err) {
      console.error('Enhancement error:', err);
      toast.error('Enhancement failed. Please try again.');
      setPhase('input');
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.prompt);
      toast.success("Prompt copied to clipboard");
      setCopyCount(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setPhase('input');
    setQuery('');
    setResult(null);
  };

  const handleSignup = async (email: string, pass: string) => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e52adb92/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      toast.success('Account created successfully!');
      setShowSignupModal(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleElevate = async (options: ElevateOptions) => {
    if (!result) return;

    setIsElevating(true);
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-e52adb92/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
          mode: 'elevated',
          input: result.prompt,
          context: {
            intent_override: result.intent || selectedIntent,
            elevate_options: options
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Elevation error:', response.status, errorText);
        toast.error('Elevation failed. Please try again.');
        setIsElevating(false);
        return;
      }

      const data = await response.json();

      if (!data || !data.enhanced_prompt) {
        console.error('Invalid response from elevation service');
        toast.error('Elevation failed. Please try again.');
        setIsElevating(false);
        return;
      }

      // Update result with elevated version
      const elevated: GeneratedResult = {
        title: data.title || 'Elevated Prompt',
        prompt: data.enhanced_prompt,
        improvements: Array.isArray(data.improvements) ? data.improvements : [],
        intent: data.intent || result.intent,
        assumptions: Array.isArray(data.assumptions) ? data.assumptions : [],
        follow_up_questions: Array.isArray(data.follow_up_questions) ? data.follow_up_questions : [],
        routed_by: data.meta?.routed_by,
        elevated: true
      };

      setResult(elevated);
      setIsElevating(false);
      toast.success('Prompt elevated successfully!');
      setElevateCount(prev => prev + 1);
    } catch (err) {
      console.error('Elevation error:', err);
      toast.error('Elevation failed. Please try again.');
      setIsElevating(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-[var(--accent)] selection:text-white overflow-x-hidden" style={{ backgroundColor: 'var(--background)' }}>
      <Toaster position="bottom-center" />
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 pt-20 pb-40 min-h-[80vh] flex flex-col items-center justify-center relative">
        
        <AnimatePresence mode="wait">
          {phase === 'input' && (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
              className="w-full text-center z-10"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 leading-[1.1]"
                style={{ color: 'var(--text-primary)' }}
              >
                Turn rough ideas into<br />structured AI workflows.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="text-lg md:text-xl mb-16 max-w-xl mx-auto font-light"
                style={{ color: 'var(--text-secondary)' }}
              >
                Built for operators who use AI daily — not just casually.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                className="relative max-w-3xl mx-auto group"
              >
                <div 
                  className="relative rounded-full p-2.5 flex items-center transition-all duration-300 group-hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--surface-elevated)', 
                    boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div className="pl-6" style={{ color: 'var(--text-muted)' }}>
                    <Search size={24} strokeWidth={1.8} />
                  </div>
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]} 
                    className="flex-1 bg-transparent border-none outline-none px-5 py-5 text-lg w-full font-medium placeholder:font-normal"
                    style={{ color: 'var(--text-primary)' }}
                    autoFocus
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={!query.trim() || phase === 'processing'}
                    className="rounded-full p-4 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
                    style={{ backgroundColor: '#1a1a1a', color: '#fff' }}
                  >
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </button>
                </div>
              </motion.div>
              
              {/* Optimize tags — all visible */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.32 }}
                className="flex items-center justify-center gap-2 mt-8 flex-wrap"
              >
                <span className="text-xs font-medium mr-1" style={{ color: 'var(--text-muted)' }}>Optimize for:</span>
                {(['auto', 'linkedin', 'email', 'outreach', 'blog', 'product', 'strategy', 'tech'] as Intent[]).map((intent) => (
                  <button
                    key={intent}
                    onClick={() => setSelectedIntent(intent)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: selectedIntent === intent ? '#1a1a1a' : 'var(--surface)',
                      color: selectedIntent === intent ? '#fff' : 'var(--text-secondary)',
                      border: selectedIntent === intent ? 'none' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {intent.charAt(0).toUpperCase() + intent.slice(1)}
                  </button>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors group"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Use directly inside ChatGPT 
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                </a>
              </motion.div>
            </motion.div>
          )}

          {phase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex justify-center"
            >
              <ProgressBar />
            </motion.div>
          )}

          {phase === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <ResultCard 
                result={result} 
                onCopy={handleCopy} 
                onReset={handleReset} 
                isFirstSearch={searchCount === 1}
                onElevate={handleElevate}
                isElevating={isElevating}
                showExtensionBanner={showExtension}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Before/After and Frameworks Sections */}
      <AnimatePresence>
        {phase === 'input' && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.5 }}
           >
             <InteractiveBeforeAfter />
             <FrameworkCarousel />
           </motion.div>
        )}
      </AnimatePresence>

      <Companion />

      <SideSignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)} 
        onSignup={handleSignup}
      />
    </div>
  );
}