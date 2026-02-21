import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface SideSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: (e: string, p: string) => void;
}

export function SideSignupModal({ isOpen, onClose, onSignup }: SideSignupModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    await onSignup(email, password);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-[60] w-full max-w-sm bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden"
        >
          <div className="p-6 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-full"
            >
              <X size={18} />
            </button>

            <div className="mb-6 flex items-start gap-4">
              <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-black/10">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">Save your prompts?</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Don't lose your work. Create a free account to save history and access templates.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                required
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                required
              />
              
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={onClose} 
                  className="flex-1 bg-white border border-gray-200 text-gray-600 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-xs"
                >
                  No thanks
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] bg-black text-white font-medium py-2.5 rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-black/5 text-xs disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Free Account'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
