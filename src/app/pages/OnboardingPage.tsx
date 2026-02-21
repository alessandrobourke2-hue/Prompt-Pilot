import React, { useState } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { Button } from '../components/Button';

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Indicator */}
      <div className="w-full border-b border-border-subtle">
        <div className="max-w-[640px] mx-auto px-6 py-4">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-[300ms] ${
                  i <= step ? 'bg-accent' : 'bg-border-subtle'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-[640px] w-full">
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-6">
                Welcome to Prompt Pilot
              </h2>
              
              <p className="text-[var(--text-body)] text-text-secondary mb-12 leading-[1.6] max-w-[500px] mx-auto">
                In 30 seconds, see how we transform vague business intent into structured, executive-ready documents.
              </p>

              <div className="bg-warm-gray border border-border-subtle rounded-[8px] p-8 mb-12 text-left">
                <p className="text-[var(--text-small)] text-text-secondary mb-4">Example scenario</p>
                <h3 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-2">
                  Board Update: Q4 Performance
                </h3>
                <p className="text-[var(--text-body)] text-text-secondary leading-[1.6]">
                  See how scattered metrics and insights become a compelling executive narrative.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="secondary" onClick={handleSkip}>
                  Skip introduction
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-6">
                Before: Scattered intent
              </h2>
              
              <p className="text-[var(--text-body)] text-text-secondary mb-8 leading-[1.6]">
                Start with rough notes and business context
              </p>

              <div className="bg-white border border-border-default rounded-[8px] p-8 mb-12 text-left">
                <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] italic">
                  "Need to update board on Q4. Revenue up 23%, margins improved, new enterprise deals. 
                  Also mention team expansion and product roadmap changes. Keep it strategic, 
                  they want to understand trajectory not just numbers."
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="secondary" onClick={handleSkip}>
                  Skip introduction
                </Button>
                <Button variant="primary" onClick={handleNext}>
                  See the result
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-6">
                After: Structured draft
              </h2>
              
              <p className="text-[var(--text-body)] text-text-secondary mb-8 leading-[1.6]">
                A polished, board-ready executive summary
              </p>

              <div className="bg-white border border-border-default rounded-[8px] p-8 mb-12 text-left">
                <h4 className="text-[18px] font-serif font-medium text-charcoal mb-4">
                  Q4 2025: Momentum and Strategic Positioning
                </h4>
                
                <div className="space-y-4 text-[var(--text-body)] text-text-primary leading-[1.6]">
                  <p>
                    Q4 delivered strong performance across key metrics, with revenue growth of 23% 
                    reflecting successful enterprise adoption and improved operational efficiency.
                  </p>
                  
                  <p>
                    Margin expansion demonstrates scalability of our business model as we invest 
                    strategically in team capabilities and product development.
                  </p>
                  
                  <p>
                    Looking ahead, our refined product roadmap positions us to capitalize on 
                    emerging market opportunities while maintaining disciplined execution.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={handleNext} size="large">
                  Start creating
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}