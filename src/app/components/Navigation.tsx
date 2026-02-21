import React from 'react';
import * as ReactRouter from 'react-router';
const { Link } = ReactRouter;

interface NavigationProps {
  variant?: 'landing' | 'app';
}

export function Navigation({ variant = 'landing' }: NavigationProps) {
  return (
    <nav className="w-full border-b border-border-subtle bg-white">
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-4 flex items-center justify-between">
        <Link to="/" className="text-[20px] font-serif font-medium text-charcoal hover:opacity-70 transition-opacity duration-[250ms]">
          Prompt Pilot
        </Link>
        
        {variant === 'landing' && (
          <div className="flex items-center gap-6">
            <Link to="/design-system" className="text-[var(--text-body)] text-text-secondary hover:text-text-primary transition-colors duration-[250ms]">
              Design System
            </Link>
            <Link to="/onboarding">
              <button className="px-6 py-2 text-[var(--text-body)] text-charcoal hover:opacity-70 transition-opacity duration-[250ms]">
                Sign In
              </button>
            </Link>
          </div>
        )}
        
        {variant === 'app' && (
          <Link to="/dashboard" className="text-[var(--text-body)] text-text-secondary hover:text-text-primary transition-colors duration-[250ms]">
            Dashboard
          </Link>
        )}
      </div>
    </nav>
  );
}
