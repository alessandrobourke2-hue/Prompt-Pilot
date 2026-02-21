import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type UseCaseType = 'linkedin' | 'outreach' | 'email' | 'product' | 'strategy' | 'tech';

const EXAMPLES = {
  linkedin: {
    before: "Write a LinkedIn post about productivity tips for remote workers",
    afterShort: "**Role:** Senior content strategist\n**Goal:** Create high-engagement post about productivity...\n**Context:** Target mid-level remote workers (3-7 years)...",
    afterFull: `**Role:** You are a senior content strategist specializing in LinkedIn engagement.

**Goal:** Create a high-engagement LinkedIn post about productivity tips specifically for remote workers that drives saves and comments.

**Context:** Target audience is mid-level remote workers (3-7 years experience) who struggle with work-life boundaries and focus.

**Output format:**
- Hook (2 lines) - Start with a relatable pain point
- Core insight - Share 1 counterintuitive productivity truth
- 3 actionable tips - Specific, implementable tactics
- Example - Brief real-world application
- Close + engagement question

**Constraints:**
- 120-150 words max
- Professional yet conversational tone
- No generic advice (no "wake up early" or "make a list")
- Use line breaks for scannable reading

**Success criteria:**
- Stops the scroll in first 2 lines
- Each tip is actionable within 5 minutes
- Question prompts authentic discussion`
  },
  outreach: {
    before: "Write a cold email to potential clients about our marketing services",
    afterShort: "**Role:** Experienced B2B outreach specialist\n**Goal:** Craft personalized cold outreach email...\n**Context:** Targeting CMOs at 50-200 person SaaS companies...",
    afterFull: `**Role:** You are an experienced B2B outreach specialist with 10+ years in SaaS marketing.

**Goal:** Craft a personalized cold outreach email that books discovery calls with Series A-B marketing leaders.

**Context:** Targeting CMOs at 50-200 person SaaS companies who recently announced funding and are likely scaling their team.

**Output format:**
- Subject line - Reference their recent milestone
- Personal opener (2 sentences) - Mention specific company achievement
- Problem → Value (3 sentences) - Connect their growth stage to our solution
- Soft CTA - Suggest brief chat, no pressure
- Optional PS - Add social proof or case study link

**Constraints:**
- 120 words maximum
- No hype language or superlatives
- Reference one specific detail about their company
- Suggest 15-min call, not demo

**Success criteria:**
- Feels personalized, not templated
- Clear value proposition in 10 seconds
- Easy yes/no decision with low commitment`
  },
  email: {
    before: "Write an email updating the team on project status",
    afterShort: "**Role:** Senior project manager\n**Goal:** Provide clear, actionable project status update...\n**Context:** Weekly update to engineering, design, product teams...",
    afterFull: `**Role:** You are a senior project manager communicating cross-functional updates.

**Goal:** Provide a clear, actionable project status update that aligns stakeholders and surfaces blockers.

**Context:** Weekly update to engineering, design, and product teams on Q1 roadmap execution. Audience includes individual contributors and directors.

**Output format:**
- Greeting - Address team casually
- Status summary (2-3 sentences) - Overall progress and timeline
- Wins this week (2-3 bullets)
- Blockers or risks (1-2 bullets with owners)
- Next steps with dates
- Sign-off with availability

**Constraints:**
- Professional but approachable tone
- Use bullet points for scanability
- Highlight action items clearly
- No jargon or abbreviations without context

**Success criteria:**
- Every stakeholder knows their next action
- Risks are visible with clear ownership
- Can be read in under 2 minutes`
  },
  product: {
    before: "Create a product requirements doc for a new feature",
    afterShort: "**Role:** Senior product manager at B2B SaaS\n**Goal:** Document complete, testable PRD...\n**Context:** Engineering team of 5, 2-sprint timeline...",
    afterFull: `**Role:** You are a senior product manager at a B2B SaaS company defining requirements.

**Goal:** Document a complete, testable PRD for a team collaboration feature in our project management tool.

**Context:** Engineering team of 5, 2-sprint timeline, targeting existing customers who requested better async communication.

**Output format:**
- Problem statement - User pain point with data
- Goals - What success looks like
- Non-goals - What we're explicitly not doing
- User stories (3-5) - As [role], I want [capability], so that [benefit]
- Acceptance criteria - Specific, testable requirements
- Edge cases - What happens when...
- Success metrics - How we'll measure impact

**Constraints:**
- Every requirement must be testable
- Reference user research or data
- Consider mobile and desktop experiences
- Address security and performance implications

**Success criteria:**
- Engineering can estimate without clarification
- QA can write test cases directly from this doc
- Stakeholders understand tradeoffs`
  },
  strategy: {
    before: "Help me decide which market to enter next",
    afterShort: "**Role:** Strategic advisor with market entry expertise\n**Goal:** Provide structured recommendation for market expansion...\n**Context:** B2B SaaS, $5M ARR, evaluating UK vs Canada vs Australia...",
    afterFull: `**Role:** You are a strategic advisor with expertise in market entry and competitive analysis.

**Goal:** Provide a structured recommendation for our next geographic market expansion with clear rationale.

**Context:** B2B SaaS company, $5M ARR, currently US-only, evaluating UK vs Canada vs Australia. 18-month timeline, limited localization resources.

**Output format:**
- Situation overview - Current position and constraints
- Key insights (3-4 data points) - Market size, competition, regulatory considerations
- Options comparison - UK, Canada, Australia scored on 4 criteria
- Recommendation - Specific choice with 3 key reasons
- Risks and mitigations - Top 3 risks with mitigation strategies
- Next steps - 5 actions with owners and timeline

**Constraints:**
- Data-driven, cite sources where possible
- Consider resource constraints explicitly
- Address both opportunity and execution difficulty
- Recommend one path, not "it depends"

**Success criteria:**
- Executive team can make decision today
- Risk assessment is realistic, not optimistic
- Next steps are immediately actionable`
  },
  tech: {
    before: "Debug why my API endpoint is returning 500 errors",
    afterShort: "**Role:** Senior backend engineer specializing in debugging\n**Goal:** Diagnose root cause of 500 errors and provide fix...\n**Context:** Node.js/Express API, PostgreSQL, errors after deployment...",
    afterFull: `**Role:** You are a senior backend engineer specializing in API debugging and system reliability.

**Goal:** Diagnose the root cause of 500 errors on the /api/users endpoint and provide a step-by-step fix.

**Context:** Node.js/Express API, PostgreSQL database, errors started after yesterday's deployment, affects ~10% of requests randomly.

**Output format:**
- Problem diagnosis - What's happening and when
- Likely causes (ranked) - Most probable to least, with reasoning
- Step-by-step fix instructions:
  1. Immediate mitigation (rollback or hotfix)
  2. Root cause fix
  3. Testing steps
- Code snippet - Specific changes to make
- Validation steps - How to confirm it's fixed
- Prevention - How to catch this earlier next time

**Constraints:**
- Assume production environment, minimize downtime
- Provide actual code, not pseudocode
- Consider backward compatibility
- Include error handling and logging

**Success criteria:**
- Can be executed by mid-level engineer
- Includes rollback plan if fix fails
- Prevents recurrence with monitoring/testing`
  }
};

export function InteractiveBeforeAfter() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseType>('linkedin');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleUseCaseChange = (newUseCase: UseCaseType) => {
    setIsExpanded(false);
    setSelectedUseCase(newUseCase);
  };

  return (
    <section className="w-full py-32" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="font-serif text-4xl md:text-5xl font-medium mb-20 text-center" style={{ color: 'var(--text-primary)' }}>
          From rough idea to structured output.
        </h2>

        <div className="flex items-center justify-center gap-2 mb-16 flex-wrap">
          {[
            { id: 'linkedin', label: 'LinkedIn' },
            { id: 'outreach', label: 'Outreach' },
            { id: 'email', label: 'Email' },
            { id: 'product', label: 'Product' },
            { id: 'strategy', label: 'Strategy' },
            { id: 'tech', label: 'Tech' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleUseCaseChange(tab.id as UseCaseType)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: selectedUseCase === tab.id ? '#1a1a1a' : 'var(--surface)',
                color: selectedUseCase === tab.id ? '#fff' : 'var(--text-secondary)',
                border: selectedUseCase === tab.id ? 'none' : '1px solid var(--border-subtle)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Before/After Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUseCase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div>
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Before</span>
              </div>
              <div className="rounded-2xl p-8 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
                <p className="font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {EXAMPLES[selectedUseCase].before}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>After</span>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left rounded-2xl p-8 border transition-all duration-200 hover:shadow-md group"
                style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}
              >
                <AnimatePresence mode="wait">
                  {!isExpanded ? (
                    <motion.div
                      key="short"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans mb-4" style={{ color: 'var(--text-primary)' }}>
                        {EXAMPLES[selectedUseCase].afterShort}
                      </pre>
                      <div className="flex items-center justify-center gap-2 text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
                        <span>Click to expand</span>
                        <ChevronDown size={16} />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans mb-4" style={{ color: 'var(--text-primary)' }}>
                        {EXAMPLES[selectedUseCase].afterFull}
                      </pre>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                        <span>Click to collapse</span>
                        <ChevronUp size={16} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
