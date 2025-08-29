import * as React from "react";
import { ExpertiseData } from "@/types/expertise";
import { getExpertiseData as getExpertiseDataFromDB } from "@/lib/expertise-service";
import {
  MotionDiv,
  MotionH2,
  MotionH3,
  MotionP,
} from "@/components/motion/motion-html-element";

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

interface SkillBarProps {
  name: string;
  percentage: number;
  index: number;
}

function SkillBar({ name, percentage, index }: SkillBarProps) {
  return (
    <MotionDiv
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-lg font-medium text-foreground">{name}</h4>
        <span className="text-sm text-muted-foreground font-medium">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <MotionDiv
          className="h-full bg-primary rounded-full"
          initial={{ width: "0%" }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 1.5,
            delay: 0.5 + index * 0.1,
            ease: "easeOut",
          }}
        />
      </div>
    </MotionDiv>
  );
}

async function getExpertiseData(): Promise<ExpertiseData> {
  try {
    // Use the service function directly instead of making HTTP request
    const expertiseData = await getExpertiseDataFromDB();
    return expertiseData;
  } catch (error) {
    console.error("Error fetching expertise data:", error);
    // Return a basic fallback structure
    return {
      id: "default-expertise",
      title: "Expertise",
      subtitle: "Skills Set",
      categories: [],
      updatedAt: new Date().toISOString(),
    };
  }
}

export async function ExpertiseSection() {
  const expertiseData = await getExpertiseData();

  return (
    <section id="expertise" className="py-20 lg:py-28 bg-muted/30">
      <div className="container">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16 max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto">
            <MotionP
              variants={itemVariants}
              className="text-primary uppercase tracking-widest text-sm font-medium mb-4 flex items-center justify-center gap-2"
            >
              <span>—</span>
              {expertiseData.subtitle}
              <span>—</span>
            </MotionP>
            <MotionH2
              variants={itemVariants}
              className="text-3xl lg:text-4xl font-bold text-foreground"
            >
              {expertiseData.title}
            </MotionH2>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {expertiseData.categories.map(
              (category: any, categoryIndex: number) => (
                <MotionDiv
                  key={category.id}
                  variants={itemVariants}
                  className="space-y-8"
                >
                  <MotionH3
                    variants={itemVariants}
                    className="text-xl font-semibold text-foreground mb-8 pb-2 border-b border-primary/20"
                  >
                    {category.name}
                  </MotionH3>

                  <div className="space-y-6">
                    {category.skills.map((skill: any, skillIndex: number) => (
                      <SkillBar
                        key={skill.id}
                        name={skill.name}
                        percentage={skill.percentage}
                        index={
                          categoryIndex * category.skills.length + skillIndex
                        }
                      />
                    ))}
                  </div>
                </MotionDiv>
              )
            )}
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
