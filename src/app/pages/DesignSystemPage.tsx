import React, { useState } from 'react';
import * as ReactRouter from 'react-router';
const { Link } = ReactRouter;
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TextArea } from '../components/TextArea';
import { Select } from '../components/Select';
import { Card, DocumentCard, TemplateCard } from '../components/Card';
import { Modal } from '../components/Modal';
import { ProgressBar, LoadingSpinner, PulseLoader } from '../components/Loading';
import { useToast } from '../components/Toast';

export function DesignSystemPage() {
  const [showModal, setShowModal] = useState(false);
  const { showToast, ToastContainer } = useToast();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border-subtle bg-white sticky top-0 z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[var(--text-h3)] font-serif font-medium text-charcoal">
              Prompt Pilot Design System
            </h1>
            <Link to="/" className="text-[var(--text-body)] text-text-secondary hover:text-text-primary transition-colors duration-[250ms]">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16">
        {/* Design Principles */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Design Principles
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            Prompt Pilot embodies calm intelligence for high-stakes business moments. 
            Every design decision reduces anxiety and conveys structured confidence.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Visual Restraint', desc: 'Generous white space, minimal decoration, no gradients or bright colors' },
              { title: 'Invisible Complexity', desc: 'Business language only. Never show technical AI terminology' },
              { title: 'Calm Confidence', desc: 'No hype, no urgency tactics, understated calls-to-action' },
              { title: 'Effortless Progression', desc: 'One primary action per screen, smart defaults, clear hierarchy' },
            ].map((principle, i) => (
              <Card key={i} className="p-6">
                <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-2">{principle.title}</h4>
                <p className="text-[var(--text-small)] text-text-secondary leading-[1.5]">{principle.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Color System */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Color System
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            Restrained palette meeting WCAG 2.1 AA standards. All colors maintain 4.5:1 contrast minimum.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-4">Primary Colors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="h-24 bg-[#2C2C2C] rounded-[8px] border border-border-subtle mb-3" />
                  <p className="text-[var(--text-small)] font-medium text-charcoal">Charcoal</p>
                  <p className="text-[var(--text-small)] text-text-muted">#2C2C2C</p>
                </div>
                <div>
                  <div className="h-24 bg-[#F5F5F3] rounded-[8px] border border-border-subtle mb-3" />
                  <p className="text-[var(--text-small)] font-medium text-charcoal">Warm Gray</p>
                  <p className="text-[var(--text-small)] text-text-muted">#F5F5F3</p>
                </div>
                <div>
                  <div className="h-24 bg-white rounded-[8px] border border-border-subtle mb-3" />
                  <p className="text-[var(--text-small)] font-medium text-charcoal">White</p>
                  <p className="text-[var(--text-small)] text-text-muted">#FFFFFF</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[var(--text-h3)] font-serif font-medium text-charcoal mb-4">Accent Color</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[480px]">
                <div>
                  <div className="h-24 bg-[#1A365D] rounded-[8px] border border-border-subtle mb-3" />
                  <p className="text-[var(--text-small)] font-medium text-charcoal">Deep Navy</p>
                  <p className="text-[var(--text-small)] text-text-muted">#1A365D</p>
                </div>
                <div>
                  <div className="h-24 bg-[#2D4A7C] rounded-[8px] border border-border-subtle mb-3" />
                  <p className="text-[var(--text-small)] font-medium text-charcoal">Navy Light</p>
                  <p className="text-[var(--text-small)] text-text-muted">#2D4A7C</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Typography
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            Professional serif for headings (Crimson Pro), clean sans-serif for body (Inter).
          </p>

          <div className="space-y-8 bg-warm-gray border border-border-subtle rounded-[8px] p-8">
            <div>
              <p className="text-[var(--text-small)] text-text-secondary mb-2">Desktop H1 - 48px - Crimson Pro Medium</p>
              <h1 className="text-[48px] font-serif font-medium text-charcoal leading-[1.2]">
                When the document matters
              </h1>
            </div>

            <div>
              <p className="text-[var(--text-small)] text-text-secondary mb-2">Desktop H2 - 36px - Crimson Pro Medium</p>
              <h2 className="text-[36px] font-serif font-medium text-charcoal leading-[1.2]">
                Built for high-stakes moments
              </h2>
            </div>

            <div>
              <p className="text-[var(--text-small)] text-text-secondary mb-2">Desktop H3 - 24px - Crimson Pro Medium</p>
              <h3 className="text-[24px] font-serif font-medium text-charcoal leading-[1.5]">
                Effortless refinement
              </h3>
            </div>

            <div>
              <p className="text-[var(--text-small)] text-text-secondary mb-2">Body - 16px - Inter Regular - 1.6 line height</p>
              <p className="text-[16px] text-text-primary leading-[1.6]">
                Transform unclear ideas into structured, executive-ready drafts. 
                Join professionals who trust Prompt Pilot for their most important documents.
              </p>
            </div>

            <div>
              <p className="text-[var(--text-small)] text-text-secondary mb-2">Small - 14px - Inter Regular</p>
              <p className="text-[14px] text-text-secondary">
                Supporting text and metadata display
              </p>
            </div>
          </div>
        </section>

        {/* Spacing System */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Spacing System
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            8px base system: 8 / 16 / 24 / 32 / 48 / 64 / 96
          </p>

          <div className="space-y-4 max-w-[600px]">
            {[
              { size: '8px', var: '--space-1' },
              { size: '16px', var: '--space-2' },
              { size: '24px', var: '--space-3' },
              { size: '32px', var: '--space-4' },
              { size: '48px', var: '--space-6' },
              { size: '64px', var: '--space-8' },
              { size: '96px', var: '--space-12' },
            ].map((space) => (
              <div key={space.size} className="flex items-center gap-4">
                <div className="w-32 text-[var(--text-small)] text-text-secondary">{space.var}</div>
                <div 
                  className="h-8 bg-accent rounded-[4px]" 
                  style={{ width: space.size }}
                />
                <div className="text-[var(--text-small)] text-text-muted">{space.size}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Buttons */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Buttons
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            Three variants with subtle hover states. Transitions: 250ms.
          </p>

          <div className="space-y-8">
            <div className="bg-warm-gray border border-border-subtle rounded-[8px] p-8">
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-4">Primary</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Create draft</Button>
                <Button variant="primary" size="large">Start your draft</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
            </div>

            <div className="bg-warm-gray border border-border-subtle rounded-[8px] p-8">
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-4">Secondary</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">Refine</Button>
                <Button variant="secondary" size="large">View options</Button>
                <Button variant="secondary" disabled>Disabled</Button>
              </div>
            </div>

            <div className="bg-warm-gray border border-border-subtle rounded-[8px] p-8">
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-4">Text</h4>
              <div className="flex flex-wrap gap-4">
                <Button variant="text">View structure</Button>
                <Button variant="text" size="large">Learn more</Button>
                <Button variant="text" disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Inputs */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Form Inputs
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            Clean focus states with calm error handling.
          </p>

          <div className="max-w-[600px] space-y-6">
            <Input 
              label="Text Input"
              placeholder="Board update, client proposal..."
              helperText="Supporting text appears below the field"
            />

            <Input 
              label="With Error"
              placeholder="Required field"
              error="This field is required"
            />

            <TextArea
              label="Text Area"
              placeholder="Share key points, data, or specific requirements..."
              rows={4}
              helperText="Your information remains private and secure"
            />

            <Select
              label="Select"
              options={[
                { value: 'professional', label: 'Professional' },
                { value: 'strategic', label: 'Strategic' },
                { value: 'analytical', label: 'Analytical' },
              ]}
            />
          </div>
        </section>

        {/* Cards */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Cards
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            Minimal borders, subtle hover states for interactive cards.
          </p>

          <div className="space-y-8">
            <div>
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-4">Document Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px]">
                <DocumentCard
                  title="Q4 2025 Board Update"
                  type="Board Update"
                  date="February 18, 2026"
                />
                <DocumentCard
                  title="Client Proposal: Enterprise Platform"
                  type="Client Proposal"
                  date="February 15, 2026"
                />
              </div>
            </div>

            <div>
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-4">Template Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px]">
                <TemplateCard
                  title="Board Update"
                  description="Quarterly performance summary for board meetings"
                />
                <TemplateCard
                  title="Executive Summary"
                  description="Distill complex analysis into decision briefs"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Loading States */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Loading States
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            Subtle, calm animations. No dramatic spinners.
          </p>

          <div className="space-y-8 max-w-[600px]">
            <div className="bg-warm-gray border border-border-subtle rounded-[8px] p-8">
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-4">Progress Bar</h4>
              <ProgressBar duration={5000} />
            </div>

            <div className="bg-warm-gray border border-border-subtle rounded-[8px] p-8">
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-4">Pulse Loader</h4>
              <PulseLoader text="Reviewing your context" />
            </div>

            <div className="bg-warm-gray border border-border-subtle rounded-[8px] p-8">
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-4">Spinner</h4>
              <div className="flex gap-4 items-center">
                <LoadingSpinner size="small" />
                <LoadingSpinner size="medium" />
                <LoadingSpinner size="large" />
              </div>
            </div>
          </div>
        </section>

        {/* Modals & Toasts */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Modals & Toasts
          </h2>
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-8 max-w-[720px]">
            Calm tone for all system messages.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" onClick={() => setShowModal(true)}>
              Show Modal
            </Button>
            <Button variant="secondary" onClick={() => showToast('Draft saved')}>
              Show Toast
            </Button>
          </div>
        </section>

        {/* Emotional Benchmark */}
        <section className="mb-24">
          <h2 className="text-[var(--text-h2)] font-serif font-medium text-charcoal mb-4">
            Emotional Benchmark
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px]">
            <div className="bg-warm-gray border border-border-subtle rounded-[8px] p-6">
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-3">Should feel like</h4>
              <ul className="space-y-2 text-[var(--text-body)] text-text-secondary">
                <li>• Private wealth platform</li>
                <li>• Top-tier consulting firm</li>
                <li>• Executive briefing room</li>
              </ul>
            </div>

            <div className="bg-white border border-border-default rounded-[8px] p-6">
              <h4 className="text-[var(--text-body)] font-medium text-charcoal mb-3">Should NOT feel like</h4>
              <ul className="space-y-2 text-[var(--text-body)] text-text-secondary">
                <li>• Startup SaaS dashboard</li>
                <li>• Playful productivity app</li>
                <li>• Technical AI tool</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Example Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Example Modal"
      >
        <p className="text-[var(--text-body)] text-text-secondary leading-[1.6] mb-6">
          Modals use calm, understated styling. No dramatic animations or excessive decoration.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Confirm
          </Button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}
