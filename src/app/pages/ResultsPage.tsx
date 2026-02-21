import React, { useState } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { Navigation } from '../components/Navigation';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';

export function ResultsPage() {
  const navigate = useNavigate();
  const [showStructure, setShowStructure] = useState(false);
  const [showRefinements, setShowRefinements] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleExport = () => {
    showToast('Draft saved');
  };

  const handleRefinement = (type: string) => {
    showToast(`Refining document to be more ${type}`);
    setShowRefinements(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="app" />
      
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border-subtle">
          <div>
            <h1 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-1">
              Board Update: Q4 Performance
            </h1>
            <p className="text-[var(--text-small)] text-text-secondary">
              Created February 18, 2026
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              variant="text" 
              onClick={() => setShowStructure(true)}
            >
              View structure
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowRefinements(true)}
            >
              Refine
            </Button>
            <Button 
              variant="primary" 
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <div className="max-w-[720px] mx-auto">
          <article className="prose prose-lg">
            <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-6">
              Q4 2025: Strategic Performance Review
            </h2>

            <section className="mb-8">
              <h3 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-4">
                Executive Summary
              </h3>
              <p className="text-[var(--text-body)] text-text-primary leading-[1.6] mb-4">
                Q4 delivered exceptional performance across our key strategic metrics. Revenue growth 
                of 23% year-over-year reflects successful enterprise market penetration and improved 
                operational efficiency. Our margin expansion demonstrates the scalability of our 
                business model as we continue investing strategically in team capabilities and product 
                development.
              </p>
              <p className="text-[var(--text-body)] text-text-primary leading-[1.6]">
                These results position us strongly for continued growth while maintaining the 
                disciplined execution that has characterized our approach throughout 2025.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-4">
                Financial Performance
              </h3>
              <p className="text-[var(--text-body)] text-text-primary leading-[1.6] mb-4">
                Revenue growth of 23% represents our strongest quarterly performance to date. This 
                acceleration stems from three key drivers: successful conversion of enterprise 
                pipeline, improved retention metrics, and operational leverage across our existing 
                customer base.
              </p>
              <p className="text-[var(--text-body)] text-text-primary leading-[1.6]">
                Margin improvement reflects both revenue quality and operational maturity. Our 
                efficiency gains create capacity for strategic investments while preserving healthy 
                unit economics.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-4">
                Market Position
              </h3>
              <p className="text-[var(--text-body)] text-text-primary leading-[1.6] mb-4">
                New enterprise deals in Q4 validate our market positioning and solution 
                differentiation. Customer profiles reflect increasing sophistication in requirements, 
                which aligns well with our product roadmap and go-to-market strategy.
              </p>
              <p className="text-[var(--text-body)] text-text-primary leading-[1.6]">
                Our expanded team brings critical capabilities in key growth areas, positioning us 
                to capitalize on emerging opportunities while maintaining service excellence.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-4">
                Strategic Trajectory
              </h3>
              <p className="text-[var(--text-body)] text-text-primary leading-[1.6] mb-4">
                Looking ahead, our refined product roadmap addresses both near-term market 
                opportunities and longer-term platform ambitions. Recent roadmap adjustments 
                reflect customer feedback and competitive dynamics, ensuring we remain responsive 
                while maintaining strategic coherence.
              </p>
              <p className="text-[var(--text-body)] text-text-primary leading-[1.6]">
                The foundation established in Q4 supports continued momentum. Our focus remains on 
                sustainable growth, operational excellence, and maintaining the strategic discipline 
                that drives long-term value creation.
              </p>
            </section>
          </article>
        </div>
      </div>

      {/* Structure Modal */}
      <Modal
        isOpen={showStructure}
        onClose={() => setShowStructure(false)}
        title="Document Structure"
      >
        <div className="space-y-6">
          <div>
            <p className="text-[var(--text-small)] text-text-secondary mb-2">Structure type</p>
            <p className="text-[var(--text-body)] text-text-primary font-medium">
              Executive Brief
            </p>
          </div>

          <div>
            <p className="text-[var(--text-small)] text-text-secondary mb-3">Sections</p>
            <div className="space-y-2">
              {[
                'Executive Summary',
                'Financial Performance',
                'Market Position',
                'Strategic Trajectory',
              ].map((section, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <p className="text-[var(--text-body)] text-text-primary">{section}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[var(--text-small)] text-text-secondary mb-2">Reading time</p>
            <p className="text-[var(--text-body)] text-text-primary">4 minutes</p>
          </div>
        </div>
      </Modal>

      {/* Refinements Modal */}
      <Modal
        isOpen={showRefinements}
        onClose={() => setShowRefinements(false)}
        title="Refine your draft"
      >
        <div className="space-y-4">
          <button
            onClick={() => handleRefinement('strategic')}
            className="w-full text-left p-4 border border-border-default rounded-[6px] hover:bg-surface transition-all duration-[250ms]"
          >
            <p className="text-[var(--text-body)] font-medium text-text-primary mb-1">
              Make more strategic
            </p>
            <p className="text-[var(--text-small)] text-text-secondary">
              Emphasize high-level implications and future positioning
            </p>
          </button>

          <button
            onClick={() => handleRefinement('concise')}
            className="w-full text-left p-4 border border-border-default rounded-[6px] hover:bg-surface transition-all duration-[250ms]"
          >
            <p className="text-[var(--text-body)] font-medium text-text-primary mb-1">
              Condense
            </p>
            <p className="text-[var(--text-small)] text-text-secondary">
              Reduce length while preserving key insights
            </p>
          </button>

          <button
            onClick={() => handleRefinement('detailed')}
            className="w-full text-left p-4 border border-border-default rounded-[6px] hover:bg-surface transition-all duration-[250ms]"
          >
            <p className="text-[var(--text-body)] font-medium text-text-primary mb-1">
              Add financial depth
            </p>
            <p className="text-[var(--text-small)] text-text-secondary">
              Expand on metrics and quantitative analysis
            </p>
          </button>

          <button
            onClick={() => handleRefinement('accessible')}
            className="w-full text-left p-4 border border-border-default rounded-[6px] hover:bg-surface transition-all duration-[250ms]"
          >
            <p className="text-[var(--text-body)] font-medium text-text-primary mb-1">
              Simplify language
            </p>
            <p className="text-[var(--text-small)] text-text-secondary">
              Make more accessible without losing substance
            </p>
          </button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}
