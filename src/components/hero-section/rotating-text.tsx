"use client";

import * as React from "react";
import { AnimatePresence } from "motion/react";
import { MotionSpan } from "../motion/motion-html-element";
import { RotatingText as RotatingTextType } from "@/types/hero";

interface RotatingTextProps {
  rotatingTexts: RotatingTextType[];
}

export function RotatingText({ rotatingTexts }: RotatingTextProps) {
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (rotatingTexts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % rotatingTexts.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  if (rotatingTexts.length === 0) {
    return (
      <MotionSpan className="text-primary inline-block">Developer</MotionSpan>
    );
  }

  return (
    <span className="inline-block overflow-hidden align-bottom h-[1.4em]">
      <AnimatePresence mode="wait" initial={false}>
        <MotionSpan
          key={current}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            duration: 0.35,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="text-primary inline-block"
        >
          {rotatingTexts[current]?.text || "Developer"}
        </MotionSpan>
      </AnimatePresence>
    </span>
  );
}
