import { mongoDBConnection } from "../src/databases/db-connection.js";

const defaultNavigationData = {
  navigationLinks: [
    { id: "1", label: "Home", href: "#home", order: 1, isActive: true },
    { id: "2", label: "About", href: "#about", order: 2, isActive: true },
    {
      id: "3",
      label: "Expertise",
      href: "#expertise",
      order: 3,
      isActive: true,
    },
    { id: "4", label: "Projects", href: "#projects", order: 4, isActive: true },
    { id: "5", label: "Contact", href: "#contact", order: 5, isActive: true },
  ],
  socialLinks: [
    {
      id: "1",
      href: "https://www.facebook.com/imriaz.cu/",
      icon: "Facebook",
      label: "Facebook",
      order: 1,
      isActive: true,
    },
    {
      id: "2",
      href: "https://www.linkedin.com/in/md-riazul-islam-891b65194/",
      icon: "Linkedin",
      label: "LinkedIn",
      order: 2,
      isActive: true,
    },
    {
      id: "3",
      href: "https://github.com/Riaz-404",
      icon: "Github",
      label: "GitHub",
      order: 3,
      isActive: true,
    },
  ],
};

async function initNavigation() {
  try {
    console.log("Connecting to database...");
    await mongoDBConnection();

    // Import the Navigation model dynamically
    const Navigation = (await import("../src/models/Navigation.ts")).default;

    console.log("Checking if navigation data exists...");
    const existingNavigation = await Navigation.findOne();

    if (existingNavigation) {
      console.log("Navigation data already exists");
      return;
    }

    console.log("Creating default navigation data...");
    const navigation = new Navigation({
      id: `navigation-${Date.now()}`,
      ...defaultNavigationData,
    });

    await navigation.save();
    console.log("Navigation data created successfully");
  } catch (error) {
    console.error("Error initializing navigation:", error);
  } finally {
    process.exit(0);
  }
}

initNavigation();
