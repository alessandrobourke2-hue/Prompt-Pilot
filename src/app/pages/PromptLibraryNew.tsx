import React, { useState, useMemo } from 'react';
import * as ReactRouter from 'react-router';
const { Link, useNavigate, useLocation } = ReactRouter;
import { 
  Home, 
  Library, 
  History, 
  BarChart3, 
  User, 
  Plus,
  Search,
  Star,
  X,
  Grid3x3,
  List,
  ChevronDown,
  ArrowRight,
  Layers,
  MoreVertical,
  ChevronUp,
  Sparkles,
  FileText,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface BlueprintVariable {
  key: string;
  label: string;
  guidedLabel?: string; // Plain English label for guided mode
  type: 'text' | 'long_text' | 'select';
  placeholder: string;
  required: boolean;
  options?: string[];
  description?: string; // Helper text
  example?: string; // Example value
  autoSuggestOptions?: string[]; // Chips for quick selection
}

interface Blueprint {
  id: string;
  title: string;
  description: string;
  shortDescription?: string; // One-liner for card
  plainExplanation?: string; // Plain English for guided mode
  category: string;
  complexity: 'standard' | 'advanced' | 'expert';
  tags: string[];
  variables: BlueprintVariable[];
  structure: {
    role: string;
    goal: string;
    context: string;
    output_format: string;
    constraints: string;
  };
}

// Blueprint Data
const BLUEPRINTS: Blueprint[] = [
  // STRATEGY
  {
    id: 'decision-matrix',
    title: 'Decision Matrix Framework',
    description: 'Structured evaluation system for complex decisions with weighted criteria and confidence scoring.',
    shortDescription: 'Compare multiple options using structured criteria',
    plainExplanation: 'This framework helps you compare multiple options using structured criteria and confidence scoring.',
    category: 'Strategy',
    complexity: 'advanced',
    tags: ['decision-making', 'analysis', 'evaluation'],
    variables: [
      { 
        key: 'decision_topic', 
        label: 'Decision Topic',
        guidedLabel: 'What decision are you evaluating?',
        type: 'text', 
        placeholder: 'e.g., Choose between build vs buy for CRM', 
        required: true,
        description: 'The main decision or choice you need to make',
        example: 'Choosing between building in-house or buying SaaS'
      },
      { 
        key: 'options', 
        label: 'Options to Evaluate',
        guidedLabel: 'What are your options?',
        type: 'long_text', 
        placeholder: 'List each option on a new line', 
        required: true,
        description: 'List the alternatives you are considering',
        example: 'Build custom CRM\nBuy Salesforce\nBuy HubSpot'
      },
      { 
        key: 'evaluation_criteria', 
        label: 'Evaluation Criteria',
        guidedLabel: 'How will you judge the options?',
        type: 'long_text', 
        placeholder: 'e.g., Cost, Time, Risk, Strategic fit', 
        required: true,
        description: 'The factors that matter most in this decision',
        example: 'Cost, time to implement, scalability, risk, strategic fit',
        autoSuggestOptions: ['Cost', 'Time', 'Risk', 'ROI', 'Strategic fit', 'Technical complexity']
      }
    ],
    structure: {
      role: 'You are a strategic decision analyst with expertise in structured evaluation frameworks.',
      goal: 'Help evaluate the following decision using a systematic approach.',
      context: 'Decision Topic: {{decision_topic}}\n\nOptions:\n{{options}}\n\nEvaluation Criteria:\n{{evaluation_criteria}}',
      output_format: '1. Option Comparison Table\n2. Weighted Evaluation\n3. Risk Assessment\n4. Recommendation\n5. Confidence Level',
      constraints: 'Be structured and objective. Avoid vague language. Justify reasoning with data. Provide confidence scores.'
    }
  },
  {
    id: 'market-entry-strategy',
    title: 'Market Entry Strategy',
    description: 'Comprehensive framework for evaluating and planning entry into new markets.',
    shortDescription: 'Plan market expansion with strategic rigor',
    plainExplanation: 'Develop a comprehensive market entry strategy with risk assessment and go-to-market planning.',
    category: 'Strategy',
    complexity: 'expert',
    tags: ['market-analysis', 'expansion', 'go-to-market'],
    variables: [
      { key: 'target_market', label: 'Target Market', guidedLabel: 'Which market are you entering?', type: 'text', placeholder: 'e.g., Enterprise SaaS in Southeast Asia', required: true, description: 'The specific market you want to enter', example: 'Enterprise SaaS in Southeast Asia' },
      { key: 'product_offering', label: 'Product/Service', guidedLabel: 'What are you bringing to market?', type: 'long_text', placeholder: 'Describe what you are bringing to market', required: true, description: 'Your product or service offering', example: 'Cloud-based project management platform' },
      { key: 'resources', label: 'Available Resources', guidedLabel: 'What resources do you have?', type: 'long_text', placeholder: 'Budget, team, timeline, partnerships', required: true, description: 'Budget, team size, timeline, and existing partnerships', example: '$500k budget, 3-person team, 6-month timeline' }
    ],
    structure: {
      role: 'You are a market strategy consultant with 15+ years of international expansion experience.',
      goal: 'Develop a structured market entry strategy.',
      context: 'Target Market: {{target_market}}\n\nProduct Offering:\n{{product_offering}}\n\nAvailable Resources:\n{{resources}}',
      output_format: '1. Market Analysis\n2. Entry Strategy Options\n3. Go-to-Market Plan\n4. Resource Allocation\n5. Risk Mitigation\n6. Success Metrics',
      constraints: 'Be realistic about challenges. Provide timeline estimates. Include competitive considerations. Prioritize quick wins.'
    }
  },
  {
    id: 'competitive-landscape',
    title: 'Competitive Landscape Analysis',
    description: 'Systematic competitive intelligence framework with positioning insights.',
    shortDescription: 'Analyze competition and identify white space',
    plainExplanation: 'Map your competitive landscape and discover positioning opportunities.',
    category: 'Strategy',
    complexity: 'standard',
    tags: ['competition', 'market-research', 'positioning'],
    variables: [
      { key: 'industry', label: 'Industry/Space', guidedLabel: 'What industry are you analyzing?', type: 'text', placeholder: 'e.g., Project management software', required: true, description: 'The market or industry you operate in', example: 'Project management software' },
      { key: 'competitors', label: 'Key Competitors', guidedLabel: 'Who are your main competitors?', type: 'long_text', placeholder: 'List competitors (one per line)', required: true, description: 'List the main players in your space', example: 'Monday.com\nAsana\nClickUp\nNotion' },
      { key: 'focus_areas', label: 'Analysis Focus', guidedLabel: 'What aspects should we analyze?', type: 'long_text', placeholder: 'e.g., Pricing, features, positioning, customer segments', required: false, description: 'Specific areas to focus on', example: 'Pricing models, core features, target customers' }
    ],
    structure: {
      role: 'You are a competitive intelligence analyst.',
      goal: 'Analyze the competitive landscape and identify positioning opportunities.',
      context: 'Industry: {{industry}}\n\nCompetitors:\n{{competitors}}\n\nFocus Areas:\n{{focus_areas}}',
      output_format: '1. Competitor Overview Matrix\n2. Feature Comparison\n3. Positioning Map\n4. Gap Analysis\n5. Strategic Opportunities',
      constraints: 'Focus on actionable insights. Identify white space. Be specific about differentiation opportunities.'
    }
  },
  {
    id: 'risk-mapping',
    title: 'Risk Mapping Framework',
    description: 'Identify, assess, and prioritize risks with mitigation strategies.',
    shortDescription: 'Map risks and develop mitigation plans',
    plainExplanation: 'Identify and prioritize risks with clear mitigation strategies.',
    category: 'Strategy',
    complexity: 'standard',
    tags: ['risk-management', 'planning', 'mitigation'],
    variables: [
      { key: 'initiative', label: 'Initiative/Project', guidedLabel: 'What initiative are you evaluating?', type: 'text', placeholder: 'e.g., Launch new product line', required: true, description: 'The project or initiative to assess', example: 'Launch new product line' },
      { key: 'context', label: 'Context', guidedLabel: 'What is the situation?', type: 'long_text', placeholder: 'Describe the initiative and environment', required: true, description: 'Background and environment details', example: 'Launching in Q3, competitive market, limited budget' }
    ],
    structure: {
      role: 'You are a risk management strategist.',
      goal: 'Identify and map risks for the given initiative.',
      context: 'Initiative: {{initiative}}\n\nContext:\n{{context}}',
      output_format: '1. Risk Inventory\n2. Impact/Probability Matrix\n3. Priority Risks (Top 5)\n4. Mitigation Strategies\n5. Monitoring Plan',
      constraints: 'Be comprehensive but practical. Include both internal and external risks. Provide actionable mitigation steps.'
    }
  },

  // PRODUCT
  {
    id: 'prd-builder',
    title: 'PRD Builder',
    description: 'Generate comprehensive Product Requirements Documents with all critical sections.',
    shortDescription: 'Build complete PRDs with structure',
    plainExplanation: 'Create a comprehensive Product Requirements Document with all essential sections.',
    category: 'Product',
    complexity: 'advanced',
    tags: ['product-management', 'requirements', 'documentation'],
    variables: [
      { key: 'feature_name', label: 'Feature Name', guidedLabel: 'What feature are you building?', type: 'text', placeholder: 'e.g., Advanced Search Filters', required: true, description: 'Name of the feature', example: 'Advanced Search Filters' },
      { key: 'problem', label: 'Problem Statement', guidedLabel: 'What problem does this solve?', type: 'long_text', placeholder: 'What problem does this solve?', required: true, description: 'The user problem being addressed', example: 'Users struggle to find relevant items in large datasets' },
      { key: 'user_segments', label: 'Target Users', guidedLabel: 'Who is this for?', type: 'text', placeholder: 'e.g., Power users, Enterprise admins', required: true, description: 'User segments that need this', example: 'Power users, data analysts' }
    ],
    structure: {
      role: 'You are a senior product manager with expertise in writing clear, actionable PRDs.',
      goal: 'Create a comprehensive PRD for the following feature.',
      context: 'Feature: {{feature_name}}\n\nProblem:\n{{problem}}\n\nTarget Users: {{user_segments}}',
      output_format: '1. Overview\n2. Problem Statement\n3. Goals & Success Metrics\n4. User Stories\n5. Requirements (Functional & Non-functional)\n6. Out of Scope\n7. Technical Considerations\n8. Launch Plan',
      constraints: 'Be specific and actionable. Include acceptance criteria. Consider edge cases. Define clear success metrics.'
    }
  },
  {
    id: 'user-story-expansion',
    title: 'User Story Expansion',
    description: 'Transform high-level user needs into detailed, implementable user stories.',
    shortDescription: 'Break down needs into actionable stories',
    plainExplanation: 'Convert high-level user needs into detailed, implementable user stories.',
    category: 'Product',
    complexity: 'standard',
    tags: ['agile', 'user-stories', 'requirements'],
    variables: [
      { key: 'user_need', label: 'User Need', guidedLabel: 'What do users need?', type: 'text', placeholder: 'e.g., Users need to filter data quickly', required: true, description: 'The high-level user need', example: 'Users need to filter data quickly' },
      { key: 'context', label: 'Context', guidedLabel: 'What is the context?', type: 'long_text', placeholder: 'Current state, constraints, user type', required: true, description: 'Current state and constraints', example: 'Current filters are slow, users are power analysts' }
    ],
    structure: {
      role: 'You are a product owner skilled in agile methodologies.',
      goal: 'Expand the user need into detailed user stories with acceptance criteria.',
      context: 'User Need: {{user_need}}\n\nContext:\n{{context}}',
      output_format: '1. Epic User Story\n2. Broken Down Stories (with story points estimate)\n3. Acceptance Criteria\n4. Edge Cases\n5. Dependencies',
      constraints: 'Follow "As a [user], I want [goal], so that [benefit]" format. Be specific. Include testable acceptance criteria.'
    }
  },
  {
    id: 'roadmap-prioritization',
    title: 'Roadmap Prioritization',
    description: 'Prioritize features using multiple frameworks (RICE, Value vs Effort).',
    shortDescription: 'Prioritize features with frameworks',
    plainExplanation: 'Use structured frameworks to prioritize your product roadmap.',
    category: 'Product',
    complexity: 'advanced',
    tags: ['roadmap', 'prioritization', 'strategy'],
    variables: [
      { key: 'features', label: 'Features to Prioritize', guidedLabel: 'What features are you considering?', type: 'long_text', placeholder: 'List features (one per line)', required: true, description: 'Features to evaluate', example: 'Advanced search\nMobile app\nAPI integration' },
      { key: 'constraints', label: 'Constraints', guidedLabel: 'What are your constraints?', type: 'long_text', placeholder: 'e.g., Team size, timeline, strategic goals', required: true, description: 'Limitations and goals', example: '5-person team, Q2 launch, focus on retention' }
    ],
    structure: {
      role: 'You are a product strategist with expertise in prioritization frameworks.',
      goal: 'Prioritize the following features using structured frameworks.',
      context: 'Features:\n{{features}}\n\nConstraints:\n{{constraints}}',
      output_format: '1. RICE Score Analysis\n2. Value vs Effort Matrix\n3. Strategic Alignment Assessment\n4. Recommended Priority Order\n5. Rationale',
      constraints: 'Use quantitative scoring where possible. Consider strategic fit. Balance quick wins with long-term bets.'
    }
  },

  // MARKETING
  {
    id: 'campaign-strategy',
    title: 'Campaign Strategy Builder',
    description: 'Complete marketing campaign strategy from positioning to measurement.',
    shortDescription: 'Design campaigns with clear strategy',
    plainExplanation: 'Build a complete marketing campaign from positioning to measurement.',
    category: 'Marketing',
    complexity: 'advanced',
    tags: ['campaigns', 'marketing-strategy', 'gtm'],
    variables: [
      { key: 'campaign_goal', label: 'Campaign Goal', guidedLabel: 'What is your campaign goal?', type: 'text', placeholder: 'e.g., Generate 500 qualified leads', required: true, description: 'Specific, measurable goal', example: 'Generate 500 qualified leads in Q2' },
      { key: 'target_audience', label: 'Target Audience', guidedLabel: 'Who are you targeting?', type: 'text', placeholder: 'e.g., VP of Sales at Series B SaaS companies', required: true, description: 'Specific audience profile', example: 'VP of Sales at Series B SaaS companies' },
      { key: 'budget', label: 'Budget', guidedLabel: 'What is your budget?', type: 'text', placeholder: 'e.g., $50k', required: false, description: 'Available budget', example: '$50,000' }
    ],
    structure: {
      role: 'You are a growth marketing strategist.',
      goal: 'Design a comprehensive campaign strategy.',
      context: 'Goal: {{campaign_goal}}\n\nTarget Audience: {{target_audience}}\n\nBudget: {{budget}}',
      output_format: '1. Campaign Positioning\n2. Channel Strategy\n3. Content Plan\n4. Timeline & Milestones\n5. Budget Allocation\n6. Success Metrics\n7. Optimization Plan',
      constraints: 'Be specific about channels and tactics. Include measurement plan. Consider A/B testing opportunities.'
    }
  },
  {
    id: 'icp-builder',
    title: 'ICP Definition Framework',
    description: 'Define your Ideal Customer Profile with precision.',
    shortDescription: 'Define your ideal customer precisely',
    plainExplanation: 'Build a detailed Ideal Customer Profile based on your best customers.',
    category: 'Marketing',
    complexity: 'standard',
    tags: ['icp', 'targeting', 'customer-research'],
    variables: [
      { key: 'product', label: 'Product/Service', guidedLabel: 'What do you sell?', type: 'text', placeholder: 'What do you sell?', required: true, description: 'Your product or service', example: 'B2B SaaS analytics platform' },
      { key: 'current_customers', label: 'Best Current Customers', guidedLabel: 'Who are your best customers?', type: 'long_text', placeholder: 'Describe your best customers', required: true, description: 'Characteristics of top customers', example: 'Series B SaaS companies, 50-200 employees, data-driven culture' }
    ],
    structure: {
      role: 'You are a customer research specialist.',
      goal: 'Define a detailed Ideal Customer Profile.',
      context: 'Product: {{product}}\n\nBest Customers:\n{{current_customers}}',
      output_format: '1. Firmographic Profile\n2. Behavioral Characteristics\n3. Pain Points & Triggers\n4. Decision-Making Process\n5. Success Indicators\n6. Anti-ICP (who to avoid)',
      constraints: 'Be specific and actionable. Include both quantitative and qualitative attributes. Focus on patterns in best customers.'
    }
  },
  {
    id: 'messaging-positioning',
    title: 'Messaging Positioning Matrix',
    description: 'Develop differentiated positioning and core messaging framework.',
    shortDescription: 'Build differentiated messaging',
    plainExplanation: 'Create a differentiated positioning and messaging framework.',
    category: 'Marketing',
    complexity: 'advanced',
    tags: ['positioning', 'messaging', 'branding'],
    variables: [
      { key: 'product', label: 'Product', guidedLabel: 'What product are you positioning?', type: 'text', placeholder: 'Product name', required: true, description: 'Your product name', example: 'PromptPilot' },
      { key: 'target_market', label: 'Target Market', guidedLabel: 'Who is this for?', type: 'text', placeholder: 'Who is this for?', required: true, description: 'Primary target audience', example: 'AI operators who use AI daily' },
      { key: 'competitors', label: 'Key Competitors', guidedLabel: 'What are the alternatives?', type: 'text', placeholder: 'Main alternatives', required: false, description: 'Main competitors or alternatives', example: 'ChatGPT, Claude, basic prompting' }
    ],
    structure: {
      role: 'You are a brand strategist with expertise in positioning.',
      goal: 'Develop a differentiated positioning and messaging framework.',
      context: 'Product: {{product}}\n\nTarget Market: {{target_market}}\n\nCompetitors: {{competitors}}',
      output_format: '1. Positioning Statement\n2. Value Proposition\n3. Key Messages (3-5)\n4. Proof Points\n5. Differentiation\n6. Messaging by Audience Segment',
      constraints: 'Be clear and distinctive. Avoid generic language. Include emotional and rational benefits. Test against competitor positioning.'
    }
  },
  {
    id: 'landing-page-brief',
    title: 'Landing Page Brief',
    description: 'Comprehensive brief for high-converting landing pages.',
    shortDescription: 'Build high-converting landing pages',
    plainExplanation: 'Create a comprehensive brief for high-converting landing pages.',
    category: 'Marketing',
    complexity: 'standard',
    tags: ['conversion', 'landing-pages', 'copywriting'],
    variables: [
      { key: 'campaign', label: 'Campaign/Offer', guidedLabel: 'What is the offer?', type: 'text', placeholder: 'e.g., Free trial signup', required: true, description: 'The offer or campaign', example: 'Free 14-day trial' },
      { key: 'audience', label: 'Target Audience', guidedLabel: 'Who will see this page?', type: 'text', placeholder: 'Who will see this page?', required: true, description: 'Visitor profile', example: 'SaaS founders looking to improve AI workflows' },
      { key: 'goal', label: 'Conversion Goal', guidedLabel: 'What should they do?', type: 'text', placeholder: 'e.g., Email signup, Demo request', required: true, description: 'The desired action', example: 'Sign up for trial' }
    ],
    structure: {
      role: 'You are a conversion-focused copywriter and UX strategist.',
      goal: 'Create a comprehensive landing page brief.',
      context: 'Campaign: {{campaign}}\n\nAudience: {{audience}}\n\nGoal: {{goal}}',
      output_format: '1. Headline Options\n2. Value Proposition\n3. Key Benefits (3-5)\n4. Social Proof Strategy\n5. CTA Copy\n6. Page Structure\n7. Trust Elements',
      constraints: 'Focus on clarity over cleverness. Lead with benefits. Address objections. Include specific copy suggestions.'
    }
  },

  // WRITING
  {
    id: 'long-form-outline',
    title: 'Long-form Article Structure',
    description: 'Comprehensive outline for articles, guides, and thought leadership.',
    shortDescription: 'Build structured article outlines',
    plainExplanation: 'Create a comprehensive outline for long-form content.',
    category: 'Writing',
    complexity: 'standard',
    tags: ['content', 'writing', 'structure'],
    variables: [
      { key: 'topic', label: 'Article Topic', guidedLabel: 'What are you writing about?', type: 'text', placeholder: 'e.g., Future of remote work', required: true, description: 'The main topic', example: 'The future of remote work in SaaS' },
      { key: 'audience', label: 'Target Audience', guidedLabel: 'Who is this for?', type: 'text', placeholder: 'Who is this for?', required: true, description: 'Your target readers', example: 'SaaS founders and operators' },
      { key: 'angle', label: 'Unique Angle', guidedLabel: 'What is your unique perspective?', type: 'long_text', placeholder: 'What perspective are you bringing?', required: false, description: 'Your unique take', example: 'Remote work as competitive advantage, not compromise' }
    ],
    structure: {
      role: 'You are a content strategist and writer.',
      goal: 'Create a comprehensive article outline.',
      context: 'Topic: {{topic}}\n\nAudience: {{audience}}\n\nAngle:\n{{angle}}',
      output_format: '1. Hook/Opening\n2. Thesis Statement\n3. Section Outline (with key points)\n4. Examples/Case Studies\n5. Counterarguments\n6. Conclusion\n7. CTA',
      constraints: 'Start with a strong hook. Build logical flow. Include specific examples. Address objections. End with clear takeaway.'
    }
  },
  {
    id: 'executive-brief',
    title: 'Executive Brief Builder',
    description: 'Concise executive summaries for busy stakeholders.',
    shortDescription: 'Write concise executive summaries',
    plainExplanation: 'Create concise, actionable executive briefs.',
    category: 'Writing',
    complexity: 'advanced',
    tags: ['executive-communication', 'summaries', 'business-writing'],
    variables: [
      { key: 'subject', label: 'Subject', guidedLabel: 'What is this about?', type: 'text', placeholder: 'e.g., Q3 Strategy Review', required: true, description: 'Topic of the brief', example: 'Q3 Strategy Review' },
      { key: 'key_information', label: 'Key Information', guidedLabel: 'What do they need to know?', type: 'long_text', placeholder: 'What does the exec need to know?', required: true, description: 'Essential information', example: 'Revenue up 20%, churn increased, need to pivot strategy' }
    ],
    structure: {
      role: 'You are an executive communications specialist.',
      goal: 'Create a concise, actionable executive brief.',
      context: 'Subject: {{subject}}\n\nInformation:\n{{key_information}}',
      output_format: '1. Executive Summary (2-3 sentences)\n2. Key Points (3-5 bullets)\n3. Recommendation\n4. Risks/Considerations\n5. Next Steps\n6. Decision Needed',
      constraints: 'Be concise. Lead with conclusion. Use bullets. Quantify impact. Make recommendation clear.'
    }
  },

  // ANALYSIS
  {
    id: 'swot-analysis',
    title: 'SWOT Analysis',
    description: 'Classic strategic analysis framework for businesses and projects.',
    shortDescription: 'Analyze strengths, weaknesses, opportunities, threats',
    plainExplanation: 'Conduct a comprehensive SWOT analysis.',
    category: 'Analysis',
    complexity: 'standard',
    tags: ['strategy', 'analysis', 'planning'],
    variables: [
      { key: 'subject', label: 'Subject', guidedLabel: 'What are you analyzing?', type: 'text', placeholder: 'e.g., Our company, this product, this partnership', required: true, description: 'What to analyze', example: 'Our company in the current market' },
      { key: 'context', label: 'Context', guidedLabel: 'What is the situation?', type: 'long_text', placeholder: 'Provide background', required: true, description: 'Background information', example: 'Series B SaaS company, growing competition, scaling challenges' }
    ],
    structure: {
      role: 'You are a strategic analyst.',
      goal: 'Conduct a thorough SWOT analysis.',
      context: 'Subject: {{subject}}\n\nContext:\n{{context}}',
      output_format: '1. Strengths (internal)\n2. Weaknesses (internal)\n3. Opportunities (external)\n4. Threats (external)\n5. Strategic Implications\n6. Action Items',
      constraints: 'Be honest about weaknesses. Make opportunities specific. Consider timing. Link to actionable strategy.'
    }
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis Framework',
    description: 'Structure for analyzing datasets and extracting insights.',
    shortDescription: 'Extract insights from datasets',
    plainExplanation: 'Design a structured approach to analyze your data.',
    category: 'Analysis',
    complexity: 'advanced',
    tags: ['data', 'analytics', 'insights'],
    variables: [
      { key: 'dataset_description', label: 'Dataset Description', guidedLabel: 'What data do you have?', type: 'long_text', placeholder: 'What data do you have?', required: true, description: 'Description of your data', example: 'User behavior data: clicks, time spent, conversion events' },
      { key: 'questions', label: 'Questions to Answer', guidedLabel: 'What do you want to learn?', type: 'long_text', placeholder: 'What do you want to learn?', required: true, description: 'Specific questions', example: 'What drives conversion? Which features correlate with retention?' }
    ],
    structure: {
      role: 'You are a data analyst.',
      goal: 'Design an analysis approach for the dataset.',
      context: 'Dataset:\n{{dataset_description}}\n\nQuestions:\n{{questions}}',
      output_format: '1. Analysis Plan\n2. Metrics to Calculate\n3. Segmentation Strategy\n4. Visualization Approach\n5. Expected Insights\n6. Limitations',
      constraints: 'Be methodical. Consider data quality. Choose appropriate statistical methods. Make visualizations clear.'
    }
  }
];

// Left Rail Component
function LeftRail() {
  const location = useLocation();
  
  const navItems = [
    { path: '/app', label: 'Home', icon: Home },
    { path: '/app/input', label: 'New Prompt', icon: Plus },
    { path: '/app/library', label: 'Library', icon: Layers },
    { path: '/app/history', label: 'History', icon: History },
    { path: '/app/usage', label: 'Usage', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-56 flex flex-col border-r z-50" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link to="/app" className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-serif font-bold text-lg" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>P</div>
          <span className="font-serif font-semibold text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>PromptPilot</span>
        </Link>
        <p className="text-[11px] uppercase tracking-wider font-medium" style={{ color: 'var(--text-muted)' }}>Home</p>
      </div>
      <nav className="flex-1 px-2 py-5 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? '' : 'hover:opacity-80'}`} style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)', backgroundColor: active ? 'var(--overlay)' : 'transparent' }}>
              <Icon size={18} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-2 border-t space-y-0.5" style={{ borderColor: 'var(--border-subtle)' }}>
        <Link to="/app/account" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${location.pathname === '/app/account' ? '' : 'hover:opacity-80'}`} style={{ color: location.pathname === '/app/account' ? 'var(--text-primary)' : 'var(--text-secondary)', backgroundColor: location.pathname === '/app/account' ? 'var(--overlay)' : 'transparent' }}>
          <User size={18} strokeWidth={1.8} />
          Account
        </Link>
        <div className="mx-2 mt-2 p-3 rounded-xl border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-subtle)' }}>
          <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>Plan</p>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Free</p>
            <Link to="/pricing" className="text-xs font-medium transition-colors" style={{ color: 'var(--accent)' }}>Upgrade</Link>
          </div>
        </div>
        <div className="px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Extension</p>
        </div>
      </div>
    </div>
  );
}

// Dropdown Menu Component
function BlueprintDropdown({ 
  blueprint, 
  onViewPreview,
  onViewVariables,
  onViewStructure,
  isFavorite,
  onToggleFavorite
}: {
  blueprint: Blueprint;
  onViewPreview: () => void;
  onViewVariables: () => void;
  onViewStructure: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewPreview();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText size={16} />
              Preview
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewVariables();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <List size={16} />
              View Variables
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewStructure();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Layers size={16} />
              View Structure
            </button>
            <div className="border-t border-gray-100 my-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
              {isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Main Library Component
export function PromptLibrary() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [previewMode, setPreviewMode] = useState<'overview' | 'variables' | 'structure'>('overview');
  const [showVariableForm, setShowVariableForm] = useState(false);
  const [guidedMode, setGuidedMode] = useState(true);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [selectedChips, setSelectedChips] = useState<Record<string, string[]>>({});
  const [expandedHelp, setExpandedHelp] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('pp_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const categories = ['All', 'Strategy', 'Product', 'Marketing', 'Writing', 'Analysis'];

  // Filter blueprints
  const filteredBlueprints = useMemo(() => {
    return BLUEPRINTS.filter(bp => {
      const matchesSearch = searchQuery === '' || 
        bp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || bp.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('pp_favorites', JSON.stringify(newFavorites));
  };

  const openBlueprint = (blueprint: Blueprint, mode: 'overview' | 'variables' | 'structure' = 'overview') => {
    setSelectedBlueprint(blueprint);
    setPreviewMode(mode);
    setShowVariableForm(false);
    setVariableValues({});
    setSelectedChips({});
    setExpandedHelp(null);
    setShowPreview(false);
  };

  const closeBlueprint = () => {
    setSelectedBlueprint(null);
    setShowVariableForm(false);
    setPreviewMode('overview');
    setVariableValues({});
    setSelectedChips({});
    setExpandedHelp(null);
    setShowPreview(false);
  };

  const useBlueprint = () => {
    if (!selectedBlueprint) return;
    setShowVariableForm(true);
    setGuidedMode(true);
  };

  const toggleChip = (variableKey: string, chip: string) => {
    setSelectedChips(prev => {
      const current = prev[variableKey] || [];
      const newChips = current.includes(chip)
        ? current.filter(c => c !== chip)
        : [...current, chip];
      
      // Update the variable value
      const newValue = newChips.join(', ');
      setVariableValues(prevValues => ({ ...prevValues, [variableKey]: newValue }));
      
      return { ...prev, [variableKey]: newChips };
    });
  };

  const compileAndUse = () => {
    if (!selectedBlueprint) return;

    // Replace tokens in structure
    let compiled = `Role:\n${selectedBlueprint.structure.role}\n\n`;
    compiled += `Goal:\n${selectedBlueprint.structure.goal}\n\n`;
    compiled += `Context:\n${selectedBlueprint.structure.context}\n\n`;
    compiled += `Output Format:\n${selectedBlueprint.structure.output_format}\n\n`;
    compiled += `Constraints:\n${selectedBlueprint.structure.constraints}`;

    // Replace all variables
    selectedBlueprint.variables.forEach(variable => {
      const value = variableValues[variable.key] || '';
      const token = `{{${variable.key}}}`;
      compiled = compiled.replace(new RegExp(token, 'g'), value);
    });

    // Store in sessionStorage
    sessionStorage.setItem('pp_draft', JSON.stringify({
      title: selectedBlueprint.title,
      content: compiled
    }));

    // Navigate to input page
    navigate('/app/input');
  };

  const allRequiredFilled = selectedBlueprint
    ? selectedBlueprint.variables
        .filter(v => v.required)
        .every(v => variableValues[v.key]?.trim())
    : false;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <LeftRail />
      
      <div className="ml-56">
        <div className="px-8 py-6 border-b" style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-serif font-semibold text-gray-900 mb-1">
                Prompt Library
              </h1>
              <p className="text-sm text-gray-600">
                Production-ready frameworks that transform rough ideas into structured outputs.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1.5 rounded-full">
                {BLUEPRINTS.length} Blueprints
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blueprints, tags, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 bg-white cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-2 rounded ${layoutMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-2 rounded ${layoutMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-8">
          {filteredBlueprints.length === 0 ? (
            <div className="text-center py-20">
              <Library size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No blueprints found</h3>
              <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : layoutMode === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBlueprints.map(blueprint => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  isFavorite={favorites.includes(blueprint.id)}
                  onToggleFavorite={() => toggleFavorite(blueprint.id)}
                  onOpen={() => openBlueprint(blueprint)}
                  onViewPreview={() => openBlueprint(blueprint, 'overview')}
                  onViewVariables={() => openBlueprint(blueprint, 'variables')}
                  onViewStructure={() => openBlueprint(blueprint, 'structure')}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredBlueprints.map(blueprint => (
                <BlueprintListItem
                  key={blueprint.id}
                  blueprint={blueprint}
                  isFavorite={favorites.includes(blueprint.id)}
                  onToggleFavorite={() => toggleFavorite(blueprint.id)}
                  onOpen={() => openBlueprint(blueprint)}
                  onViewPreview={() => openBlueprint(blueprint, 'overview')}
                  onViewVariables={() => openBlueprint(blueprint, 'variables')}
                  onViewStructure={() => openBlueprint(blueprint, 'structure')}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Preview Panel */}
      <AnimatePresence>
        {selectedBlueprint && (
          <BlueprintPreviewPanel
            blueprint={selectedBlueprint}
            previewMode={previewMode}
            showVariableForm={showVariableForm}
            guidedMode={guidedMode}
            variableValues={variableValues}
            selectedChips={selectedChips}
            expandedHelp={expandedHelp}
            showPreview={showPreview}
            onClose={closeBlueprint}
            onUseBlueprint={useBlueprint}
            onToggleGuidedMode={() => setGuidedMode(!guidedMode)}
            onVariableChange={(key, value) => setVariableValues(prev => ({ ...prev, [key]: value }))}
            onToggleChip={toggleChip}
            onToggleHelp={(key) => setExpandedHelp(expandedHelp === key ? null : key)}
            onTogglePreview={() => setShowPreview(!showPreview)}
            onCompile={compileAndUse}
            allRequiredFilled={allRequiredFilled}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Blueprint Card Component (Simplified)
function BlueprintCard({
  blueprint,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onViewPreview,
  onViewVariables,
  onViewStructure
}: {
  blueprint: Blueprint;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  onViewPreview: () => void;
  onViewVariables: () => void;
  onViewStructure: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex aspect-square flex-col rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md hover:border-gray-300 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2 min-h-0">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-black transition-colors flex-1 min-w-0">
          {blueprint.title}
        </h3>
        <BlueprintDropdown
          blueprint={blueprint}
          onViewPreview={onViewPreview}
          onViewVariables={onViewVariables}
          onViewStructure={onViewStructure}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      </div>

      {/* Short Description */}
      <p className="text-xs text-gray-600 line-clamp-3 flex-1 min-h-0 mb-3">
        {blueprint.shortDescription || blueprint.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 shrink-0">
        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium shrink-0">
          {blueprint.category}
        </span>
        <button
          onClick={onOpen}
          className="text-sm font-medium text-black hover:text-gray-700 transition-colors flex items-center gap-1 shrink-0"
        >
          Use Blueprint
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// Blueprint List Item Component (Simplified)
function BlueprintListItem({
  blueprint,
  isFavorite,
  onToggleFavorite,
  onOpen,
  onViewPreview,
  onViewVariables,
  onViewStructure
}: {
  blueprint: Blueprint;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
  onViewPreview: () => void;
  onViewVariables: () => void;
  onViewStructure: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all group">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-black transition-colors mb-1">
                {blueprint.title}
              </h3>
              <p className="text-sm text-gray-600">
                {blueprint.shortDescription || blueprint.description}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
                {blueprint.category}
              </span>
              <BlueprintDropdown
                blueprint={blueprint}
                onViewPreview={onViewPreview}
                onViewVariables={onViewVariables}
                onViewStructure={onViewStructure}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
              />
              <button
                onClick={onOpen}
                className="text-sm font-medium text-black hover:text-gray-700 transition-colors flex items-center gap-1 ml-2"
              >
                Use Blueprint
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Panel Component
function BlueprintPreviewPanel({
  blueprint,
  previewMode,
  showVariableForm,
  guidedMode,
  variableValues,
  selectedChips,
  expandedHelp,
  showPreview,
  onClose,
  onUseBlueprint,
  onToggleGuidedMode,
  onVariableChange,
  onToggleChip,
  onToggleHelp,
  onTogglePreview,
  onCompile,
  allRequiredFilled
}: {
  blueprint: Blueprint;
  previewMode: 'overview' | 'variables' | 'structure';
  showVariableForm: boolean;
  guidedMode: boolean;
  variableValues: Record<string, string>;
  selectedChips: Record<string, string[]>;
  expandedHelp: string | null;
  showPreview: boolean;
  onClose: () => void;
  onUseBlueprint: () => void;
  onToggleGuidedMode: () => void;
  onVariableChange: (key: string, value: string) => void;
  onToggleChip: (variableKey: string, chip: string) => void;
  onToggleHelp: (key: string) => void;
  onTogglePreview: () => void;
  onCompile: () => void;
  allRequiredFilled: boolean;
}) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-screen w-[700px] bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">
                {blueprint.title}
              </h2>
              {blueprint.plainExplanation && (
                <p className="text-sm text-gray-600">
                  {blueprint.plainExplanation}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 transition-colors p-2"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-medium">
              {blueprint.category}
            </span>
            <span className="text-xs text-gray-500">
              {blueprint.variables.length} inputs
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {!showVariableForm ? (
            <>
              {/* Overview/Variables/Structure modes */}
              {previewMode === 'overview' && (
                <>
                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                      Description
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {blueprint.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blueprint.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {previewMode === 'variables' && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">
                    Required Inputs ({blueprint.variables.length})
                  </h3>
                  <div className="space-y-3">
                    {blueprint.variables.map(variable => (
                      <div key={variable.key} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {variable.guidedLabel || variable.label}
                          {variable.required && <span className="text-red-500 ml-1">*</span>}
                        </p>
                        {variable.description && (
                          <p className="text-xs text-gray-500 mb-1">{variable.description}</p>
                        )}
                        {variable.example && (
                          <p className="text-xs text-gray-400 italic">Example: {variable.example}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewMode === 'structure' && (
                <div className="space-y-4">
                  <StructureBlock label="Role" content={blueprint.structure.role} />
                  <StructureBlock label="Goal" content={blueprint.structure.goal} />
                  <StructureBlock label="Context" content={blueprint.structure.context} />
                  <StructureBlock label="Output Format" content={blueprint.structure.output_format} />
                  <StructureBlock label="Constraints" content={blueprint.structure.constraints} />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Mode Toggle */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onToggleGuidedMode}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      guidedMode
                        ? 'border-black bg-black/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        guidedMode ? 'border-black' : 'border-gray-300'
                      }`}>
                        {guidedMode && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                      <span className={`text-sm font-medium ${guidedMode ? 'text-black' : 'text-gray-600'}`}>
                        Guided
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={onToggleGuidedMode}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      !guidedMode
                        ? 'border-black bg-black/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        !guidedMode ? 'border-black' : 'border-gray-300'
                      }`}>
                        {!guidedMode && <div className="w-2 h-2 rounded-full bg-black" />}
                      </div>
                      <span className={`text-sm font-medium ${!guidedMode ? 'text-black' : 'text-gray-600'}`}>
                        Manual
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Variable Form */}
              <div className="space-y-6">
                {blueprint.variables.map(variable => (
                  <div key={variable.key}>
                    {/* Label */}
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {guidedMode ? (variable.guidedLabel || variable.label) : variable.label}
                      {variable.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {/* Description (Guided Mode) */}
                    {guidedMode && variable.description && (
                      <p className="text-xs text-gray-500 mb-2">
                        {variable.description}
                      </p>
                    )}

                    {/* Example (Guided Mode) */}
                    {guidedMode && variable.example && (
                      <p className="text-xs text-gray-400 italic mb-3">
                        Example: {variable.example}
                      </p>
                    )}

                    {/* Auto-suggest Chips (Guided Mode) */}
                    {guidedMode && variable.autoSuggestOptions && variable.autoSuggestOptions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-2">Quick select:</p>
                        <div className="flex flex-wrap gap-2">
                          {variable.autoSuggestOptions.map(option => (
                            <button
                              key={option}
                              onClick={() => onToggleChip(variable.key, option)}
                              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                selectedChips[variable.key]?.includes(option)
                                  ? 'bg-black text-white border-black'
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Input Field */}
                    {variable.type === 'long_text' ? (
                      <textarea
                        value={variableValues[variable.key] || ''}
                        onChange={(e) => onVariableChange(variable.key, e.target.value)}
                        placeholder={variable.placeholder}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={variableValues[variable.key] || ''}
                        onChange={(e) => onVariableChange(variable.key, e.target.value)}
                        placeholder={variable.placeholder}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300"
                      />
                    )}

                    {/* Need Help? (Guided Mode) */}
                    {guidedMode && (
                      <button
                        onClick={() => onToggleHelp(variable.key)}
                        className="text-xs text-gray-500 hover:text-gray-700 mt-2 flex items-center gap-1"
                      >
                        <HelpCircle size={12} />
                        Need help?
                      </button>
                    )}

                    {/* Help Expanded */}
                    {expandedHelp === variable.key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <p className="text-xs text-blue-900 mb-2">
                          AI suggestions coming soon! For now, here are some tips:
                        </p>
                        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                          <li>Be specific and concrete</li>
                          <li>Include relevant context</li>
                          <li>Use examples when possible</li>
                        </ul>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Preview Structured Prompt (Collapsible) */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={onTogglePreview}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Preview Structured Prompt
                  </span>
                  {showPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 space-y-3"
                  >
                    <PreviewBlock label="Role" content={blueprint.structure.role} variableValues={variableValues} />
                    <PreviewBlock label="Goal" content={blueprint.structure.goal} variableValues={variableValues} />
                    <PreviewBlock label="Context" content={blueprint.structure.context} variableValues={variableValues} />
                    <PreviewBlock label="Output Format" content={blueprint.structure.output_format} variableValues={variableValues} />
                    <PreviewBlock label="Constraints" content={blueprint.structure.constraints} variableValues={variableValues} />
                  </motion.div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50">
          {!showVariableForm ? (
            <button
              onClick={onUseBlueprint}
              className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-2"
            >
              Use Blueprint
              <ArrowRight size={18} />
            </button>
          ) : (
            <div className="space-y-3">
              <button
                onClick={onCompile}
                disabled={!allRequiredFilled}
                className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                <Sparkles size={18} />
                Compile & Use
              </button>
              <button
                onClick={onClose}
                className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// Structure Block Component
function StructureBlock({ label, content }: { label: string; content: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
        {label}
      </p>
      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    </div>
  );
}

// Preview Block Component (with variable substitution preview)
function PreviewBlock({ label, content, variableValues }: { label: string; content: string; variableValues: Record<string, string> }) {
  // Replace tokens with values or placeholder
  let previewContent = content;
  Object.keys(variableValues).forEach(key => {
    const value = variableValues[key];
    const token = `{{${key}}}`;
    previewContent = previewContent.replace(new RegExp(token, 'g'), value || `[${key}]`);
  });

  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
        {label}
      </p>
      <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed font-mono">
        {previewContent}
      </p>
    </div>
  );
}
