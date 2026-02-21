import React, { useEffect, useState } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { ProgressBar } from '../components/Loading';

const processingSteps = [
  'Reviewing your context',
  'Structuring your draft',
  'Refining for clarity',
  'Finalizing document',
];

export function ProcessingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepDuration = 1200;
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate('/results'), 500);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-[480px]">
        <div className="mb-12">
          <ProgressBar duration={5000} />
        </div>

        <div className="text-center space-y-8">
          {processingSteps.map((step, index) => (
            <div
              key={index}
              className={`transition-all duration-[300ms] ${
                index === currentStep
                  ? 'opacity-100 scale-100'
                  : index < currentStep
                  ? 'opacity-40 scale-95'
                  : 'opacity-0 scale-95'
              }`}
            >
              <p className="text-[var(--text-body)] text-text-secondary">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
