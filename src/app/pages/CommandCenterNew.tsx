import React, { useState } from 'react';
import * as ReactRouter from 'react-router';
const { Link, useLocation, useNavigate } = ReactRouter;
import { 
  Home, 
  Library, 
  History, 
  BarChart3, 
  User, 
  Clock,
  Zap,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePilotStore } from '../state/pilotStore';
import { seedDemoData } from '../utils/demoData';

// Left Rail Navigation
function LeftRail() {
  const location = useLocation();
  
  const navItems = [
    { path: '/app', label: 'Home', icon: Home },
    { path: '/app/library', label: 'Library', icon: Library },
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
    <div className="fixed left-0 top-0 h-screen w-56 flex flex-col border-r" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link to="/app" className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-serif font-bold text-lg" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            P
          </div>
          <span className="font-serif font-semibold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>PromptPilot</span>
        </Link>
        <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>
          Home
        </p>
      </div>
      <nav className="flex-1 px-2 py-5 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active ? '' : 'hover:opacity-80'
              }`}
              style={{
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: active ? 'var(--overlay)' : 'transparent',
              }}
            >
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t space-y-0.5" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link
          to="/app/account"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            location.pathname === '/app/account' ? '' : 'hover:opacity-80'
          }`}
          style={{
            color: location.pathname === '/app/account' ? 'var(--text-primary)' : 'var(--text-secondary)',
            backgroundColor: location.pathname === '/app/account' ? 'var(--overlay)' : 'transparent',
          }}
        >
          <User size={18} strokeWidth={1.8} />
          Account
        </Link>
        <div className="mx-2 mt-2 p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Free</p>
            <Link to="/pricing" className="text-xs font-medium transition-colors" style={{ color: 'var(--accent)' }}>
              Upgrade
            </Link>
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
          className="text-sm font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <LeftRail />
      
      <div className="ml-56 min-h-screen flex flex-col">
        {userName && (
          <div className="px-8 pt-8">
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              Welcome back, {userName}
            </p>
          </div>
        )}
        
        <main className="flex-1 px-8 pt-12 pb-24 max-w-[800px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="mb-12"
          >
            <div 
              className="relative rounded-2xl border transition-all duration-200"
              style={{
                minHeight: '160px',
                backgroundColor: 'var(--surface-elevated)',
                borderColor: isFocused ? 'var(--border-default)' : 'var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <textarea
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="What would you like to build today?"
                className="w-full h-[120px] bg-transparent resize-none outline-none px-6 pt-6 pb-4 text-[17px] font-normal leading-relaxed placeholder:font-normal"
                style={{ color: 'var(--text-primary)' }}
                onKeyDown={handleKeyDown}
              />
              {!heroInput && !isFocused && (
                <div className="absolute left-6 top-16 pointer-events-none text-[15px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  Try: Optimize a headline… Rewrite an email… Structure a brief…
                </div>
              )}
              <div className="absolute right-6 bottom-5">
                <button
                  onClick={handleEnhance}
                  disabled={!heroInput.trim()}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: heroInput.trim() ? 'var(--accent)' : 'var(--surface)',
                    color: heroInput.trim() ? '#fff' : 'var(--text-muted)',
                    border: heroInput.trim() ? 'none' : '1px solid var(--border-subtle)',
                  }}
                >
                  Enhance
                  <ArrowRight size={18} strokeWidth={2} />
                </button>
              </div>
              {heroInput.trim() && (
                <div className="absolute left-6 bottom-5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  ⌘ Enter
                </div>
              )}
            </div>
            <div className="mt-6 text-center">
              <Link to="/app/library" className="text-sm font-medium transition-colors" style={{ color: 'var(--text-muted)' }}>
                or explore Library →
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="flex items-center justify-center gap-3 mb-20"
          >
            <button
              onClick={handleContinueLast}
              disabled={!lastPrompt}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border"
              style={{
                backgroundColor: lastPrompt ? 'var(--surface-elevated)' : 'var(--surface)',
                color: lastPrompt ? 'var(--text-primary)' : 'var(--text-muted)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              Continue last
            </button>
            <button
              onClick={() => navigate('/app/library')}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200"
              style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}
            >
              Open Library
            </button>
          </motion.div>

          {lastPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className="mb-20"
            >
              <h2 className="text-sm font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
                Continue where you left off
              </h2>
              <div
                onClick={handleContinueLast}
                className="rounded-2xl p-6 border cursor-pointer transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl font-medium mb-2 leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {lastPrompt.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                      {lastPrompt.structure && (
                        <span className="rounded-full px-2.5 py-1 border text-[12px]" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
                          {lastPrompt.structure}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {formatTimeAgo(lastPrompt.lastUsed || lastPrompt.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="w-40 h-16 shrink-0 rounded-xl border overflow-hidden relative" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
                    <AnimatedPreview />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {recentPrompts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Recent</h2>
                <button
                  type="button"
                  onClick={() => navigate('/app/history')}
                  className="text-sm font-medium flex items-center gap-1.5 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  View all
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {recentPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      sessionStorage.setItem('pp_continue_prompt', JSON.stringify(prompt));
                      navigate('/app/input');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && (sessionStorage.setItem('pp_continue_prompt', JSON.stringify(prompt)), navigate('/app/input'))}
                    className="flex items-center justify-between px-5 py-3.5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-sm"
                    style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] font-medium mb-0.5 leading-snug" style={{ color: 'var(--text-primary)' }}>{prompt.title}</h4>
                      <div className="flex items-center gap-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        {prompt.structure && <span>{prompt.structure}</span>}
                        <span className="flex items-center gap-1.5"><Clock size={12} />{formatTimeAgo(prompt.lastUsed || prompt.createdAt)}</span>
                      </div>
                    </div>
                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!lastPrompt && recentPrompts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.3 }}
              className="text-center py-24"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
                <Zap size={28} style={{ color: 'var(--text-muted)' }} />
              </div>
              <h3 className="font-serif text-xl font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Let’s build</h3>
              <p className="text-sm max-w-sm mx-auto mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Start in the prompt bar above or explore the Library.
              </p>
              <button type="button" onClick={handleSeedDemo} className="text-sm font-medium underline underline-offset-2 transition-colors" style={{ color: 'var(--text-muted)' }}>
                Load demo data
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}