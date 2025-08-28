export interface AboutData {
  id: string;
  myself: {
    title: string;
    description: string[];
  };
  skills: {
    title: string;
    categories: SkillCategory[];
  };
  updatedAt: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  items: SkillItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  description: string;
}

// Default fallback data from old website
export const defaultAboutData: AboutData = {
  id: "default",
  myself: {
    title: "Myself",
    description: [
      "Hello! I'm <strong>Md. Riazul Islam</strong> a self-taught & passionate <strong>Programmer & Full Stack Web Developer</strong> with over one year work experience.",
      "As an enthusiastic programmer, I enjoy solving various challenges. I also appreciate growing and acquiring new skills, and I am committed to my work. I work collaboratively with my clients to provide the best solutions for their needs.",
    ],
  },
  skills: {
    title: "Skills",
    categories: [
      {
        id: "category-1",
        name: "Technical Skills",
        items: [
          {
            id: "skill-1",
            name: "Programming Language",
            description: "C++, Python, JavaScript",
          },
          {
            id: "skill-2",
            name: "Problem Solving",
            description: "C++",
          },
          {
            id: "skill-3",
            name: "Application Dev",
            description: "Android, iOS",
          },
          {
            id: "skill-4",
            name: "Version Control",
            description: "Git, Github",
          },
        ],
      },
      {
        id: "category-2",
        name: "Web & Mobile",
        items: [
          {
            id: "skill-5",
            name: "Web Designing",
            description: "HTML, CSS",
          },
          {
            id: "skill-6",
            name: "Web Development",
            description: "React",
          },
          {
            id: "skill-7",
            name: "Mobile Application",
            description: "React Native",
          },
          {
            id: "skill-8",
            name: "Language",
            description: "Bangla, English, Hindi",
          },
        ],
      },
    ],
  },
  updatedAt: new Date().toISOString(),
};
