import * as React from "react";
import { AboutData, defaultAboutData } from "@/types/about";
import { getAboutData as getAboutDataFromDB } from "@/lib/about-service";
import {
  MotionDiv,
  MotionH2,
  MotionP,
} from "@/components/motion/motion-html-element";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.2, staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6 } },
};

async function getAboutData(): Promise<AboutData> {
  try {
    return await getAboutDataFromDB();
  } catch (error) {
    console.error("Error fetching about data:", error);
    return defaultAboutData;
  }
}

export async function AboutSection() {
  const aboutData = await getAboutData();

  return (
    <section id="about" className="py-24 lg:py-32 bg-muted/20">
      <div className="container">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto space-y-20"
        >
          {/* ── Section label ── */}
          <MotionDiv variants={itemVariants} className="space-y-4">
            <p className="text-primary text-sm font-semibold uppercase tracking-[0.15em]">
              About Me
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-start">
              <MotionH2
                variants={itemVariants}
                className="text-3xl lg:text-4xl font-bold text-foreground"
              >
                {aboutData.myself.title}
              </MotionH2>

              <MotionDiv variants={itemVariants} className="space-y-5">
                {aboutData.myself.description.map((paragraph, index) => (
                  <MotionP
                    key={index}
                    variants={itemVariants}
                    className="text-muted-foreground text-base lg:text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </MotionDiv>
            </div>
          </MotionDiv>

          {/* ── Skills ── */}
          <MotionDiv variants={itemVariants}>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-16 items-start">
              <MotionH2
                variants={itemVariants}
                className="text-3xl lg:text-4xl font-bold text-foreground"
              >
                {aboutData.skills.title}
              </MotionH2>

              <MotionDiv
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-8"
              >
                {aboutData.skills.categories.map((category, categoryIndex) => (
                  <MotionDiv
                    key={category.id}
                    variants={itemVariants}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-1 h-5 rounded-full bg-primary" />
                      <h3 className="text-base font-semibold text-foreground tracking-tight">
                        {category.name}
                      </h3>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill, skillIndex) => (
                        <MotionDiv
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.85 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: categoryIndex * 0.08 + skillIndex * 0.04,
                          }}
                          title={skill.description}
                          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-card border border-border text-foreground hover:border-primary/40 hover:bg-primary/8 hover:text-primary transition-all duration-200 cursor-default"
                        >
                          {skill.name}
                        </MotionDiv>
                      ))}
                    </div>
                  </MotionDiv>
                ))}
              </MotionDiv>
            </div>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
