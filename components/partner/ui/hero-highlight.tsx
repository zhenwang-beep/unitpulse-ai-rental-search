"use client";

import React, { useState, MouseEvent, useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";

interface SpotlightHighlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightSize?: number;
  intensity?: number;
}

export function SpotlightHighlight({
  children,
  className = "",
  spotlightSize = 250,
  intensity = 1,
}: SpotlightHighlightProps) {
  const mouseX = useMotionValue(-spotlightSize);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    // Start position vertically centered, offscreen to the left
    mouseY.set(height / 2);
    mouseX.set(-spotlightSize);

    // Animate the spotlight from left to right on mount
    const controls = animate(mouseX, width + spotlightSize, {
      duration: 1.8,
      ease: "easeInOut",
      delay: 0.4, // Short delay so it's noticeable after page load
      onComplete: () => {
        setIsAnimating(false);
      }
    });

    return controls.stop;
  }, [mouseX, mouseY, spotlightSize]);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    if (isAnimating) return; // Ignore mouse movement during the initial animation
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <span
      ref={containerRef}
      // Added padding (px-2, pr-4, pb-4) to prevent italic text and descenders from being cut off by overflow-hidden.
      // Added negative margins (-ml-2, -mr-4, -mb-4) to prevent layout shift.
      className={`relative inline-block overflow-hidden rounded-sm px-2 pr-4 pb-4 -ml-2 -mr-4 -mb-4 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: isHovered || isAnimating ? intensity : 0,
          background: useMotionTemplate`
            radial-gradient(
              ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
              rgba(0, 0, 0, 0.8),
              transparent 80%
            )
          `,
        }}
      />
      <span 
        className="relative z-10 transition-colors duration-300"
        style={{ color: isHovered || isAnimating ? "white" : "inherit" }}
      >
        {children}
      </span>
    </span>
  );
}
