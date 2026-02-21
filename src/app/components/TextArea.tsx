import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function TextArea({ 
  label, 
  error, 
  helperText,
  className = '',
  ...props 
}: TextAreaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[var(--text-body)] font-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 border rounded-[6px] bg-white transition-all duration-[250ms] resize-none
          ${error 
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error-bg' 
            : 'border-border-default focus:border-accent focus:ring-2 focus:ring-accent/10'
          }
          placeholder:text-text-muted
          disabled:bg-surface disabled:cursor-not-allowed disabled:opacity-60
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-[var(--text-small)] text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-[var(--text-small)] text-text-secondary">{helperText}</p>
      )}
    </div>
  );
}
