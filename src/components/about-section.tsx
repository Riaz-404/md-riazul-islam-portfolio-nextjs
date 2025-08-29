import * as React from "react";
import { Check } from "lucide-react";
import { AboutData, defaultAboutData } from "@/types/about";
import { SocialLink, defaultNavigationData } from "@/types/navigation";
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

async function getAboutData(): Promise<AboutData> {
  try {
    // Use the service function directly instead of making HTTP request
    const aboutData = await getAboutDataFromDB();
    return aboutData;
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

    // Ensure plain objects with all required fields
    return links.map((link) => ({
      id: link.id,
      href: link.href,
      icon: link.icon,
      iconType: link.iconType || "lucide",
      imageUrl: link.imageUrl || "",
      label: link.label,
      order: link.order,
      isActive: link.isActive,
    }));
  } catch (error) {
    console.error("Error fetching social links:", error);
    return defaultNavigationData.socialLinks.filter((link) => link.isActive);
  }
}

export async function AboutSection() {
  const aboutData = await getAboutData();

  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="container">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16 max-w-6xl mx-auto"
        >
          {/* Myself Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            <MotionDiv variants={itemVariants} className="lg:col-span-1">
              <MotionH2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                <span className="text-primary">—</span>
                {aboutData.myself.title}
              </MotionH2>
            </MotionDiv>

            <MotionDiv
              variants={itemVariants}
              className="lg:col-span-3 space-y-6"
            >
              {aboutData.myself.description.map((paragraph, index) => (
                <MotionP
                  key={index}
                  variants={itemVariants}
                  className="text-muted-foreground text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </MotionDiv>
          </div>

          {/* Skills Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            <MotionDiv variants={itemVariants} className="lg:col-span-1">
              <MotionH2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
                <span className="text-primary">—</span>
                {aboutData.skills.title}
              </MotionH2>
            </MotionDiv>

            <MotionDiv variants={itemVariants} className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aboutData.skills.categories.map((category, categoryIndex) => (
                  <MotionDiv
                    key={category.id}
                    variants={itemVariants}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      {category.name}
                    </h3>
                    <ul className="space-y-4">
                      {category.items.map((skill, skillIndex) => (
                        <MotionDiv
                          key={skill.id}
                          variants={itemVariants}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: categoryIndex * 0.1 + skillIndex * 0.05,
                          }}
                        >
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <span className="text-foreground font-medium">
                              {skill.name}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              - {skill.description}
                            </span>
                          </div>
                        </MotionDiv>
                      ))}
                    </ul>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
