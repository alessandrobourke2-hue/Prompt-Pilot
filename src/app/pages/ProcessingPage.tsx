import React, { useEffect, useRef, useState } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate, useLocation } = ReactRouter;
import { ProgressBar } from '../components/Loading';
import { executeWorkflow, SAMPLE_WORKFLOW } from '../utils/workflowApi';
import { usePilotStore } from '../state/pilotStore';

const processingSteps = [
  'Reviewing your context',
  'Structuring your draft',
  'Refining for clarity',
  'Finalizing document',
];

interface ProcessingPageProps {
  useWorkflow?: boolean;
}

export function ProcessingPage({ useWorkflow = false }: ProcessingPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const saveWorkflowResult = usePilotStore((s) => s.saveWorkflowResult);
  const hasRun = useRef(false);

  // Step animation — always runs for visual feedback
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(interval);
          if (!useWorkflow) {
            setTimeout(() => navigate('/results'), 500);
          }
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [navigate, useWorkflow]);

  // Workflow execution — runs in parallel with animation when useWorkflow=true
  useEffect(() => {
    if (!useWorkflow || hasRun.current) return;
    hasRun.current = true;

    const rawInput: string = (location.state as { input?: string } | null)?.input ?? '';

    executeWorkflow(SAMPLE_WORKFLOW, { input: rawInput })
      .then((result) => {
        saveWorkflowResult({
          id: crypto.randomUUID(),
          workflowId: result.workflow_id,
          createdAt: new Date().toISOString(),
          outputs: result.outputs,
          trace: result.trace,
        });
        navigate('/results');
      })
      .catch(() => {
        navigate('/results');
      });
  }, [useWorkflow, location.state, navigate, saveWorkflowResult]);

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
