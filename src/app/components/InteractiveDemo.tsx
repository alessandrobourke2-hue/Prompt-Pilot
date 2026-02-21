import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Copy, ExternalLink, Loader2, Play, Check, Chrome, ArrowRight, RotateCcw, Search } from 'lucide-react';
import { toast } from 'sonner';

// Demo Step Type
type DemoStep = 'typing' | 'ready' | 'enhancing' | 'result';
type Intent = 'auto' | 'linkedin' | 'email' | 'outreach' | 'blog' | 'product' | 'strategy' | 'tech';

export function InteractiveDemo() {
  const [step, setStep] = useState<DemoStep>('typing');
  const [typedText, setTypedText] = useState('');
  const fullText = "Write a LinkedIn post about productivity.";
  const [isHovering, setIsHovering] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<Intent>('auto');

  // Typing Effect
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (step === 'typing') {
      if (typedText.length < fullText.length) {
        // Variable typing speed for realism
        const speed = Math.random() * 50 + 30;
        
        timeout = setTimeout(() => {
          setTypedText(fullText.slice(0, typedText.length + 1));
        }, speed);
      } else {
        // Typing finished
        timeout = setTimeout(() => setStep('ready'), 800);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [step, typedText]);

  const handleEnhance = () => {
    setStep('enhancing');
    setTimeout(() => {
      setStep('result');
    }, 1500); // Simulate processing time
  };

  const handleReset = () => {
    setStep('typing');
    setTypedText('');
  };

  return (
    <section id="how-it-works" className="w-full py-24 bg-gray-50/50 border-t border-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-gray-900 mb-4">See how it works.</h2>
          <p className="text-lg text-gray-500 font-light">From idea to structured prompt in seconds.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Demo Container - Left Column (2/3 width) */}
          <div 
            className="lg:col-span-2 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative min-h-[500px] transition-all duration-500 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] flex flex-col"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="p-8 md:p-12 flex-1 flex flex-col items-center justify-center w-full relative">
              <AnimatePresence mode="wait">
                
                {/* Step 1 & 2: Input & Enhance Button */}
                {(step === 'typing' || step === 'ready') && (
                  <motion.div 
                    key="input-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    className="w-full max-w-2xl"
                  >
                    {/* Search Bar matching main landing page */}
                    <div className="relative mb-6 group">
                      <div className="absolute inset-0 bg-gray-200/50 rounded-full blur-xl transform group-hover:scale-105 transition-transform duration-500 opacity-50" />
                      <div className={`relative bg-white rounded-full transition-all duration-300 ${step === 'ready' ? 'shadow-[0_12px_50px_rgba(0,0,0,0.12)]' : 'shadow-[0_8px_40px_rgba(0,0,0,0.08)]'} hover:shadow-[0_12px_50px_rgba(0,0,0,0.12)] p-2 flex items-center border border-gray-100`}>
                        <div className="pl-6 text-gray-400">
                          <Search size={24} />
                        </div>
                        <div className="flex-1 px-4 py-4 text-lg text-gray-900 font-medium">
                          {typedText}
                          {step === 'typing' && <span className="animate-pulse text-black ml-1 inline-block h-6 w-0.5 bg-black align-middle"></span>}
                        </div>
                        <button 
                          onClick={handleEnhance}
                          disabled={step === 'typing'}
                          className={`bg-black text-white p-3.5 rounded-full transition-all ${step === 'typing' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                        >
                          <ArrowRight size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Mode Selector Pills */}
                    <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                      <span className="text-xs font-medium text-gray-500 mr-1">Optimize for:</span>
                      {(['auto', 'linkedin', 'email', 'outreach', 'blog', 'product', 'strategy', 'tech'] as Intent[]).map((intent) => (
                        <button
                          key={intent}
                          onClick={() => setSelectedIntent(intent)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedIntent === intent
                              ? 'bg-black text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {intent.charAt(0).toUpperCase() + intent.slice(1)}
                        </button>
                      ))}
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-2 font-medium">Try guided mode for structured workflows</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Processing */}
                {step === 'enhancing' && (
                  <motion.div 
                    key="processing-step"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gray-100 rounded-full blur-xl opacity-50 animate-pulse" />
                      <Loader2 size={56} className="text-black animate-spin relative z-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-2xl text-gray-900 mb-2 font-medium">Structuring your prompt...</h3>
                    <p className="text-gray-400">Refining clarity and constraints</p>
                  </motion.div>
                )}

                {/* Step 4: Result */}
                {step === 'result' && (
                  <motion.div 
                    key="result-step"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-xl"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-xs text-gray-400">
                        {selectedIntent === 'auto' ? 'Detected: LinkedIn' : `Using: ${selectedIntent.charAt(0).toUpperCase() + selectedIntent.slice(1)} (override)`}
                      </p>
                      <button 
                        onClick={handleReset}
                        className="text-xs font-medium text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
                      >
                        <RotateCcw size={12} />
                        Replay demo
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8 relative shadow-sm ring-1 ring-black/5 hover:shadow-md transition-shadow">
                      <div className="space-y-6">
                        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                           <div>
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Role</span>
                             <p className="font-serif text-xl text-gray-900 font-medium">Expert Content Strategist</p>
                           </div>
                           <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                             <Check size={12} strokeWidth={3} /> Optimized
                           </div>
                        </div>
                         
                        <div>
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Task</span>
                           <p className="text-gray-800 leading-relaxed">Create a viral LinkedIn post about productivity systems for founders that emphasizes actionable advice.</p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                           <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Structure</span>
                           <ul className="space-y-2">
                             {['Hook (first 2 lines) - Grab attention immediately', 'Core insight - Provide value', 'Actionable steps - Give clear instructions', 'Engagement question - Encourage comments'].map((item, i) => (
                               <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                 {item}
                               </li>
                             ))}
                           </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">We structure it for optimal AI output</p>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Extension Feature Block - Right Column (1/3 width) */}
          <div className="lg:col-span-1 flex flex-col">
             <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center relative overflow-hidden hover:border-gray-200 transition-all group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <Chrome size={24} className="text-blue-600" />
                  </div>
                  
                  <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-3 leading-tight">
                    Use inside ChatGPT
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed mb-8">
                    Skip the copy-paste. Enhance prompts directly with our extension.
                  </p>
                  
                  <a 
                    href="#"
                    className="w-full bg-black text-white px-6 py-3.5 rounded-xl font-medium text-sm hover:bg-gray-800 transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn"
                  >
                    <Chrome size={16} />
                    Install Extension
                    <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}