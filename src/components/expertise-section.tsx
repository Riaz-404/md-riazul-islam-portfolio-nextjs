import * as React from "react";
import { ExpertiseData } from "@/types/expertise";
import { getExpertiseData as getExpertiseDataFromDB } from "@/lib/expertise-service";
import {
  MotionDiv,
  MotionH2,
  MotionP,
} from "@/components/motion/motion-html-element";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

async function getExpertiseData(): Promise<ExpertiseData> {
  try {
    return await getExpertiseDataFromDB();
  } catch (error) {
    console.error("Error fetching expertise data:", error);
    return {
      id: "default-expertise",
      title: "Expertise",
      subtitle: "Skills Set",
      categories: [],
      updatedAt: new Date().toISOString(),
    };
  }
}

// Map skill percentage to a proficiency label for accessibility
function getProficiencyLabel(percentage: number): string {
  if (percentage >= 90) return "Expert";
  if (percentage >= 75) return "Advanced";
  if (percentage >= 55) return "Intermediate";
  return "Familiar";
}

// Map proficiency to visual weight
function getProficiencyClass(percentage: number): string {
  if (percentage >= 90)
    return "bg-primary/20 border-primary/50 text-primary font-semibold";
  if (percentage >= 75)
    return "bg-primary/10 border-primary/30 text-primary/90 font-medium";
  if (percentage >= 55)
    return "bg-card border-border text-foreground font-medium";
  return "bg-muted/60 border-border/60 text-muted-foreground font-normal";
}

export async function ExpertiseSection() {
  const expertiseData = await getExpertiseData();

  return (
    <section id="expertise" className="py-24 lg:py-32">
      <div className="container">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto space-y-16"
        >
          {/* ── Section Header ── */}
          <div className="space-y-3 max-w-2xl">
            <MotionP
              variants={itemVariants}
              className="text-primary text-sm font-semibold uppercase tracking-[0.15em]"
            >
              {expertiseData.subtitle}
            </MotionP>
            <MotionH2
              variants={itemVariants}
              className="text-3xl lg:text-4xl font-bold text-foreground"
            >
              {expertiseData.title}
            </MotionH2>
            <MotionP variants={itemVariants} className="text-muted-foreground text-base lg:text-lg">
              Technologies and tools I work with every day.
            </MotionP>
          </div>

          {/* ── Categories Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {expertiseData.categories.map((category: any, categoryIndex: number) => (
              <MotionDiv
                key={category.id}
                variants={itemVariants}
                className="space-y-5"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-3 border-b border-border/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h3 className="text-base font-semibold text-foreground tracking-tight">
                    {category.name}
                  </h3>
                </div>

                {/* Skill Tags */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill: any, skillIndex: number) => (
                    <MotionDiv
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.3,
                        delay: categoryIndex * 0.06 + skillIndex * 0.04,
                      }}
                      whileHover={{ scale: 1.05 }}
                      title={`${skill.name} · ${getProficiencyLabel(skill.percentage)}`}
                      className={`px-3.5 py-1.5 rounded-lg text-sm border cursor-default transition-all duration-200 ${getProficiencyClass(skill.percentage)}`}
                    >
                      {skill.name}
                    </MotionDiv>
                  ))}
                </div>

                {/* Proficiency Legend (only first category) */}
                {categoryIndex === 0 && expertiseData.categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {[
                      { label: "Expert", cls: "bg-primary/20 border-primary/50 text-primary" },
                      { label: "Advanced", cls: "bg-primary/10 border-primary/30 text-primary/80" },
                      { label: "Intermediate", cls: "bg-card border-border text-foreground" },
                      { label: "Familiar", cls: "bg-muted/60 border-border/60 text-muted-foreground" },
                    ].map(({ label, cls }) => (
                      <span
                        key={label}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${cls}`}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </MotionDiv>
            ))}
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
