import * as React from "react";
import Image from "next/image";
import { Download, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  MotionDiv,
  MotionH1,
  MotionP,
} from "@/components/motion/motion-html-element";
import { RotatingText } from "./rotating-text";
import { HeroData } from "@/types/hero";

async function getHeroData(): Promise<HeroData> {
  try {
    const { getHeroData: getHeroDataFromDB } = await import("@/lib/hero-service");
    const heroData = await getHeroDataFromDB();
    if (!heroData) throw new Error("No hero data found");
    return {
      id: heroData.id,
      name: heroData.name,
      description: heroData.description,
      profileImage: heroData.profileImage || "/images/home/IMG_20211125_201810.jpg",
      cvDownloadUrl: heroData.cvDownloadUrl,
      rotatingTexts: heroData.rotatingTexts.map((text: any) => ({
        id: text.id,
        text: text.text,
      })),
      techIcons: heroData.techIcons.map((icon: any) => ({
        id: icon.id,
        src: icon.src,
        title: icon.title,
      })),
    };
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
      transition: { delayChildren: 0.15, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 24, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden py-24 lg:py-32"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[100px]" />
      </div>

      <div className="container">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center max-w-6xl mx-auto"
        >
          {/* ── Content (Left) ── */}
          <MotionDiv variants={itemVariants} className="order-2 lg:order-1 space-y-7">

            {/* Role Tag */}
            <MotionDiv
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-sm font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <RotatingText rotatingTexts={heroData.rotatingTexts} />
            </MotionDiv>

            {/* Name / Headline */}
            <div className="space-y-2">
              <MotionH1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-bold text-foreground leading-[1.1] tracking-tight"
              >
                {heroData.name}
              </MotionH1>
              <MotionP
                variants={itemVariants}
                className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary/80 tracking-tight"
              >
                Building exceptional web experiences.
              </MotionP>
            </div>

            {/* Bio */}
            <MotionP
              variants={itemVariants}
              className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-[520px]"
            >
              {heroData.description}
            </MotionP>

            {/* Tech Icons */}
            <MotionDiv
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3"
            >
              {heroData.techIcons.map((tech, index) => (
                <MotionDiv
                  key={tech.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.07 }}
                  whileHover={{ scale: 1.2, rotate: [-5, 5, 0], transition: { duration: 0.25 } }}
                  className="relative group"
                >
                  <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-card border border-border hover:border-primary/40 hover:bg-muted transition-all duration-200 shadow-sm">
                    <Image
                      src={tech.src}
                      alt={tech.title}
                      title={tech.title}
                      width={22}
                      height={22}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none shadow-lg">
                    {tech.title}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                  </div>
                </MotionDiv>
              ))}
            </MotionDiv>

            {/* CTAs */}
            <MotionDiv
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group"
                asChild
              >
                <Link href="#projects" className="inline-flex items-center gap-2">
                  View Projects
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-border hover:border-primary/60 hover:bg-primary/8 text-foreground px-7 py-3 text-base font-semibold rounded-xl transition-all duration-200 group"
                asChild
              >
                <a
                  href={heroData.cvDownloadUrl}
                  className="inline-flex items-center gap-2"
                  download
                >
                  <Download className="w-4 h-4" />
                  Download CV
                </a>
              </Button>
            </MotionDiv>
          </MotionDiv>

          {/* ── Profile Image (Right) ── */}
          <MotionDiv
            variants={itemVariants}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Decorative ring */}
              <div
                aria-hidden="true"
                className="absolute inset-[-12px] rounded-2xl border border-primary/15 z-0"
              />
              <div
                aria-hidden="true"
                className="absolute inset-[-24px] rounded-2xl border border-primary/8 z-0"
              />

              {/* Image container */}
              <MotionDiv
                className="relative z-10 w-[280px] h-[340px] sm:w-[320px] sm:h-[400px] lg:w-[360px] lg:h-[450px] rounded-2xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={heroData.profileImage || "/images/home/IMG_20211125_201810.jpg"}
                  alt={heroData.name}
                  width={440}
                  height={560}
                  className="w-full h-full object-cover"
                  priority
                />
                {/* Subtle gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
              </MotionDiv>

              {/* Floating accent dot top-right */}
              <MotionDiv
                className="absolute -top-3 -right-3 w-7 h-7 bg-primary rounded-full z-20 shadow-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Floating accent dot bottom-left */}
              <MotionDiv
                className="absolute -bottom-3 -left-3 w-5 h-5 bg-primary/60 rounded-full z-20"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              />
            </div>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
