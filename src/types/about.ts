export interface SkillItem {
  id: string;
  name: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  items: SkillItem[];
}

export interface AboutMyself {
  title: string;
  description: string[];
}

export interface AboutSkills {
  title: string;
  categories: SkillCategory[];
}

export interface AboutData {
  id: string;
  myself: AboutMyself;
  skills: AboutSkills;
  updatedAt: string;
  createdAt?: string;
}

export const defaultAboutData: AboutData = {
  id: "default-about",
  myself: {
    title: "About Myself",
    description: [
      "I'm a passionate Full Stack Web Developer with expertise in modern web technologies. I love creating efficient, scalable, and user-friendly applications.",
      "With a strong foundation in both frontend and backend development, I enjoy solving complex problems and building innovative solutions.",
    ],
  },
  skills: {
    title: "My Skills",
    categories: [
      {
        id: "frontend",
        name: "Frontend Development",
        items: [
          {
            id: "react",
            name: "React.js",
            description: "Building dynamic and interactive user interfaces",
          },
          {
            id: "nextjs",
            name: "Next.js",
            description:
              "Full-stack React framework for production applications",
          },
          {
            id: "tailwind",
            name: "Tailwind CSS",
            description: "Utility-first CSS framework for rapid UI development",
          },
        ],
      },
      {
        id: "backend",
        name: "Backend Development",
        items: [
          {
            id: "nodejs",
            name: "Node.js",
            description: "Server-side JavaScript runtime environment",
          },
          {
            id: "mongodb",
            name: "MongoDB",
            description: "NoSQL database for modern applications",
          },
          {
            id: "api",
            name: "RESTful APIs",
            description: "Designing and implementing scalable APIs",
          },
        ],
      },
    ],
  },
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};
