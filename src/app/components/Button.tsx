import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'default' | 'large';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'default',
  className = '',
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-[250ms] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-charcoal text-white hover:opacity-90 focus-visible:outline-charcoal',
    secondary: 'bg-transparent border border-border-default text-charcoal hover:bg-surface focus-visible:outline-charcoal',
    text: 'bg-transparent text-charcoal hover:opacity-70 focus-visible:outline-charcoal',
  };
  
  const sizes = {
    default: 'px-6 py-3 rounded-[6px]',
    large: 'px-8 py-4 rounded-[8px]',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
