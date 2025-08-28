import * as React from "react";
import Image from "next/image";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MotionDiv,
  MotionH1,
  MotionH2,
  MotionP,
  MotionSpan,
} from "@/components/motion/motion-html-element";
import { RotatingText } from "./rotating-text";

const techIcons = [
  {
    src: "https://img.icons8.com/color/48/000000/c-plus-plus-logo.png",
    title: "C++",
  },
  {
    src: "https://img.icons8.com/color/48/000000/python--v1.png",
    title: "Python",
  },
  {
    src: "https://img.icons8.com/color/48/000000/javascript--v1.png",
    title: "JavaScript",
  },
  {
    src: "/images/home/react.svg",
    title: "React",
  },
  {
    src: "https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/48/000000/external-mongodb-a-cross-platform-document-oriented-database-program-logo-shadow-tal-revivo.png",
    title: "MongoDB",
  },
  {
    src: "https://img.icons8.com/fluency/48/000000/node-js.png",
    title: "NodeJS",
  },
  {
    src: "https://img.icons8.com/color/48/000000/html-5--v1.png",
    title: "HTML5",
  },
  {
    src: "https://img.icons8.com/color/48/000000/css3.png",
    title: "CSS3",
  },
  {
    src: "https://img.icons8.com/color/48/000000/sass.png",
    title: "SCSS",
  },
  {
    src: "https://img.icons8.com/color/48/000000/bootstrap.png",
    title: "Bootstrap",
  },
  {
    src: "https://img.icons8.com/color/48/000000/material-ui.png",
    title: "Material-UI",
  },
  {
    src: "https://img.icons8.com/color/48/000000/firebase.png",
    title: "Firebase",
  },
  {
    src: "https://img.icons8.com/color/48/000000/mysql-logo.png",
    title: "MySQL",
  },
];

export function HeroSection() {
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

  return (
    <section
      id="home"
      className="min-h-screen flex items-center py-20 lg:py-28"
    >
      <div className="container mx-auto px-4">
        <MotionDiv
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center"
        >
          {/* Profile Image */}
          <MotionDiv
            variants={itemVariants}
            className="order-1 lg:order-1 flex justify-center"
          >
            <div className="relative">
              <MotionDiv
                className="w-80 h-96 lg:w-96 lg:h-130 rounded-xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  // src="/images/home/IMG_20211125_201810.jpg"
                  src=""
                  alt="Md. Riazul Islam"
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                  priority
                />
              </MotionDiv>
              {/* Decorative elements */}
              <MotionDiv
                className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <MotionDiv
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/60 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </div>
          </MotionDiv>

          {/* Content */}
          <MotionDiv
            variants={itemVariants}
            className="order-2 lg:order-2 text-center lg:text-left space-y-6"
          >
            {/* Name */}
            <MotionH2
              variants={itemVariants}
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground"
            >
              Md. Riazul Islam
            </MotionH2>

            {/* Animated Role Text */}
            <MotionDiv variants={itemVariants} className="relative">
              <MotionH1 className="text-xl lg:text-2xl xl:text-3xl font-normal">
                <span className="text-primary mr-2">—</span>
                <RotatingText />
              </MotionH1>
            </MotionDiv>

            {/* Description */}
            <MotionP
              variants={itemVariants}
              className="text-muted-foreground text-lg lg:text-xl leading-relaxed max-w-2xl"
            >
              I design and develop services for customers of all sizes,
              specializing in creating stylish, modern websites, web services
              and online stores.
            </MotionP>

            {/* Technology Icons */}
            <MotionDiv
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-3 py-6"
            >
              {techIcons.map((tech, index) => (
                <MotionDiv
                  key={tech.title}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 },
                  }}
                  className="relative group"
                >
                  <img
                    src={tech.src}
                    alt={tech.title}
                    title={tech.title}
                    className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                  />
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {tech.title}
                  </div>
                </MotionDiv>
              ))}
            </MotionDiv>

            {/* Download CV Button */}
            <MotionDiv variants={itemVariants} className="pt-4">
              <Button
                size="lg"
                className="bg-transparent border-2 border-border hover:border-primary hover:bg-primary text-foreground hover:text-primary-foreground transition-all duration-300 px-8 py-3 text-lg font-medium"
                asChild
              >
                <a href="#" className="inline-flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download CV
                </a>
              </Button>
            </MotionDiv>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
