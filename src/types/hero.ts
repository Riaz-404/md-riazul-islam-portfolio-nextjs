// Tech icon type
export interface TechIcon {
  id: string;
  src: string;
  title: string;
}

// Rotating text type
export interface RotatingText {
  id: string;
  text: string;
}

// Hero data type
export interface HeroData {
  id: string;
  name: string;
  rotatingTexts: RotatingText[];
  description: string;
  profileImage?: string;
  cvDownloadUrl: string;
  techIcons: TechIcon[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Default hero data
export const defaultHeroData: Omit<HeroData, "id" | "createdAt" | "updatedAt"> =
  {
    name: "Md. Riazul Islam",
    rotatingTexts: [
      { id: "1", text: "Programmer" },
      { id: "2", text: "Problem Solver" },
      { id: "3", text: "Full Stack Web Developer" },
      { id: "4", text: "MERN Stack Web Developer" },
      { id: "5", text: "Photography Lover" },
    ],
    description:
      "I design and develop services for customers of all sizes, specializing in creating stylish, modern websites, web services and online stores.",
    profileImage: "/images/home/IMG_20211125_201810.jpg",
    cvDownloadUrl: "#",
    techIcons: [
      {
        id: "1",
        src: "https://img.icons8.com/color/48/000000/c-plus-plus-logo.png",
        title: "C++",
      },
      {
        id: "2",
        src: "https://img.icons8.com/color/48/000000/python--v1.png",
        title: "Python",
      },
      {
        id: "3",
        src: "https://img.icons8.com/color/48/000000/javascript--v1.png",
        title: "JavaScript",
      },
      {
        id: "4",
        src: "/images/home/react.svg",
        title: "React",
      },
      {
        id: "5",
        src: "https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/48/000000/external-mongodb-a-cross-platform-document-oriented-database-program-logo-shadow-tal-revivo.png",
        title: "MongoDB",
      },
      {
        id: "6",
        src: "https://img.icons8.com/fluency/48/000000/node-js.png",
        title: "NodeJS",
      },
      {
        id: "7",
        src: "https://img.icons8.com/color/48/000000/html-5--v1.png",
        title: "HTML5",
      },
      {
        id: "8",
        src: "https://img.icons8.com/color/48/000000/css3.png",
        title: "CSS3",
      },
      {
        id: "9",
        src: "https://img.icons8.com/color/48/000000/sass.png",
        title: "SCSS",
      },
      {
        id: "10",
        src: "https://img.icons8.com/color/48/000000/bootstrap.png",
        title: "Bootstrap",
      },
      {
        id: "11",
        src: "https://img.icons8.com/color/48/000000/material-ui.png",
        title: "Material-UI",
      },
      {
        id: "12",
        src: "https://img.icons8.com/color/48/000000/firebase.png",
        title: "Firebase",
      },
      {
        id: "13",
        src: "https://img.icons8.com/color/48/000000/mysql-logo.png",
        title: "MySQL",
      },
    ],
  };
