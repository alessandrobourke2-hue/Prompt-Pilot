import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  duration?: number;
}

export function ProgressBar({ duration = 3000 }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 50;
    const increment = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <div className="w-full h-[2px] bg-border-subtle overflow-hidden">
      <div 
        className="h-full bg-accent transition-all duration-[250ms]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
  const sizes = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-3',
  };

  return (
    <div 
      className={`${sizes[size]} border-border-default border-t-accent rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}

interface PulseLoaderProps {
  text: string;
}

export function PulseLoader({ text }: PulseLoaderProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-[var(--text-body)] text-text-secondary">{text}</p>
    </div>
  );
}
