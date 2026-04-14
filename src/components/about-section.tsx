import * as React from "react";
import { AboutData, defaultAboutData } from "@/types/about";
import { SocialLink, defaultNavigationData } from "@/types/navigation";
import { getAboutData as getAboutDataFromDB } from "@/lib/about-service";
import {
  MotionDiv,
  MotionH2,
  MotionP,
} from "@/components/motion/motion-html-element";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

async function getAboutData(): Promise<AboutData> {
  try {
    return await getAboutDataFromDB();
  } catch (error) {
    console.error("Error fetching about data:", error);
    return defaultAboutData;
  }
}

async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const { NavigationService } = await import("@/lib/navigation-service");
    const navigation = await NavigationService.getNavigation();
    const links =
      navigation?.socialLinks?.filter((link: SocialLink) => link.isActive) ||
      defaultNavigationData.socialLinks;
    return links.map((link) => ({
      id: link.id,
      href: link.href,
      icon: link.icon,
      label: link.label,
      order: link.order,
      isActive: link.isActive,
    }));
  } catch {
    return defaultNavigationData.socialLinks.filter((l) => l.isActive);
  }
}

// Category accent colors for visual variety
const CATEGORY_COLORS = [
  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
];

export async function AboutSection() {
  const aboutData = await getAboutData();

  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Section header */}
        <MotionDiv
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease }}
          className="mb-16 lg:mb-20"
        >
          <MotionP
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-3"
          >
            Who I am
          </MotionP>
          <MotionH2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight max-w-xl"
          >
            {aboutData.myself.title}
          </MotionH2>
        </MotionDiv>

        {/* Bio + Skills grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Bio column */}
          <div className="space-y-5">
            {aboutData.myself.description.map((paragraph, i) => (
              <MotionP
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease }}
                className="text-muted-foreground text-base lg:text-[17px] leading-[1.75]"
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            ))}

            {/* Decorative stat cards */}
            <MotionDiv
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="grid grid-cols-2 gap-3 pt-4"
            >
              {[
                { value: "5+", label: "Years Experience" },
                { value: "20+", label: "Projects Shipped" },
                { value: "10+", label: "Happy Clients" },
                { value: "100%", label: "Remote Ready" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-card p-4 hover:border-primary/30 transition-colors duration-200"
                >
                  <p className="text-2xl font-extrabold text-foreground tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {item.label}
                  </p>
                </div>
              ))}
            </MotionDiv>
          </div>

          {/* Skills column */}
          <div className="space-y-8">
            <div>
              <MotionP
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-xs font-semibold uppercase tracking-[0.12em] text-primary mb-5"
              >
                {aboutData.skills.title}
              </MotionP>

              <div className="space-y-7">
                {aboutData.skills.categories.map((category, catIdx) => (
                  <MotionDiv
                    key={category.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: catIdx * 0.1, ease }}
                    className="space-y-3"
                  >
                    <h3 className="text-sm font-semibold text-foreground tracking-wide">
                      {category.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill) => (
                        <span
                          key={skill.id}
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-200 hover:scale-105 ${
                            CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length]
                          }`}
                          title={skill.description}
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
