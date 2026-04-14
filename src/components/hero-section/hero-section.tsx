import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";

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
    const { getHeroData: getHeroDataFromDB } = await import(
      "@/lib/hero-service"
    );
    const heroData = await getHeroDataFromDB();

    if (!heroData) {
      throw new Error("No hero data found");
    }

    return {
      id: heroData.id,
      name: heroData.name,
      description: heroData.description,
      profileImage:
        heroData.profileImage || "/images/home/IMG_20211125_201810.jpg",
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

const STATS = [
  { value: "5+", label: "Years" },
  { value: "20+", label: "Projects" },
  { value: "10+", label: "Clients" },
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export async function HeroSection() {
  const heroData = await getHeroData();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 dot-grid opacity-[0.35]" />
      <div className="absolute inset-0 mesh-bg" />
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8 w-full pt-28 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">
          {/* ── Left column: Content ── */}
          <div className="space-y-8 max-w-xl">
            {/* Available badge */}
            <MotionDiv
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-sm font-medium"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Available for hire
              <ArrowRight className="h-3.5 w-3.5" />
            </MotionDiv>

            {/* Name — large editorial type */}
            <MotionH1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-extrabold tracking-tight text-foreground leading-[1.04]"
            >
              {(() => {
                const parts = heroData.name.split(" ");
                return parts.map((word, i) =>
                  i === parts.length - 1 ? (
                    <span key={i} className="block gradient-text">
                      {word}
                    </span>
                  ) : (
                    <span key={i} className="block">
                      {word}
                    </span>
                  )
                );
              })()}
            </MotionH1>

            {/* Animated role */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-px bg-primary/50 shrink-0" />
              <span className="text-base font-medium text-primary tracking-wide">
                <RotatingText rotatingTexts={heroData.rotatingTexts} />
              </span>
            </MotionDiv>

            {/* Description */}
            <MotionP
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease }}
              className="text-muted-foreground text-lg leading-relaxed max-w-md"
            >
              {heroData.description}
            </MotionP>

            {/* CTAs */}
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 h-12 text-base font-medium gap-2 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                asChild
              >
                <Link href="#projects">
                  View My Work
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border/80 hover:border-primary hover:text-primary h-12 px-6 text-base font-medium gap-2 transition-all duration-200 hover:-translate-y-0.5"
                asChild
              >
                <a href={heroData.cvDownloadUrl} download>
                  <Download className="h-4 w-4" />
                  Download CV
                </a>
              </Button>
            </MotionDiv>

            {/* Stats strip */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65, ease }}
              className="flex items-center gap-8 pt-2"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl font-bold text-foreground leading-none">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
              <div className="h-8 w-px bg-border/60 mx-2" />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Bangladesh</span>
              </div>
            </MotionDiv>
          </div>

          {/* ── Right column: Profile image ── */}
          <MotionDiv
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease }}
            className="relative flex justify-center lg:justify-end order-first lg:order-last"
          >
            {/* Background glow */}
            <div className="absolute -inset-8 bg-primary/10 dark:bg-primary/15 blur-3xl rounded-full" />

            {/* Photo frame */}
            <div className="relative w-[280px] h-[380px] sm:w-[320px] sm:h-[430px] lg:w-[340px] lg:h-[460px]">
              <div className="w-full h-full rounded-2xl overflow-hidden border border-border/60 shadow-2xl glow">
                <Image
                  src={
                    heroData.profileImage ||
                    "/images/home/IMG_20211125_201810.jpg"
                  }
                  alt={heroData.name}
                  width={400}
                  height={520}
                  className="w-full h-full object-cover"
                  priority
                />
                {/* Subtle gradient at base */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Tech stack pill — bottom left */}
              <MotionDiv
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75, ease }}
                className="absolute -bottom-4 -left-4 glass border border-border/60 rounded-2xl p-3 shadow-xl"
              >
                <div className="flex flex-wrap gap-2 max-w-[140px]">
                  {heroData.techIcons.slice(0, 6).map((tech) => (
                    <div key={tech.id} title={tech.title}>
                      <Image
                        src={tech.src}
                        alt={tech.title}
                        width={22}
                        height={22}
                        className="w-5.5 h-5.5 object-contain"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 font-semibold uppercase tracking-wide">
                  Tech Stack
                </p>
              </MotionDiv>

              {/* Experience pill — top right */}
              <MotionDiv
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8, ease }}
                className="absolute -top-4 -right-4 glass border border-border/60 rounded-2xl px-4 py-3 shadow-xl"
              >
                <p className="text-2xl font-extrabold text-foreground leading-none">
                  5+
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wide">
                  Yrs Building
                </p>
              </MotionDiv>
            </div>
          </MotionDiv>
        </div>

        {/* Full tech icon strip at bottom */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease }}
          className="mt-16 lg:mt-20 pt-8 border-t border-border/40"
        >
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-4">
            Built with
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            {heroData.techIcons.map((tech, i) => (
              <MotionDiv
                key={tech.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.7, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.15, y: -2 }}
                transition={{ duration: 0.4, delay: 0.9 + i * 0.04 }}
                title={tech.title}
                className="cursor-default"
              >
                <Image
                  src={tech.src}
                  alt={tech.title}
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
