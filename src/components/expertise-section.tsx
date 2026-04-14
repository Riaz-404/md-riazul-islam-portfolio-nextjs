import * as React from "react";
import { ExpertiseData } from "@/types/expertise";
import { getExpertiseData as getExpertiseDataFromDB } from "@/lib/expertise-service";
import {
  MotionDiv,
  MotionH2,
  MotionP,
} from "@/components/motion/motion-html-element";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

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

interface SkillBarProps {
  name: string;
  percentage: number;
  index: number;
}

function SkillBar({ name, percentage, index }: SkillBarProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06, ease }}
      className="group"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-xs font-semibold text-primary tabular-nums">
          {percentage}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <MotionDiv
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--primary) 0%, oklch(0.85 0.17 70) 100%)",
          }}
          initial={{ width: "0%" }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1.2,
            delay: 0.4 + index * 0.06,
            ease: [0.34, 1.06, 0.64, 1],
          }}
        />
      </div>
    </MotionDiv>
  );
}

export async function ExpertiseSection() {
  const expertiseData = await getExpertiseData();

  if (!expertiseData.categories.length) return null;

  return (
    <section
      id="expertise"
      className="py-24 lg:py-32 bg-muted/25 border-y border-border/40"
    >
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
          className="mb-16"
        >
          <MotionP className="text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-3">
            {expertiseData.subtitle}
          </MotionP>
          <MotionH2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            {expertiseData.title}
          </MotionH2>
        </MotionDiv>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {expertiseData.categories.map((category: any, categoryIndex: number) => (
            <MotionDiv
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1, ease }}
              className="space-y-5"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 pb-4 border-b border-border/50">
                <div className="w-1.5 h-5 rounded-full bg-primary" />
                <h3 className="text-base font-bold text-foreground tracking-tight">
                  {category.name}
                </h3>
              </div>

              {/* Skill bars */}
              <div className="space-y-5">
                {category.skills.map((skill: any, skillIndex: number) => (
                  <SkillBar
                    key={skill.id}
                    name={skill.name}
                    percentage={skill.percentage}
                    index={categoryIndex * category.skills.length + skillIndex}
                  />
                ))}
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}
