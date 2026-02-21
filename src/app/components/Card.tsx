import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, hoverable = false }: CardProps) {
  const hoverStyles = hoverable || onClick 
    ? 'cursor-pointer hover:border-border-default transition-all duration-[250ms]' 
    : '';
  
  return (
    <div 
      className={`bg-white border border-border-subtle rounded-[8px] ${hoverStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

interface DocumentCardProps {
  title: string;
  type: string;
  date: string;
  onClick?: () => void;
}

export function DocumentCard({ title, type, date, onClick }: DocumentCardProps) {
  return (
    <Card onClick={onClick} hoverable>
      <div className="p-6">
        <p className="text-[var(--text-small)] text-text-secondary mb-2">{type}</p>
        <h4 className="text-[var(--text-body)] font-medium text-text-primary mb-1">{title}</h4>
        <p className="text-[var(--text-small)] text-text-muted">{date}</p>
      </div>
    </Card>
  );
}

interface TemplateCardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export function TemplateCard({ title, description, onClick }: TemplateCardProps) {
  return (
    <Card onClick={onClick} hoverable>
      <div className="p-6">
        <h4 className="text-[var(--text-body)] font-medium text-text-primary mb-2">{title}</h4>
        <p className="text-[var(--text-small)] text-text-secondary">{description}</p>
      </div>
    </Card>
  );
}
