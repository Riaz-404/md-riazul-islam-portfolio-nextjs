"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutData, defaultAboutData } from "@/types/about";
import { ExpertiseData } from "@/types/expertise";
import { HeroData, defaultHeroData } from "@/types/hero";
import { NavigationData, defaultNavigationData } from "@/types/navigation";
import { ProjectData } from "@/types/project";
import {
  HeroSection,
  NavigationSection,
  AboutMyselfSection,
  SkillsSection,
  ExpertiseSection,
  ProjectsSection,
} from "@/components/admin";

export default function AdminPanel() {
  const [aboutData, setAboutData] = React.useState<AboutData>(defaultAboutData);
  const [expertiseData, setExpertiseData] =
    React.useState<ExpertiseData | null>(null);
  const [heroData, setHeroData] = React.useState<HeroData>({
    id: "hero-1",
    ...defaultHeroData,
  });
  const [navigationData, setNavigationData] = React.useState<NavigationData>({
    id: "navigation-1",
    ...defaultNavigationData,
  });
  const [projects, setProjects] = React.useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("hero");

  // Fetch data on component mount
  React.useEffect(() => {
    fetchAboutData();
    fetchExpertiseData();
    fetchProjects();
    fetchHeroData();
    fetchNavigationData();
  }, []);

  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/about");
      const result = await response.json();

      if (result.success) {
        setAboutData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch about data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpertiseData = async () => {
    try {
      const response = await fetch("/api/expertise");
      if (response.ok) {
        const data = await response.json();
        setExpertiseData(data);
      }
    } catch (error) {
      console.error("Failed to fetch expertise data:", error);
    }
  };

  const fetchProjects = async () => {
    setIsProjectsLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setProjects(result.data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/hero");
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
      }
    } catch (error) {
      console.error("Failed to fetch hero data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNavigationData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/navigation");
      if (response.ok) {
        const data = await response.json();

        // Ensure iconType is set for backward compatibility
        const socialLinksWithIconType =
          data.socialLinks?.map((link: any) => ({
            ...link,
            iconType: link.iconType || "lucide",
          })) || [];

        const dataWithIconType = {
          ...data,
          socialLinks: socialLinksWithIconType,
        };

        setNavigationData(dataWithIconType);
      }
    } catch (error) {
      console.error("Failed to fetch navigation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Portfolio Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your portfolio content
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col"
        >
          <div className="mb-6">
            <TabsList className="w-full h-auto flex flex-wrap justify-center sm:justify-start gap-1 p-1">
              <TabsTrigger
                value="hero"
                className="text-xs sm:text-sm flex-shrink-0"
              >
                <span className="hidden sm:inline">Hero Section</span>
                <span className="sm:hidden">Hero</span>
              </TabsTrigger>
              <TabsTrigger
                value="navigation"
                className="text-xs sm:text-sm flex-shrink-0"
              >
                <span className="hidden sm:inline">Social Links</span>
                <span className="sm:hidden">Social</span>
              </TabsTrigger>
              <TabsTrigger
                value="myself"
                className="text-xs sm:text-sm flex-shrink-0"
              >
                <span className="hidden sm:inline">About Myself</span>
                <span className="sm:hidden">About</span>
              </TabsTrigger>
              <TabsTrigger
                value="skills"
                className="text-xs sm:text-sm flex-shrink-0"
              >
                Skills
              </TabsTrigger>
              <TabsTrigger
                value="expertise"
                className="text-xs sm:text-sm flex-shrink-0"
              >
                <span className="hidden sm:inline">Expertise</span>
                <span className="sm:hidden">Expert</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="text-xs sm:text-sm flex-shrink-0"
              >
                Projects
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-4">
            <HeroSection
              heroData={heroData}
              onHeroDataChange={setHeroData}
              isSaving={isSaving}
            />
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-4">
            <NavigationSection
              navigationData={navigationData}
              onNavigationDataChange={setNavigationData}
              isSaving={isSaving}
            />
          </TabsContent>

          {/* About Myself Tab */}
          <TabsContent value="myself" className="space-y-4">
            <AboutMyselfSection
              aboutData={aboutData}
              onAboutDataChange={setAboutData}
              isSaving={isSaving}
            />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <SkillsSection
              aboutData={aboutData}
              onAboutDataChange={setAboutData}
              isSaving={isSaving}
            />
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise" className="space-y-4">
            <ExpertiseSection
              expertiseData={expertiseData}
              onExpertiseDataChange={setExpertiseData}
              isSaving={isSaving}
            />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <ProjectsSection
              projects={projects}
              onProjectsChange={fetchProjects}
              isProjectsLoading={isProjectsLoading}
              isSaving={isSaving}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
