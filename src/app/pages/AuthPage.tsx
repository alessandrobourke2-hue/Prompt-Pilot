import React, { useState } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { supabase, isSupabaseConfigured } from '../../utils/supabase/client';

type Mode = 'signin' | 'signup';

const REDIRECT_URL = `${window.location.origin}/auth/callback`;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.173 9.497c-.02-2.108 1.724-3.128 1.803-3.177-.985-1.44-2.517-1.637-3.058-1.657-1.299-.132-2.543.77-3.202.77-.659 0-1.672-.753-2.75-.731-1.41.02-2.715.82-3.44 2.082-1.473 2.552-.376 6.327 1.055 8.396.703 1.013 1.538 2.147 2.632 2.106 1.058-.042 1.456-.681 2.734-.681 1.278 0 1.632.681 2.75.66 1.138-.021 1.857-1.032 2.552-2.05.807-1.175 1.139-2.314 1.158-2.374-.025-.01-2.213-.85-2.234-3.344ZM11.07 3.17C11.638 2.48 12.025 1.524 11.92.55c-.83.035-1.836.556-2.43 1.228-.534.612-.999 1.588-.874 2.524.927.07 1.876-.47 2.454-1.132Z" fill="currentColor"/>
    </svg>
  );
}

function MissingConfigBanner() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="w-full max-w-[400px] text-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-xl mx-auto mb-6"
          style={{ backgroundColor: '#1a1a1a', color: '#fff' }}
        >
          P
        </div>
        <h1 className="font-serif text-xl font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
          App configuration missing
        </h1>
        <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
          <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-raised)' }}>
            VITE_SUPABASE_URL
          </code>{' '}and{' '}
          <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--surface-raised)' }}>
            VITE_SUPABASE_ANON_KEY
          </code>{' '}
          are not set.
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Add them in Vercel → Project Settings → Environment Variables, then redeploy.
        </p>
      </div>
    </div>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    clearError();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: REDIRECT_URL },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    clearError();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: REDIRECT_URL },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      navigate('/app');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      navigate('/app');
    }
  };

  if (!isSupabaseConfigured) return <MissingConfigBanner />;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="w-full max-w-[400px]">

        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-xl mx-auto mb-4"
            style={{ backgroundColor: '#1a1a1a', color: '#fff' }}
          >
            P
          </div>
          <h1 className="font-serif text-2xl font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            PromptPilot
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm"
            style={{
              backgroundColor: 'var(--error-bg)',
              border: '1px solid #fca5a5',
              color: 'var(--error)',
            }}
          >
            {error}
          </div>
        )}

        {/* OAuth buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
            style={{
              border: '1px solid var(--border-default)',
              backgroundColor: '#ffffff',
              color: 'var(--text-primary)',
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleAppleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
          >
            <AppleIcon />
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Email/password form */}
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                Full name
              </label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
                style={{
                  border: '1px solid var(--border-default)',
                  backgroundColor: '#ffffff',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
              style={{
                border: '1px solid var(--border-default)',
                backgroundColor: '#ffffff',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              Password
            </label>
            <input
              type="password"
              placeholder={mode === 'signup' ? 'At least 8 characters' : '••••••••'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={mode === 'signup' ? 8 : undefined}
              required
              className="w-full px-4 py-3 rounded-xl text-sm transition-all outline-none"
              style={{
                border: '1px solid var(--border-default)',
                backgroundColor: '#ffffff',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-medium transition-all mt-2 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
          >
            {loading
              ? 'Please wait…'
              : mode === 'signin'
              ? 'Sign in'
              : 'Create account'}
          </button>
        </form>

        {/* Toggle mode */}
        <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); clearError(); }}
            className="font-medium underline underline-offset-2 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-primary)' }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {/* Back to home */}
        <p className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs hover:opacity-70 transition-opacity"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back to home
          </button>
        </p>

      </div>
    </div>
  );
}
