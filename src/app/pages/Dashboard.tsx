import React, { useState } from 'react';
import * as ReactRouter from 'react-router';
const { Link, useLocation, useNavigate } = ReactRouter;
import { 
  Home, 
  Library, 
  Workflow, 
  History, 
  BarChart3, 
  User, 
  Chrome,
  Plus,
  TrendingUp,
  Clock,
  Zap,
  Search,
  Star,
  Eye,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePilotStore } from '../state/pilotStore';
import { seedDemoData } from '../utils/demoData';

// Left Rail Navigation
function LeftRail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/app', label: 'Command Center', icon: Home },
    { path: '/app/library', label: 'Prompt Library', icon: Library },
    { path: '/app/workflows', label: 'Workflows', icon: Workflow },
    { path: '/app/history', label: 'History', icon: History },
    { path: '/app/usage', label: 'Usage', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-[#0F1115] flex flex-col">
      {/* Top */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-black font-serif font-bold text-lg">
            P
          </div>
          <span className="font-serif font-bold text-lg text-white">PromptPilot</span>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          Operator Environment
        </p>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                active
                  ? 'text-white bg-white/5 shadow-[inset_2px_0_0_0_rgba(255,255,255,0.8)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-800 space-y-1">
        <Link
          to="/app/account"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            location.pathname === '/app/account'
              ? 'text-white bg-white/5'
              : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
          }`}
        >
          <User size={18} />
          Account
        </Link>
        
        <div className="mt-3 px-3 py-2 bg-white/5 rounded-lg border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Free</p>
            <Link to="/pricing" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
              Upgrade
            </Link>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-xs text-gray-500">Extension Connected</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Top Bar
function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="h-18 flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-sm">
          <Plus size={18} />
          New Prompt
        </button>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
          <Chrome size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Extension</span>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
          JD
        </div>
      </div>
    </div>
  );
}

// Command Center Page
export function CommandCenter() {
  const navigate = useNavigate();
  const [heroInput, setHeroInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Get data from store
  const userName = usePilotStore(state => state.account.userName);
  const getLastPrompt = usePilotStore(state => state.getLastPrompt);
  const getRecentPrompts = usePilotStore(state => state.getRecentPrompts);
  const savePrompt = usePilotStore(state => state.savePrompt);
  const setLastPrompt = usePilotStore(state => state.setLastPrompt);
  
  const lastPrompt = getLastPrompt();
  const recentPrompts = getRecentPrompts();

  const handleSeedDemo = () => {
    seedDemoData(savePrompt, setLastPrompt);
    window.location.reload(); // Refresh to show new data
  };

  const handleEnhance = () => {
    if (heroInput.trim()) {
      // Store in sessionStorage for PromptInputPage to pick up
      sessionStorage.setItem('pp_hero_input', heroInput);
      navigate('/app/input');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd/Ctrl + Enter to enhance
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleEnhance();
    }
  };

  const handleContinueLast = () => {
    if (lastPrompt) {
      sessionStorage.setItem('pp_continue_prompt', JSON.stringify(lastPrompt));
      navigate('/app/input');
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInHours = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-[#0F1115]">
      <LeftRail />
      
      <div className="ml-60 min-h-screen flex flex-col">
        {/* Subtle Welcome Line */}
        {userName && (
          <div className="px-8 pt-6">
            <p className="text-xs text-gray-500 opacity-60">
              Welcome back, {userName}
            </p>
          </div>
        )}
        
        <main className="flex-1 px-8 pt-12 pb-16 max-w-[980px] mx-auto w-full">
          {/* 1️⃣ HERO ACTION AREA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Primary Prompt Bar */}
            <div 
              className={`relative bg-white/[0.03] backdrop-blur-md rounded-[20px] border transition-all duration-300 ${
                isFocused 
                  ? 'border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.08)]' 
                  : 'border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              }`}
              style={{ minHeight: '160px' }}
            >
              <textarea
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="What would you like to build today?"
                className="w-full h-[120px] bg-transparent text-white placeholder-gray-500 px-6 pt-6 pb-3 resize-none outline-none text-base font-normal"
                onKeyDown={handleKeyDown}
              />
              
              {/* Placeholder suggestions when empty */}
              {!heroInput && !isFocused && (
                <div className="absolute left-6 top-16 pointer-events-none">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Try:<br />
                    • Optimize this sales headline…<br />
                    • Rewrite this email…<br />
                    • Improve clarity of this paragraph…
                  </p>
                </div>
              )}
              
              {/* Enhance button */}
              <div className="absolute right-6 bottom-6">
                <button
                  onClick={handleEnhance}
                  disabled={!heroInput.trim()}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    heroInput.trim()
                      ? 'bg-white text-black hover:bg-gray-100 hover:scale-105 shadow-lg'
                      : 'bg-white/10 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Enhance
                  <ArrowRight size={16} />
                </button>
              </div>
              
              {/* Keyboard hint */}
              {heroInput.trim() && (
                <div className="absolute left-6 bottom-6">
                  <p className="text-xs text-gray-600">
                    ⌘ Enter to enhance
                  </p>
                </div>
              )}
            </div>

            {/* Small link for advanced builder */}
            <div className="mt-4 text-center">
              <Link 
                to="/app/library"
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                or explore Blueprint Library →
              </Link>
            </div>
          </motion.div>

          {/* 2️⃣ QUICK ACTION ROW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-16"
          >
            <button
              onClick={handleContinueLast}
              disabled={!lastPrompt}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                lastPrompt
                  ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  : 'bg-white/[0.02] text-gray-600 cursor-not-allowed border border-white/5'
              }`}
            >
              Continue Last
            </button>
            
            <button
              onClick={() => navigate('/app/library')}
              className="px-5 py-2.5 rounded-full text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-all"
            >
              Open Library
            </button>
            
            <button
              disabled
              className="px-5 py-2.5 rounded-full text-sm font-medium bg-white/[0.02] text-gray-600 cursor-not-allowed border border-white/5"
            >
              Run Workflow
            </button>
          </motion.div>

          {/* 3️⃣ CONTINUE BUILDING SECTION */}
          {lastPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-16"
            >
              <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4 font-semibold">
                Continue Where You Left Off
              </h2>
              
              <div 
                onClick={handleContinueLast}
                className="bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left side */}
                  <div className="flex-1">
                    <h3 className="text-xl font-serif text-white mb-2 group-hover:text-gray-100 transition-colors">
                      {lastPrompt.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {lastPrompt.structure && (
                        <span className="inline-block bg-white/5 text-gray-400 px-2.5 py-1 rounded-full border border-white/10">
                          {lastPrompt.structure}
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {formatTimeAgo(lastPrompt.lastUsed || lastPrompt.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right side - Animated Preview */}
                  <div className="w-[280px] h-[100px] bg-black/30 rounded-xl border border-white/10 overflow-hidden relative">
                    <AnimatedPreview />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 4️⃣ RECENT PROMPTS */}
          {recentPrompts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
                  Recent
                </h2>
                <button 
                  onClick={() => navigate('/app/history')}
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors flex items-center gap-1"
                >
                  View All
                  <ChevronRight size={12} />
                </button>
              </div>
              
              <div className="space-y-2">
                {recentPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    onClick={() => {
                      sessionStorage.setItem('pp_continue_prompt', JSON.stringify(prompt));
                      navigate('/app/input');
                    }}
                    className="flex items-center justify-between px-5 py-3.5 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors mb-1">
                        {prompt.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        {prompt.structure && (
                          <span className="text-gray-500">{prompt.structure}</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          {formatTimeAgo(prompt.lastUsed || prompt.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} className="text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!lastPrompt && recentPrompts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Zap size={32} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-serif text-gray-400 mb-2">
                Let's Build
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto mb-6">
                Start typing in the prompt bar above or explore the Blueprint Library to get started.
              </p>
              
              {/* Demo data button for testing */}
              <button
                onClick={handleSeedDemo}
                className="text-xs text-gray-600 hover:text-gray-500 transition-colors underline"
              >
                Load demo data for testing
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

// Animated Preview Component
function AnimatedPreview() {
  const [step, setStep] = useState(0);
  
  const steps = [
    'Structuring…',
    'Enhancing clarity…',
    'Applying Elevate layer…',
    '✓ Output Ready'
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-gray-400 font-medium"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Placeholder pages for other routes
export function Workflows() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <LeftRail />
      <div className="ml-60">
        <TopBar title="Workflows" subtitle="Create and manage prompt workflows" />
        <main className="p-8">
          <div className="text-center py-20">
            <Workflow size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">Workflows</h2>
            <p className="text-gray-600">Coming soon - chain prompts into powerful workflows</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export function HistoryPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <LeftRail />
      <div className="ml-60">
        <TopBar title="History" subtitle="View your enhancement history" />
        <main className="p-8">
          <div className="text-center py-20">
            <History size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">History</h2>
            <p className="text-gray-600">Coming soon - track all your prompt enhancements</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export function UsagePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <LeftRail />
      <div className="ml-60">
        <TopBar title="Usage" subtitle="Monitor your usage and plan details" />
        <main className="p-8">
          <div className="text-center py-20">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">Usage</h2>
            <p className="text-gray-600">Coming soon - detailed usage metrics and analytics</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export function AccountPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <LeftRail />
      <div className="ml-60">
        <TopBar title="Account" subtitle="Manage your account settings" />
        <main className="p-8">
          <div className="text-center py-20">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">Account</h2>
            <p className="text-gray-600">Coming soon - account settings and preferences</p>
          </div>
        </main>
      </div>
    </div>
  );
}