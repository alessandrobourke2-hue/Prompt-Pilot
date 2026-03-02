import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export interface Question {
  id: string;
  question: string;
  type: 'text' | 'choice';
  options?: string[];
  placeholder?: string;
}

export interface QuestionAnswer {
  questionId: string;
  question: string;
  answer: string;
}

interface QuestionFlowProps {
  questions: Question[];
  onComplete: (answers: QuestionAnswer[]) => void;
  onSkipAll: () => void;
}

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 52 : -52,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -52 : 52,
    opacity: 0,
  }),
};

export function QuestionFlow({ questions, onComplete, onSkipAll }: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(QuestionAnswer | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [direction, setDirection] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  // Focus textarea when arriving at a text question
  useEffect(() => {
    if (currentQuestion.type === 'text' && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 320);
    }
  }, [currentIndex, currentQuestion.type]);

  // Reset current answer when navigating to a new question
  useEffect(() => {
    const saved = answers[currentIndex];
    setCurrentAnswer(saved ? saved.answer : '');
  }, [currentIndex]);

  const commit = (skip = false) => {
    const updatedAnswers = [...answers];

    if (!skip && currentAnswer.trim()) {
      updatedAnswers[currentIndex] = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answer: currentAnswer.trim(),
      };
      setAnswers(updatedAnswers);
    }

    if (isLast) {
      const finalAnswers = updatedAnswers.filter(
        (a): a is QuestionAnswer => a !== null
      );
      onComplete(finalAnswers);
    } else {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      commit();
    }
  };

  const handleChoiceSelect = (option: string) => {
    setCurrentAnswer((prev) => (prev === option ? '' : option));
  };

  const continueEnabled =
    currentQuestion.type === 'text'
      ? true // text type: always can continue (empty = skip)
      : !!currentAnswer; // choice type: need a selection

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress header */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: i === currentIndex ? 28 : 8,
                backgroundColor:
                  i < currentIndex
                    ? '#15803d'
                    : i === currentIndex
                    ? '#1a1a1a'
                    : '#e7e5e4',
              }}
              transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Question {currentIndex + 1} of {questions.length}
        </motion.p>
      </div>

      {/* Question card */}
      <div className="relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.33, 1, 0.68, 1] }}
            className="bg-white rounded-3xl border overflow-hidden"
            style={{
              boxShadow: '0 20px 60px -15px rgba(0,0,0,0.10)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="p-8 md:p-10">
              {/* Question text */}
              <motion.h2
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.06 }}
                className="font-serif text-2xl md:text-3xl font-medium leading-tight mb-8"
                style={{ color: 'var(--text-primary)' }}
              >
                {currentQuestion.question}
              </motion.h2>

              {/* Input area */}
              {currentQuestion.type === 'choice' && currentQuestion.options ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.1 }}
                  className="flex flex-wrap gap-3 mb-8"
                >
                  {currentQuestion.options.map((option, i) => (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: 0.12 + i * 0.04 }}
                      onClick={() => handleChoiceSelect(option)}
                      className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 border ${
                        currentAnswer === option
                          ? 'border-gray-900 bg-gray-900 text-white shadow-sm scale-[1.02]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 hover:scale-[1.01]'
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.1 }}
                  className="mb-8"
                >
                  <textarea
                    ref={textareaRef}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentQuestion.placeholder || 'Your answer…'}
                    rows={3}
                    className="w-full rounded-2xl p-4 text-base transition-all resize-none placeholder:text-gray-400 focus:outline-none"
                    style={{
                      border: '1.5px solid var(--border-default)',
                      backgroundColor: 'var(--surface)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.border = '1.5px solid #1a1a1a')
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.border =
                        '1.5px solid var(--border-default)')
                    }
                  />
                  <p className="mt-2 text-xs text-gray-400">
                    Press Enter to continue
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => commit(true)}
                  className="text-sm font-medium transition-colors py-2 px-1"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--text-secondary)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--text-muted)')
                  }
                >
                  Skip
                </button>

                <button
                  onClick={() => commit(false)}
                  disabled={!continueEnabled}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                    continueEnabled
                      ? 'bg-gray-900 text-white hover:bg-gray-700 hover:-translate-y-0.5 shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLast ? 'Enhance prompt' : 'Continue'}
                  <ArrowRight size={15} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Stop link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-6"
      >
        <button
          onClick={onSkipAll}
          className="text-xs transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = 'var(--text-secondary)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = 'var(--text-muted)')
          }
        >
          Skip all — enhance now
        </button>
      </motion.div>
    </div>
  );
}
