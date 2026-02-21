import React from 'react';
import { motion } from 'motion/react';
import { Check, ArrowLeft, Sparkles, Chrome } from 'lucide-react';
import * as ReactRouter from 'react-router';
const { Link } = ReactRouter;

const tiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring prompt enhancement',
    features: [
      '10 enhanced prompts per month',
      'Basic prompt optimization',
      'Copy to clipboard',
      'Web access only',
    ],
    cta: 'Start Free',
    ctaStyle: 'bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For professionals who rely on AI daily',
    features: [
      'Unlimited enhanced prompts',
      'Advanced prompt structuring',
      'Chrome extension access',
      'Priority support',
      'Save & organize prompts',
      'Prompt history & analytics',
    ],
    cta: 'Go Pro',
    ctaStyle: 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/20',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Team',
    price: '$39',
    period: 'per month',
    description: 'Collaborative prompt engineering for teams',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared prompt library',
      'Team analytics dashboard',
      'Custom prompt templates',
      'Dedicated account manager',
    ],
    cta: 'Start Team Trial',
    ctaStyle: 'bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300',
    highlighted: false,
  },
];

function Header() {
  return (
    <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full border-b border-gray-100">
      <Link to="/" className="flex items-center gap-2 group">
        <ArrowLeft size={18} className="text-gray-400 group-hover:text-gray-900 transition-colors" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-serif font-bold text-xl">
            P
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-gray-900">PromptPilot</span>
        </div>
      </Link>
      <Link 
        to="/"
        className="text-sm font-medium bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-sm"
      >
        Try PromptPilot
      </Link>
    </nav>
  );
}

export function PricingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-gray-900 mb-6 leading-[1.1]">
            Pricing that scales with your workflow.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 font-light">
            Start for free. Upgrade when you need more power. Cancel anytime.
          </p>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 flex flex-col ${
                tier.highlighted
                  ? 'border-2 border-black shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-4 ring-gray-50'
                  : 'border border-gray-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]'
              } transition-all hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)]`}
            >
              {/* Badge for highlighted tier */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-black text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    <Sparkles size={12} className="text-yellow-300" />
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {tier.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-5xl font-semibold text-gray-900">
                    {tier.price}
                  </span>
                  <span className="text-gray-500 text-sm font-light">
                    / {tier.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check size={12} strokeWidth={3} className="text-green-700" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3.5 rounded-full font-medium text-sm transition-all hover:-translate-y-0.5 ${tier.ctaStyle}`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center bg-gray-50 rounded-3xl p-12 border border-gray-100"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-medium text-gray-900 mb-4">
              Ready to write better prompts?
            </h2>
            <p className="text-gray-500 mb-8">
              Start with our free tier and see the difference. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/"
                className="bg-black text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                Try PromptPilot Free
              </Link>
              <a 
                href="#"
                className="bg-white border-2 border-gray-200 text-gray-900 px-8 py-3.5 rounded-full font-medium hover:bg-gray-50 hover:border-gray-300 transition-all inline-flex items-center gap-2"
              >
                <Chrome size={16} />
                Install Extension
              </a>
            </div>
          </div>
        </motion.div>

        {/* FAQ or Additional Info (optional) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-400">
            All plans include access to our core prompt enhancement features.{' '}
            <a href="#" className="text-gray-600 hover:text-gray-900 underline transition-colors">
              Compare features
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
