#!/usr/bin/env node

import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../.env") });

const uri = process.env.DATABASE_URL;

if (!uri) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}

// Project Schema
const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    features: [{ type: String, required: true }],
    shortDescription: { type: String, required: true, maxlength: 200 },
    category: { type: String, required: true },
    framework: { type: String, required: true },
    duration: { type: String, required: true },
    createdDate: { type: Date, required: true },
    responsive: { type: Boolean, default: true },
    browserCompatible: { type: Boolean, default: true },
    documentation: { type: Boolean, default: true },
    tags: [{ type: String }],
    liveUrl: { type: String },
    frontendCodeUrl: { type: String },
    backendCodeUrl: { type: String },
    mainImage: {
      filename: { type: String, required: true },
      contentType: { type: String, required: true },
      data: { type: Buffer, required: true },
    },
    fullPageImage: {
      filename: { type: String },
      contentType: { type: String },
      data: { type: Buffer },
    },
    additionalImages: [
      {
        filename: { type: String },
        contentType: { type: String },
        data: { type: Buffer },
      },
    ],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", ProjectSchema);

// Create a dummy image for projects (1x1 transparent pixel)
const createDummyImage = (filename) => ({
  filename,
  contentType: "image/png",
  data: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "base64"
  ),
});

const projects = [
  {
    title: "Auto Car Shop",
    slug: "auto-car-shop",
    description: `
      <h4><i class="ti-desktop mr-3"></i>Description</h4>
      <ul>
        <li>For front-end development, React is used as library</li>
        <li>Tailwind CSS, Material UI is used as CSS framework</li>
        <li>React Router is used for routing</li>
        <li>Firebase is used for Authentication and Web Hosting</li>
        <li>MongoDB is used as Backend Data Server</li>
        <li>Express JS is used as back end web application framework</li>
        <li>Heroku is used as Backend Server</li>
      </ul>
    `,
    features: [
      "Modern UI",
      "Responsive Design",
      "Product overview in Home page",
      "User rating carousel",
      "Contact and support section",
      "Easy Signup and Login process",
      "Third party authentication like Google, Facebook, Github",
      "Recover forget password",
      "User Dashboard",
      "Check order items and status",
      "Remove ordered items",
      "Reviews and ratings system",
      "Admin secured dashboard",
      "Admin can manage all orders and products",
      "Admin can make other admin",
      "Admin can edit and delete products",
    ],
    shortDescription:
      "A full-stack e-commerce platform for auto car shop with user authentication, admin dashboard, and complete order management system.",
    category: "E-commerce",
    framework: "React",
    duration: "2 weeks",
    createdDate: new Date("2022-04-02"),
    responsive: true,
    browserCompatible: true,
    documentation: true,
    tags: [
      "React",
      "Tailwind",
      "JavaScript",
      "Firebase",
      "Node JS",
      "Express",
      "MongoDB",
      "Material UI",
      "HTML 5",
      "CSS 3",
      "Development",
      "UX",
    ],
    liveUrl: "https://auto-car-shop-aaf9d.web.app/",
    frontendCodeUrl: "https://github.com/Riaz-404/auto-car-shop-client",
    backendCodeUrl: "https://github.com/Riaz-404/auto-car-shop-server",
    mainImage: createDummyImage("auto-car-shop.png"),
    fullPageImage: createDummyImage("auto-car-shop-full-page.png"),
    featured: true,
    order: 1,
  },
  {
    title: "Fantasy Premier League",
    slug: "fantasy-premier-league",
    description: `
      <h4><i class="ti-desktop mr-3"></i>Description</h4>
      <ul>
        <li>React is used for front-end development</li>
        <li>Bootstrap and CSS3 used for styling</li>
        <li>REST API integration for live data</li>
        <li>Responsive design for all devices</li>
        <li>Interactive user interface</li>
        <li>Real-time player statistics</li>
      </ul>
    `,
    features: [
      "Player selection interface",
      "Real-time statistics",
      "Team formation builder",
      "Budget management system",
      "Player comparison tools",
      "Responsive design",
      "Interactive UI/UX",
      "Live score updates",
    ],
    shortDescription:
      "A fantasy football application for Premier League with player selection, team building, and live statistics integration.",
    category: "Sports App",
    framework: "React",
    duration: "1 week",
    createdDate: new Date("2022-03-15"),
    responsive: true,
    browserCompatible: true,
    documentation: true,
    tags: [
      "React",
      "Bootstrap",
      "JavaScript",
      "REST API",
      "HTML5",
      "CSS3",
      "Sports",
      "Fantasy",
    ],
    liveUrl: "https://fpl-riaz.netlify.app/",
    frontendCodeUrl: "https://github.com/Riaz-404/fantasy-premier-league",
    mainImage: createDummyImage("fpl.png"),
    fullPageImage: createDummyImage("fpl-full-page.png"),
    featured: true,
    order: 2,
  },
  {
    title: "Hungry Monster",
    slug: "hungry-monster",
    description: `
      <h4><i class="ti-desktop mr-3"></i>Description</h4>
      <ul>
        <li>React.js used for component-based architecture</li>
        <li>External API integration for meal data</li>
        <li>Search functionality implementation</li>
        <li>Responsive design with CSS3</li>
        <li>Modern UI with smooth animations</li>
        <li>Interactive meal browsing experience</li>
      </ul>
    `,
    features: [
      "Search meals by name",
      "Browse meal categories",
      "Detailed meal information",
      "Recipe instructions",
      "Ingredient lists",
      "Responsive design",
      "Modern UI interface",
      "API data integration",
    ],
    shortDescription:
      "A food discovery application that allows users to search and explore various meals with detailed recipes and ingredients.",
    category: "Food App",
    framework: "React",
    duration: "1 week",
    createdDate: new Date("2022-02-20"),
    responsive: true,
    browserCompatible: true,
    documentation: true,
    tags: ["React", "JavaScript", "API", "HTML5", "CSS3", "Food", "Recipe"],
    liveUrl: "https://hungry-monster-riaz.netlify.app/",
    frontendCodeUrl: "https://github.com/Riaz-404/hungry-monster",
    mainImage: createDummyImage("hungry-monster.png"),
    fullPageImage: createDummyImage("hungry-monster-full-page.png"),
    featured: true,
    order: 3,
  },
  {
    title: "Team Tracker",
    slug: "team-tracker",
    description: `
      <h4><i class="ti-desktop mr-3"></i>Description</h4>
      <ul>
        <li>React.js for dynamic user interface</li>
        <li>Component-based architecture</li>
        <li>State management for team data</li>
        <li>Local storage for data persistence</li>
        <li>Responsive design implementation</li>
        <li>Modern CSS styling</li>
      </ul>
    `,
    features: [
      "Add team members",
      "Track member information",
      "Salary management",
      "Team statistics",
      "Member search functionality",
      "Responsive interface",
      "Data persistence",
      "Budget calculation",
    ],
    shortDescription:
      "A team management application for tracking team members, their roles, and salary information with budget calculations.",
    category: "Management App",
    framework: "React",
    duration: "3 days",
    createdDate: new Date("2022-01-10"),
    responsive: true,
    browserCompatible: true,
    documentation: true,
    tags: ["React", "JavaScript", "Team Management", "HTML5", "CSS3"],
    liveUrl: "https://team-tracker-riaz.netlify.app/",
    frontendCodeUrl: "https://github.com/Riaz-404/team-tracker",
    mainImage: createDummyImage("team-tracker.png"),
    featured: false,
    order: 4,
  },
  {
    title: "Penguin Fashion",
    slug: "penguin-fashion",
    description: `
      <h4><i class="ti-desktop mr-3"></i>Description</h4>
      <ul>
        <li>HTML5 for semantic structure</li>
        <li>Bootstrap 5 for responsive layout</li>
        <li>Custom CSS for unique styling</li>
        <li>Mobile-first approach</li>
        <li>Modern web design principles</li>
        <li>Cross-browser compatibility</li>
      </ul>
    `,
    features: [
      "Responsive design",
      "Product showcase",
      "Modern layout",
      "Bootstrap components",
      "Custom styling",
      "Mobile optimization",
      "Clean UI design",
      "Fashion catalog",
    ],
    shortDescription:
      "A responsive fashion e-commerce website showcasing penguin-themed clothing with modern design and mobile optimization.",
    category: "Fashion Website",
    framework: "Bootstrap",
    duration: "2 days",
    createdDate: new Date("2021-12-15"),
    responsive: true,
    browserCompatible: true,
    documentation: true,
    tags: ["HTML5", "CSS3", "Bootstrap", "Fashion", "Responsive Design"],
    liveUrl: "https://penguin-fashion-riaz.netlify.app/",
    frontendCodeUrl: "https://github.com/Riaz-404/penguin-fashion",
    mainImage: createDummyImage("panguin-fashion.png"),
    fullPageImage: createDummyImage("panguin-fashion-full-page.png"),
    featured: false,
    order: 5,
  },
  {
    title: "Banking System",
    slug: "banking-system",
    description: `
      <h4><i class="ti-desktop mr-3"></i>Description</h4>
      <ul>
        <li>Vanilla JavaScript for functionality</li>
        <li>DOM manipulation for dynamic content</li>
        <li>Local storage for data persistence</li>
        <li>Form validation and error handling</li>
        <li>Responsive CSS design</li>
        <li>Modern banking interface</li>
      </ul>
    `,
    features: [
      "Account balance tracking",
      "Deposit functionality",
      "Withdrawal system",
      "Transaction history",
      "Input validation",
      "Responsive design",
      "Modern UI",
      "Error handling",
    ],
    shortDescription:
      "A simple banking system simulation with deposit, withdrawal, and balance tracking features built with vanilla JavaScript.",
    category: "Financial App",
    framework: "Vanilla JS",
    duration: "2 days",
    createdDate: new Date("2021-11-20"),
    responsive: true,
    browserCompatible: true,
    documentation: true,
    tags: ["JavaScript", "HTML5", "CSS3", "Banking", "Finance", "DOM"],
    liveUrl: "https://banking-system-riaz.netlify.app/",
    frontendCodeUrl: "https://github.com/Riaz-404/banking-system",
    mainImage: createDummyImage("banking-system.png"),
    fullPageImage: createDummyImage("banking-system-full-page.png"),
    featured: false,
    order: 6,
  },
];

async function addProjects() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Clear existing projects
    console.log("Clearing existing projects...");
    await Project.deleteMany({});

    // Insert new projects
    console.log("Inserting projects...");
    const result = await Project.insertMany(projects);

    console.log(`Successfully inserted ${result.length} projects`);

    // List inserted projects
    const insertedProjects = await Project.find({}).lean();
    console.log("\nInserted projects:");
    insertedProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.slug})`);
    });
  } catch (error) {
    console.error("Error adding projects:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

addProjects().catch(console.error);
