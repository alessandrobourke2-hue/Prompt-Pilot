import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ 
  label, 
  error, 
  options,
  className = '',
  ...props 
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-[var(--text-body)] font-medium text-text-primary">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 border rounded-[6px] bg-white transition-all duration-[250ms] appearance-none cursor-pointer
          ${error 
            ? 'border-error focus:border-error focus:ring-2 focus:ring-error-bg' 
            : 'border-border-default focus:border-accent focus:ring-2 focus:ring-accent/10'
          }
          disabled:bg-surface disabled:cursor-not-allowed disabled:opacity-60
          ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%232C2C2C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 1rem center',
          backgroundSize: '12px 8px',
          paddingRight: '3rem',
        }}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-[var(--text-small)] text-error">{error}</p>
      )}
    </div>
  );
}
