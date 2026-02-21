import React from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { Navigation } from '../components/Navigation';
import { Button } from '../components/Button';
import { DocumentCard, TemplateCard } from '../components/Card';

export function DashboardPage() {
  const navigate = useNavigate();

  const recentDocuments = [
    { title: 'Q4 2025 Board Update', type: 'Board Update', date: 'February 18, 2026' },
    { title: 'Client Proposal: Enterprise Platform', type: 'Client Proposal', date: 'February 15, 2026' },
    { title: 'Annual Strategy Brief', type: 'Strategy Document', date: 'February 10, 2026' },
    { title: 'Performance Review: Engineering Lead', type: 'Performance Review', date: 'February 5, 2026' },
  ];

  const templates = [
    { title: 'Board Update', description: 'Quarterly performance summary for board meetings' },
    { title: 'Client Proposal', description: 'Structured proposal for enterprise opportunities' },
    { title: 'Executive Summary', description: 'Distill complex analysis into decision briefs' },
    { title: 'Investment Memo', description: 'Framework for investment recommendations' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="app" />
      
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-6">
            Your documents
          </h1>
          
          <Button 
            variant="primary" 
            onClick={() => navigate('/input')}
          >
            Start new draft
          </Button>
        </div>

        {/* Recent Documents */}
        <section className="mb-16">
          <h2 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-6">
            Recent
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDocuments.map((doc, index) => (
              <DocumentCard
                key={index}
                title={doc.title}
                type={doc.type}
                date={doc.date}
                onClick={() => navigate('/results')}
              />
            ))}
          </div>
        </section>

        {/* Templates */}
        <section>
          <h2 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-6">
            Start from template
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template, index) => (
              <TemplateCard
                key={index}
                title={template.title}
                description={template.description}
                onClick={() => navigate('/input')}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
