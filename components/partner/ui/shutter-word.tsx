import React, { useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';

interface ShutterWordProps {
  text: string;
  className?: string;
}

export function ShutterWord({ text, className = '' }: ShutterWordProps) {
  const characters = text.split('');
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const handleHover = () => {
    controls.set('hidden');
    controls.start('visible');
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.span
      className={`inline-flex ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
      onMouseEnter={handleHover}
      aria-label={text}
    >
      {characters.map((char, index) => (
        <span key={index} className="relative inline-block" aria-hidden="true">
          {/* Base character fade-in */}
          <motion.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0, filter: 'blur(6px)' },
              visible: { 
                opacity: 1, 
                filter: 'blur(0px)', 
                transition: { duration: 0.8, ease: 'easeOut' } 
              },
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>

          {/* Top Slice */}
          <motion.span
            className="absolute top-0 left-0 inline-block"
            style={{ 
              clipPath: 'polygon(0 0, 100% 0, 100% 30%, 0 30%)',
              filter: 'brightness(0.7)'
            }}
            variants={{
              hidden: { x: '-100%', opacity: 0 },
              visible: { 
                x: ['-100%', '0%', '100%'], 
                opacity: [0, 1, 0], 
                transition: { duration: 0.9, ease: 'easeInOut' } 
              },
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>

          {/* Middle Slice */}
          <motion.span
            className="absolute top-0 left-0 inline-block"
            style={{ 
              clipPath: 'polygon(0 30%, 100% 30%, 100% 70%, 0 70%)',
              filter: 'brightness(1.3)'
            }}
            variants={{
              hidden: { x: '100%', opacity: 0 },
              visible: { 
                x: ['100%', '0%', '-100%'], 
                opacity: [0, 1, 0], 
                transition: { duration: 0.9, ease: 'easeInOut', delay: 0.05 } 
              },
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>

          {/* Bottom Slice */}
          <motion.span
            className="absolute top-0 left-0 inline-block"
            style={{ 
              clipPath: 'polygon(0 70%, 100% 70%, 100% 100%, 0 70%)',
              filter: 'brightness(0.7)'
            }}
            variants={{
              hidden: { x: '-100%', opacity: 0 },
              visible: { 
                x: ['-100%', '0%', '100%'], 
                opacity: [0, 1, 0], 
                transition: { duration: 0.9, ease: 'easeInOut', delay: 0.1 } 
              },
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>

          {/* Shine pass */}
          <motion.span
            className="absolute top-0 left-0 inline-block text-transparent bg-clip-text"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
            variants={{
              hidden: { backgroundPosition: '-100% 0', opacity: 0 },
              visible: { 
                backgroundPosition: ['-100% 0', '200% 0'], 
                opacity: [0, 1, 0],
                transition: { duration: 0.7, ease: 'easeOut', delay: 0.2 } 
              }
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
