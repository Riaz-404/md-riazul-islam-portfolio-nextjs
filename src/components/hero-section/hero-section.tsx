import * as React from "react";
import Image from "next/image";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MotionDiv,
  MotionH1,
  MotionH2,
  MotionP,
} from "@/components/motion/motion-html-element";
import { RotatingText } from "./rotating-text";
import { HeroData } from "@/types/hero";

async function getHeroData(): Promise<HeroData> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}/api/hero`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch hero data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching hero data:", error);
    const { defaultHeroData } = await import("@/types/hero");
    return { id: "hero-1", ...defaultHeroData };
  }
}

export async function HeroSection() {
  const heroData = await getHeroData();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center py-20 lg:py-28"
    >
      <div className="container">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto"
        >
          {/* Profile Image */}
          <MotionDiv
            variants={itemVariants}
            className="order-1 lg:order-1 flex justify-center"
          >
            <div className="relative">
              <MotionDiv
                className="w-80 h-96 lg:w-96 lg:h-130 rounded-xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={heroData.profileImage}
                  alt={heroData.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </MotionDiv>
              {/* Decorative elements */}
              <MotionDiv
                className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <MotionDiv
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/60 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </div>
          </MotionDiv>

          {/* Content */}
          <MotionDiv
            variants={itemVariants}
            className="order-2 lg:order-2 text-left space-y-6"
          >
            {/* Name */}
            <MotionH2
              variants={itemVariants}
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground"
            >
              {heroData.name}
            </MotionH2>

            {/* Animated Role Text */}
            <MotionDiv variants={itemVariants} className="relative">
              <MotionH1 className="text-base lg:text-lg xl:text-xl font-normal">
                <span className="text-primary mr-2">—</span>
                <RotatingText rotatingTexts={heroData.rotatingTexts} />
              </MotionH1>
            </MotionDiv>

            {/* Description */}
            <MotionP
              variants={itemVariants}
              className="text-muted-foreground text-lg lg:text-xl leading-relaxed max-w-2xl"
            >
              {heroData.description}
            </MotionP>

            {/* Technology Icons */}
            <MotionDiv
              variants={itemVariants}
              className="flex flex-wrap justify-start gap-3 py-6"
            >
              {heroData.techIcons.map((tech, index) => (
                <MotionDiv
                  key={tech.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 },
                  }}
                  className="relative group"
                >
                  <img
                    src={tech.src}
                    alt={tech.title}
                    title={tech.title}
                    className="w-6 h-6 lg:w-8 lg:h-8 object-contain"
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {tech.title}
                  </div>
                </MotionDiv>
              ))}
            </MotionDiv>

            {/* Download CV Button */}
            <MotionDiv variants={itemVariants} className="pt-4">
              <Button
                size="lg"
                className="bg-transparent border-2 border-border hover:border-primary hover:bg-primary text-foreground hover:text-primary-foreground transition-all duration-300 px-8 py-3 text-lg font-medium"
                asChild
              >
                <a
                  href={heroData.cvDownloadUrl}
                  className="inline-flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download CV
                </a>
              </Button>
            </MotionDiv>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
