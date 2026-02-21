import React, { useState, useEffect } from 'react';
import * as ReactRouter from 'react-router';
const { useNavigate } = ReactRouter;
import { Navigation } from '../components/Navigation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { TextArea } from '../components/TextArea';
import { Select } from '../components/Select';

export function PromptInputPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    documentType: '',
    audience: '',
    tone: 'professional',
    context: '',
  });

  // Check for blueprint draft in sessionStorage on mount
  useEffect(() => {
    // Priority 1: Check for hero input (new quick flow)
    const heroInput = sessionStorage.getItem('pp_hero_input');
    if (heroInput) {
      setFormData({
        documentType: '',
        audience: '',
        tone: 'professional',
        context: heroInput,
      });
      sessionStorage.removeItem('pp_hero_input');
      return;
    }

    // Priority 2: Check for continue prompt
    const continuePrompt = sessionStorage.getItem('pp_continue_prompt');
    if (continuePrompt) {
      try {
        const prompt = JSON.parse(continuePrompt);
        setFormData({
          documentType: prompt.title || '',
          audience: '',
          tone: 'professional',
          context: prompt.input || prompt.enhancedPrompt || '',
        });
        sessionStorage.removeItem('pp_continue_prompt');
        return;
      } catch (e) {
        console.error('Failed to load continue prompt:', e);
      }
    }

    // Priority 3: Check for blueprint draft (library flow)
    const draftData = sessionStorage.getItem('pp_draft');
    if (draftData) {
      try {
        const draft = JSON.parse(draftData);
        setFormData({
          documentType: draft.title || '',
          audience: '',
          tone: 'professional',
          context: draft.content || '',
        });
        // Clear the draft after loading
        sessionStorage.removeItem('pp_draft');
      } catch (e) {
        console.error('Failed to load blueprint draft:', e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/processing');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation variant="app" />
      
      <div className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-[var(--text-h1)] font-serif font-medium text-charcoal mb-4">
            Tell us about your document.
          </h1>
          
          <p className="text-[var(--text-body)] text-text-secondary leading-[1.6]">
            A few details help us structure your draft effectively.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Input
            label="What are you creating"
            placeholder="Board update, client proposal, strategy brief..."
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            required
          />

          <Input
            label="Who is the audience"
            placeholder="Board of directors, executive team, client stakeholders..."
            value={formData.audience}
            onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
            required
          />

          <Select
            label="Tone"
            value={formData.tone}
            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
            options={[
              { value: 'professional', label: 'Professional' },
              { value: 'strategic', label: 'Strategic' },
              { value: 'analytical', label: 'Analytical' },
              { value: 'persuasive', label: 'Persuasive' },
              { value: 'consultative', label: 'Consultative' },
            ]}
          />

          <TextArea
            label="Context (optional)"
            placeholder="Share key points, data, or specific requirements. The more context you provide, the more tailored your draft will be."
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            rows={8}
            helperText="Your information remains private and secure."
          />

          <div className="pt-4">
            <Button 
              type="submit" 
              variant="primary" 
              size="large"
              className="w-full md:w-auto"
            >
              Create draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}