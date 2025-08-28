#!/usr/bin/env node

/**
 * Hero data initialization script
 */

import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "../.env") });

import { mongoDBConnection } from "../src/databases/db-connection.js";
import mongoose from "mongoose";

// Hero schema definition (copied for standalone script)
const TechIconSchema = new mongoose.Schema({
  id: { type: String, required: true },
  src: { type: String, required: true },
  title: { type: String, required: true },
});

const RotatingTextSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
});

const HeroSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rotatingTexts: [RotatingTextSchema],
    description: { type: String, required: true },
    profileImage: { type: String, required: true },
    cvDownloadUrl: { type: String, required: true },
    techIcons: [TechIconSchema],
  },
  {
    timestamps: true,
  }
);

const Hero = mongoose.models.Hero || mongoose.model("Hero", HeroSchema);

// Default hero data (copied from types)
const defaultHeroData = {
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

async function initializeHeroData() {
  try {
    console.log("Connecting to database...");
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    await mongoDBConnection();

    // Check if hero data already exists
    const existingHero = await Hero.findOne();

    if (existingHero) {
      console.log("Hero data already exists. Skipping initialization.");
      return;
    }

    console.log("Creating initial hero data...");

    const heroData = new Hero({
      id: "hero-1",
      ...defaultHeroData,
    });

    await heroData.save();
    console.log("Hero data initialized successfully!");
  } catch (error) {
    console.error("Error initializing hero data:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

initializeHeroData();
