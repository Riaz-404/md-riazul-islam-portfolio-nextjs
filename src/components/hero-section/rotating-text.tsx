"use client";

import * as React from "react";
import { MotionSpan } from "../motion/motion-html-element";
import { RotatingText as RotatingTextType } from "@/types/hero";

interface RotatingTextProps {
  rotatingTexts: RotatingTextType[];
}

export function RotatingText({ rotatingTexts }: RotatingTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);

  React.useEffect(() => {
    if (rotatingTexts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  if (rotatingTexts.length === 0) {
    return (
      <MotionSpan className="text-primary inline-block">Developer</MotionSpan>
    );
  }

  return (
    <MotionSpan
      key={currentTextIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-primary inline-block"
    >
      {rotatingTexts[currentTextIndex]?.text || "Developer"}
    </MotionSpan>
  );
}
