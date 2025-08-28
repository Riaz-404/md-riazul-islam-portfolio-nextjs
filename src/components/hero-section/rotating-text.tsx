"use client";

import * as React from "react";
import { MotionSpan } from "../motion/motion-html-element";

const rotatingTexts = [
  "Programmer",
  "Problem Solver",
  "Full Stack Web Developer",
  "MERN Stack Web Developer",
  "Photography Lover",
];

export function RotatingText() {
  const [currentTextIndex, setCurrentTextIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MotionSpan
      key={currentTextIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-primary inline-block"
    >
      {rotatingTexts[currentTextIndex]}
    </MotionSpan>
  );
}
