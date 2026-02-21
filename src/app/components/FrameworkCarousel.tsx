import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const FRAMEWORKS = [
  {
    name: 'SWOT Analysis',
    description: 'Turns messy strategy into structured decisions.'
  },
  {
    name: 'Problem → Solution → Impact',
    description: 'Clarifies messaging.'
  },
  {
    name: 'Jobs To Be Done',
    description: 'Frames work around real user needs.'
  },
  {
    name: 'Product Requirements Structure',
    description: 'Turns ideas into clear specs.'
  },
  {
    name: 'Technical Debug Template',
    description: 'Systematic troubleshooting.'
  },
  {
    name: 'AIDA Framework',
    description: 'Guides attention to action.'
  }
];

const TESTIMONIALS = [
  {
    quote: "Turned my messy PRD into actual structure. Finally.",
    author: "Sarah Chen",
    role: "Product Lead"
  },
  {
    quote: "I use this before every ChatGPT session. Game changer.",
    author: "Marcus Reid",
    role: "Engineering Manager"
  },
  {
    quote: "My team stopped writing vague prompts. This works.",
    author: "Elena Vasquez",
    role: "Strategy Director"
  },
  {
    quote: "Built this into our workflow. Output quality went up 10x.",
    author: "David Park",
    role: "Head of Ops"
  }
];

export function FrameworkCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FRAMEWORKS.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % FRAMEWORKS.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + FRAMEWORKS.length) % FRAMEWORKS.length);
  };

  return (
    <section className="w-full py-32 border-y" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-medium mb-16 text-center lg:text-left" style={{ color: 'var(--text-primary)' }}>
              Structured by design.
            </h2>

            {/* Carousel */}
            <div className="relative">
              <div className="min-h-[180px] flex items-center justify-center lg:justify-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-center lg:text-left"
                  >
                    <h3 className="font-serif text-3xl md:text-4xl font-medium mb-4" style={{ color: 'var(--text-primary)' }}>
                      {FRAMEWORKS[currentIndex].name}
                    </h3>
                    <p className="text-lg md:text-xl font-light" style={{ color: 'var(--text-secondary)' }}>
                      {FRAMEWORKS[currentIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 mt-12">
                <button
                  onClick={goToPrev}
                  className="p-2 rounded-full transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Previous framework"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex items-center gap-2">
                  {FRAMEWORKS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentIndex(index);
                      }}
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: index === currentIndex ? '32px' : '8px',
                        backgroundColor: index === currentIndex ? 'var(--text-primary)' : 'var(--border-default)'
                      }}
                      aria-label={`Go to framework ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  className="p-2 rounded-full transition-colors hover:opacity-80"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label="Next framework"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="min-h-[300px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl p-8 border"
                  style={{ backgroundColor: 'var(--surface-elevated)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}
                >
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} className="fill-current" style={{ color: 'var(--text-primary)' }} />
                    ))}
                  </div>

                  <p className="text-lg md:text-xl font-medium mb-6 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    "{TESTIMONIALS[testimonialIndex].quote}"
                  </p>

                  <div className="border-t pt-6" style={{ borderColor: 'var(--border-subtle)' }}>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {TESTIMONIALS[testimonialIndex].author}
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                      {TESTIMONIALS[testimonialIndex].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}