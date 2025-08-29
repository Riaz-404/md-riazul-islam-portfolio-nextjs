"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { FileUpload } from "@/components/ui/file-upload";
import { ProjectImageDisplay } from "@/components/ui/project-image";
import { Plus, Trash2, Save, RefreshCw, Edit, Eye } from "lucide-react";
import { toast } from "sonner";
import { AboutData, defaultAboutData } from "@/types/about";
import { ExpertiseData } from "@/types/expertise";
import { HeroData, defaultHeroData } from "@/types/hero";
import { NavigationData, defaultNavigationData } from "@/types/navigation";
import {
  ProjectData,
  ProjectFormData as ProjectFormDataType,
  defaultProjectData,
  projectCategories,
  frameworks,
} from "@/types/project";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// About schema
const aboutSchema = z.object({
  myself: z.object({
    title: z.string().min(1, "Title is required"),
    description: z
      .array(z.string())
      .min(1, "At least one description is required"),
  }),
  skills: z.object({
    title: z.string().min(1, "Title is required"),
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Category name is required"),
        items: z.array(
          z.object({
            id: z.string(),
            name: z.string().min(1, "Skill name is required"),
            description: z.string().min(1, "Description is required"),
          })
        ),
      })
    ),
  }),
});

// Expertise schema
const expertiseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  categories: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, "Category name is required"),
      skills: z.array(
        z.object({
          id: z.string(),
          name: z.string().min(1, "Skill name is required"),
          percentage: z.number().min(0).max(100),
          category: z.string(),
        })
      ),
    })
  ),
});

// Project schema
const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(z.string().min(1, "Feature is required")),
  shortDescription: z.string().min(1, "Short description is required").max(200),
  category: z.string().min(1, "Category is required"),
  framework: z.string().min(1, "Framework is required"),
  duration: z.string().min(1, "Duration is required"),
  createdDate: z.date(),
  responsive: z.boolean(),
  browserCompatible: z.boolean(),
  documentation: z.boolean(),
  tags: z.array(z.string().min(1, "Tag is required")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  frontendCodeUrl: z.string().url().optional().or(z.literal("")),
  backendCodeUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean(),
  order: z.number().min(0),
});

// Hero schema
const heroSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rotatingTexts: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, "Text is required"),
      })
    )
    .min(1, "At least one rotating text is required"),
  description: z.string().min(1, "Description is required"),
  profileImage: z.string().min(1, "Profile image is required"),
  cvDownloadUrl: z.string().min(1, "CV download URL is required"),
  techIcons: z.array(
    z.object({
      id: z.string(),
      src: z.string().min(1, "Icon source is required"),
      title: z.string().min(1, "Icon title is required"),
    })
  ),
});

// Navigation schema (only social links)
const navigationSchema = z.object({
  socialLinks: z.array(
    z.object({
      id: z.string(),
      href: z.string().url("Must be a valid URL"),
      icon: z.string().min(1, "Icon is required"),
      iconType: z.enum(["lucide", "image"]),
      label: z.string().min(1, "Label is required"),
      order: z.number().min(0, "Order must be non-negative"),
      isActive: z.boolean(),
    })
  ),
});

type AboutFormData = z.infer<typeof aboutSchema>;
type ExpertiseFormData = z.infer<typeof expertiseSchema>;
type ProjectFormData = z.infer<typeof projectSchema>;
type HeroFormData = z.infer<typeof heroSchema>;
type NavigationFormData = z.infer<typeof navigationSchema>;

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
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("hero");

  // Projects state
  const [projects, setProjects] = React.useState<ProjectData[]>([]);
  const [editingProject, setEditingProject] =
    React.useState<ProjectData | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = React.useState(false);
  const [projectImages, setProjectImages] = React.useState({
    mainImage: [] as File[],
    fullPageImage: [] as File[],
    additionalImages: [] as File[],
  });

  // About form
  const aboutForm = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      myself: aboutData.myself,
      skills: aboutData.skills,
    },
  });

  // Expertise form
  const expertiseForm = useForm<ExpertiseFormData>({
    resolver: zodResolver(expertiseSchema),
    defaultValues: {
      title: "Expertise",
      subtitle: "Skills Set",
      categories: [],
    },
  });

  // Project form
  const projectForm = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      features: [""],
      shortDescription: "",
      category: "",
      framework: "",
      duration: "",
      createdDate: new Date(),
      responsive: true,
      browserCompatible: true,
      documentation: true,
      tags: [""],
      liveUrl: "",
      frontendCodeUrl: "",
      backendCodeUrl: "",
      featured: false,
      order: 0,
    },
  });

  // Hero form
  const heroForm = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: heroData.name,
      rotatingTexts: heroData.rotatingTexts,
      description: heroData.description,
      profileImage: heroData.profileImage,
      cvDownloadUrl: heroData.cvDownloadUrl,
      techIcons: heroData.techIcons,
    },
  });

  // Navigation form
  const navigationForm = useForm<NavigationFormData>({
    resolver: zodResolver(navigationSchema),
    defaultValues: {
      socialLinks: navigationData.socialLinks,
    },
  });

  // About form arrays
  const {
    fields: skillCategories,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control: aboutForm.control,
    name: "skills.categories",
  });

  // Expertise form arrays
  const {
    fields: expertiseCategories,
    append: appendExpertiseCategory,
    remove: removeExpertiseCategory,
  } = useFieldArray({
    control: expertiseForm.control,
    name: "categories",
  });

  // Hero form arrays
  const {
    fields: rotatingTexts,
    append: appendRotatingText,
    remove: removeRotatingText,
  } = useFieldArray({
    control: heroForm.control,
    name: "rotatingTexts",
  });

  const {
    fields: techIcons,
    append: appendTechIcon,
    remove: removeTechIcon,
  } = useFieldArray({
    control: heroForm.control,
    name: "techIcons",
  });

  // Navigation form arrays (only social links)
  const {
    fields: socialLinks,
    append: appendSocialLink,
    remove: removeSocialLink,
  } = useFieldArray({
    control: navigationForm.control,
    name: "socialLinks",
  });

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
        aboutForm.reset({
          myself: result.data.myself,
          skills: result.data.skills,
        });
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
        expertiseForm.reset({
          title: data.title,
          subtitle: data.subtitle,
          categories: data.categories,
        });
      }
    } catch (error) {
      console.error("Failed to fetch expertise data:", error);
    }
  };

  const fetchProjects = async () => {
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
    }
  };

  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/hero");
      if (response.ok) {
        const data = await response.json();
        setHeroData(data);
        heroForm.reset({
          name: data.name,
          rotatingTexts: data.rotatingTexts,
          description: data.description,
          profileImage: data.profileImage,
          cvDownloadUrl: data.cvDownloadUrl,
          techIcons: data.techIcons,
        });
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
        navigationForm.reset({
          socialLinks: socialLinksWithIconType,
        });
      }
    } catch (error) {
      console.error("Failed to fetch navigation data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // About form submission
  const onSubmitAbout = async (data: AboutFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/about", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setAboutData(result.data);
        toast.success("About data saved successfully!");
      } else {
        toast.error("Failed to save about data");
      }
    } catch (error) {
      console.error("Failed to save about data:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Expertise form submission
  const onSubmitExpertise = async (data: ExpertiseFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/expertise", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setExpertiseData(result);
        toast.success("Expertise data saved successfully!");
      } else {
        toast.error("Failed to save expertise data");
      }
    } catch (error) {
      console.error("Failed to save expertise data:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Project form submission
  const onSubmitProject = async (data: ProjectFormData) => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      // Add text fields
      formData.append("title", data.title);
      formData.append("shortDescription", data.shortDescription);
      formData.append("category", data.category);
      formData.append("framework", data.framework);
      formData.append("duration", data.duration);
      formData.append("createdDate", data.createdDate.toISOString());
      formData.append("responsive", data.responsive.toString());
      formData.append("browserCompatible", data.browserCompatible.toString());
      formData.append("documentation", data.documentation.toString());
      formData.append("featured", data.featured.toString());
      formData.append("order", data.order.toString());

      if (data.liveUrl) formData.append("liveUrl", data.liveUrl);
      if (data.frontendCodeUrl)
        formData.append("frontendCodeUrl", data.frontendCodeUrl);
      if (data.backendCodeUrl)
        formData.append("backendCodeUrl", data.backendCodeUrl);

      // Add arrays as JSON
      formData.append("description", JSON.stringify(data.description));
      formData.append("features", JSON.stringify(data.features));
      formData.append("tags", JSON.stringify(data.tags));

      // Add images
      if (projectImages.mainImage[0]) {
        formData.append("mainImage", projectImages.mainImage[0]);
      }
      if (projectImages.fullPageImage[0]) {
        formData.append("fullPageImage", projectImages.fullPageImage[0]);
      }
      projectImages.additionalImages.forEach((file, index) => {
        formData.append(`additionalImage_${index}`, file);
      });

      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Project ${editingProject ? "updated" : "created"} successfully!`
        );
        fetchProjects();
        resetProjectForm();
        setIsProjectFormOpen(false);
      } else {
        toast.error(
          `Failed to ${editingProject ? "update" : "create"} project: ${
            result.message
          }`
        );
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("An error occurred while saving project");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Project deleted successfully!");
        fetchProjects();
      } else {
        toast.error(`Failed to delete project: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("An error occurred while deleting project");
    }
  };

  // Hero form submission
  const onSubmitHero = async (data: HeroFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setHeroData(result);
        toast.success("Hero data saved successfully!");
      } else {
        toast.error("Failed to save hero data");
      }
    } catch (error) {
      console.error("Failed to save hero data:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  // Navigation form submission
  const onSubmitNavigation = async (data: NavigationFormData) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/navigation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: navigationData.id,
          ...data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setNavigationData(result);
        toast.success("Navigation data saved successfully!");
      } else {
        toast.error("Failed to save navigation data");
      }
    } catch (error) {
      console.error("Failed to save navigation data:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const resetProjectForm = () => {
    projectForm.reset({
      title: "",
      description: "",
      features: [""],
      shortDescription: "",
      category: "",
      framework: "",
      duration: "",
      createdDate: new Date(),
      responsive: true,
      browserCompatible: true,
      documentation: true,
      tags: [""],
      liveUrl: "",
      frontendCodeUrl: "",
      backendCodeUrl: "",
      featured: false,
      order: 0,
    });
    setProjectImages({
      mainImage: [],
      fullPageImage: [],
      additionalImages: [],
    });
    setEditingProject(null);
  };

  const editProject = (project: ProjectData) => {
    setEditingProject(project);
    projectForm.reset({
      title: project.title,
      description: project.description,
      features: project.features,
      shortDescription: project.shortDescription,
      category: project.category,
      framework: project.framework,
      duration: project.duration,
      createdDate: new Date(project.createdDate),
      responsive: project.responsive,
      browserCompatible: project.browserCompatible,
      documentation: project.documentation,
      tags: project.tags,
      liveUrl: project.liveUrl || "",
      frontendCodeUrl: project.frontendCodeUrl || "",
      backendCodeUrl: project.backendCodeUrl || "",
      featured: project.featured,
      order: project.order,
    });
    setIsProjectFormOpen(true);
  };

  // Helper functions for about form
  const addSkillToCategory = (categoryIndex: number) => {
    const currentItems =
      aboutForm.getValues(`skills.categories.${categoryIndex}.items`) || [];
    aboutForm.setValue(`skills.categories.${categoryIndex}.items`, [
      ...currentItems,
      {
        id: `skill-${Date.now()}`,
        name: "",
        description: "",
      },
    ]);
  };

  const removeSkillFromCategory = (
    categoryIndex: number,
    itemIndex: number
  ) => {
    const currentItems = aboutForm.getValues(
      `skills.categories.${categoryIndex}.items`
    );
    const newItems = currentItems.filter(
      (_: any, index: number) => index !== itemIndex
    );
    aboutForm.setValue(`skills.categories.${categoryIndex}.items`, newItems);
  };

  // Helper functions for expertise form
  const addExpertiseSkillToCategory = (categoryIndex: number) => {
    const currentSkills =
      expertiseForm.getValues(`categories.${categoryIndex}.skills`) || [];
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: "",
      percentage: 0,
      category: expertiseForm.getValues(`categories.${categoryIndex}.id`),
    };
    expertiseForm.setValue(`categories.${categoryIndex}.skills`, [
      ...currentSkills,
      newSkill,
    ]);
  };

  const removeExpertiseSkillFromCategory = (
    categoryIndex: number,
    skillIndex: number
  ) => {
    const currentSkills = expertiseForm.getValues(
      `categories.${categoryIndex}.skills`
    );
    const newSkills = currentSkills.filter(
      (_: any, index: number) => index !== skillIndex
    );
    expertiseForm.setValue(`categories.${categoryIndex}.skills`, newSkills);
  };

  const addNewExpertiseCategory = () => {
    const newCategory = {
      id: `category-${Date.now()}`,
      name: "",
      skills: [],
    };
    appendExpertiseCategory(newCategory);
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
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Portfolio Admin Panel</h1>
          <p className="text-muted-foreground">Manage your portfolio content</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="hero">Hero Section</TabsTrigger>
            <TabsTrigger value="navigation">Social Links</TabsTrigger>
            <TabsTrigger value="myself">About Myself</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...heroForm}>
                  <form
                    onSubmit={heroForm.handleSubmit(onSubmitHero)}
                    className="space-y-6"
                  >
                    {/* Name */}
                    <FormField
                      control={heroForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter your name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={heroForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Enter description"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Profile Image */}
                    <FormField
                      control={heroForm.control}
                      name="profileImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Image URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter profile image URL"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* CV Download URL */}
                    <FormField
                      control={heroForm.control}
                      name="cvDownloadUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CV Download URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter CV download URL"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Rotating Texts */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Rotating Texts</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendRotatingText({
                              id: `text-${Date.now()}`,
                              text: "",
                            })
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Text
                        </Button>
                      </div>

                      {rotatingTexts.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <FormField
                            control={heroForm.control}
                            name={`rotatingTexts.${index}.text`}
                            render={({ field: textField }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    {...textField}
                                    placeholder="Enter rotating text"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeRotatingText(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Tech Icons */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Tech Icons</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendTechIcon({
                              id: `icon-${Date.now()}`,
                              src: "",
                              title: "",
                            })
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Icon
                        </Button>
                      </div>

                      {techIcons.map((field, index) => (
                        <div key={field.id} className="space-y-2">
                          <div className="flex gap-2">
                            <FormField
                              control={heroForm.control}
                              name={`techIcons.${index}.title`}
                              render={({ field: titleField }) => (
                                <FormItem className="flex-1">
                                  <FormControl>
                                    <Input
                                      {...titleField}
                                      placeholder="Icon title"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeTechIcon(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <FormField
                            control={heroForm.control}
                            name={`techIcons.${index}.src`}
                            render={({ field: srcField }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...srcField} placeholder="Icon URL" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Hero Data
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Navigation Tab */}
          <TabsContent value="navigation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Links Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...navigationForm}>
                  <form
                    onSubmit={navigationForm.handleSubmit(onSubmitNavigation)}
                    className="space-y-6"
                  >
                    {/* Social Links */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Social Links</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendSocialLink({
                              id: `social-${Date.now()}`,
                              href: "",
                              icon: "ExternalLink",
                              iconType: "lucide",
                              label: "",
                              order: socialLinks.length,
                              isActive: true,
                            })
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Social Link
                        </Button>
                      </div>

                      {socialLinks.map((field, index) => (
                        <div
                          key={field.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="grid grid-cols-12 gap-4 items-end">
                            <FormField
                              control={navigationForm.control}
                              name={`socialLinks.${index}.label`}
                              render={({ field: labelField }) => (
                                <FormItem className="col-span-3">
                                  <FormLabel>Label</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...labelField}
                                      placeholder="Facebook"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={navigationForm.control}
                              name={`socialLinks.${index}.href`}
                              render={({ field: hrefField }) => (
                                <FormItem className="col-span-4">
                                  <FormLabel>URL</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...hrefField}
                                      placeholder="https://facebook.com/..."
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={navigationForm.control}
                              name={`socialLinks.${index}.iconType`}
                              render={({ field: iconTypeField }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Icon Type</FormLabel>
                                  <FormControl>
                                    <Select
                                      value={iconTypeField.value}
                                      onValueChange={iconTypeField.onChange}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="lucide">
                                          Lucide Icon
                                        </SelectItem>
                                        <SelectItem value="image">
                                          External Image
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={navigationForm.control}
                              name={`socialLinks.${index}.order`}
                              render={({ field: orderField }) => (
                                <FormItem className="col-span-2">
                                  <FormLabel>Order</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...orderField}
                                      type="number"
                                      min="0"
                                      value={orderField.value}
                                      onChange={(e) =>
                                        orderField.onChange(
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      placeholder="0"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="col-span-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSocialLink(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-12 gap-4">
                            <FormField
                              control={navigationForm.control}
                              name={`socialLinks.${index}.icon`}
                              render={({ field: iconField }) => (
                                <FormItem className="col-span-4">
                                  <FormLabel>
                                    {navigationForm.watch(
                                      `socialLinks.${index}.iconType`
                                    ) === "image"
                                      ? "Image URL"
                                      : "Lucide Icon"}
                                  </FormLabel>
                                  <FormControl>
                                    {navigationForm.watch(
                                      `socialLinks.${index}.iconType`
                                    ) === "image" ? (
                                      <Input
                                        {...iconField}
                                        placeholder="https://example.com/icon.svg"
                                      />
                                    ) : (
                                      <Select
                                        value={iconField.value}
                                        onValueChange={iconField.onChange}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Facebook">
                                            Facebook
                                          </SelectItem>
                                          <SelectItem value="Linkedin">
                                            LinkedIn
                                          </SelectItem>
                                          <SelectItem value="Github">
                                            GitHub
                                          </SelectItem>
                                          <SelectItem value="Twitter">
                                            Twitter
                                          </SelectItem>
                                          <SelectItem value="Instagram">
                                            Instagram
                                          </SelectItem>
                                          <SelectItem value="Youtube">
                                            YouTube
                                          </SelectItem>
                                          <SelectItem value="ExternalLink">
                                            External Link
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    )}
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={navigationForm.control}
                              name={`socialLinks.${index}.isActive`}
                              render={({ field: activeField }) => (
                                <FormItem className="col-span-2 flex items-center space-x-2 pt-6">
                                  <FormLabel>Active</FormLabel>
                                  <FormControl>
                                    <input
                                      type="checkbox"
                                      checked={activeField.value}
                                      onChange={(e) =>
                                        activeField.onChange(e.target.checked)
                                      }
                                      className="h-4 w-4"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Navigation
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Myself Tab */}
          <TabsContent value="myself" className="space-y-4">
            <Form {...aboutForm}>
              <form
                onSubmit={aboutForm.handleSubmit(onSubmitAbout)}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>About Myself Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={aboutForm.control}
                      name="myself.title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Myself" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <Label>Description Paragraphs</Label>
                      {aboutForm
                        .watch("myself.description")
                        .map((_: string, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Paragraph {index + 1}</Label>
                              {aboutForm.watch("myself.description").length >
                                1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const current =
                                      aboutForm.getValues("myself.description");
                                    aboutForm.setValue(
                                      "myself.description",
                                      current.filter(
                                        (_: string, i: number) => i !== index
                                      )
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <RichTextEditor
                              content={aboutForm.watch(
                                `myself.description.${index}`
                              )}
                              onChange={(content) =>
                                aboutForm.setValue(
                                  `myself.description.${index}`,
                                  content
                                )
                              }
                            />
                          </div>
                        ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const current =
                            aboutForm.getValues("myself.description");
                          aboutForm.setValue("myself.description", [
                            ...current,
                            "",
                          ]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Paragraph
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save About
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-4">
            <Form {...aboutForm}>
              <form
                onSubmit={aboutForm.handleSubmit(onSubmitAbout)}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={aboutForm.control}
                      name="skills.title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., My Skills" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Skills Categories */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Skill Categories</CardTitle>
                      <Button
                        type="button"
                        onClick={() =>
                          appendCategory({
                            id: `category-${Date.now()}`,
                            name: "",
                            items: [],
                          })
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {skillCategories.map((category, categoryIndex) => (
                      <Card
                        key={category.id}
                        className="border-l-4 border-l-primary"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <FormField
                              control={aboutForm.control}
                              name={`skills.categories.${categoryIndex}.name`}
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Category Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="e.g., Frontend Development"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCategory(categoryIndex)}
                              className="ml-4"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>Skills</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  addSkillToCategory(categoryIndex)
                                }
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Skill
                              </Button>
                            </div>
                            {aboutForm
                              .watch(`skills.categories.${categoryIndex}.items`)
                              ?.map((item: any, itemIndex: number) => (
                                <div
                                  key={itemIndex}
                                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
                                >
                                  <FormField
                                    control={aboutForm.control}
                                    name={`skills.categories.${categoryIndex}.items.${itemIndex}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Skill Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="e.g., React.js"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={aboutForm.control}
                                    name={`skills.categories.${categoryIndex}.items.${itemIndex}.description`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="Brief description"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <div className="flex items-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeSkillFromCategory(
                                          categoryIndex,
                                          itemIndex
                                        )
                                      }
                                      className="w-full"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Skills
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Expertise Tab */}
          <TabsContent value="expertise" className="space-y-4">
            <Form {...expertiseForm}>
              <form
                onSubmit={expertiseForm.handleSubmit(onSubmitExpertise)}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Expertise Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={expertiseForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Expertise" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={expertiseForm.control}
                      name="subtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Subtitle</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Skills Set" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Expertise Categories */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Expertise Categories</CardTitle>
                      <Button type="button" onClick={addNewExpertiseCategory}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {expertiseCategories.map((category, categoryIndex) => (
                      <Card
                        key={category.id}
                        className="border-l-4 border-l-primary"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <FormField
                                control={expertiseForm.control}
                                name={`categories.${categoryIndex}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        placeholder="e.g., Programming Languages"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeExpertiseCategory(categoryIndex)
                              }
                              className="ml-4"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>Skills</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  addExpertiseSkillToCategory(categoryIndex)
                                }
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Skill
                              </Button>
                            </div>

                            {expertiseForm
                              .watch(`categories.${categoryIndex}.skills`)
                              ?.map((skill: any, skillIndex: number) => (
                                <div
                                  key={skillIndex}
                                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
                                >
                                  <FormField
                                    control={expertiseForm.control}
                                    name={`categories.${categoryIndex}.skills.${skillIndex}.name`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Skill Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="e.g., React"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <FormField
                                    control={expertiseForm.control}
                                    name={`categories.${categoryIndex}.skills.${skillIndex}.percentage`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Percentage (%)</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            type="number"
                                            min="0"
                                            max="100"
                                            onChange={(e) =>
                                              field.onChange(
                                                parseInt(e.target.value) || 0
                                              )
                                            }
                                            placeholder="85"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  <div className="flex items-end">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        removeExpertiseSkillFromCategory(
                                          categoryIndex,
                                          skillIndex
                                        )
                                      }
                                      className="w-full"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Expertise
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Project Management</h2>
              <Button
                onClick={() => {
                  resetProjectForm();
                  setIsProjectFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Project
              </Button>
            </div>

            {/* Projects List */}
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        <ProjectImageDisplay
                          image={project.mainImage}
                          alt={project.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {project.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {project.category} • {project.framework}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.shortDescription}
                        </p>
                        {project.featured && (
                          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteProject(project._id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {projects.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">
                    No projects found. Click "Add New Project" to create your
                    first project.
                  </p>
                </Card>
              )}
            </div>

            {/* Project Form Modal/Sheet */}
            {isProjectFormOpen && (
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      {editingProject ? "Edit Project" : "Add New Project"}
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsProjectFormOpen(false);
                        resetProjectForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Form {...projectForm}>
                    <form
                      onSubmit={projectForm.handleSubmit(onSubmitProject)}
                      className="space-y-6"
                    >
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={projectForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Title *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="e.g., Auto Car Shop"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {projectCategories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="framework"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Framework *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a framework" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {frameworks.map((framework) => (
                                    <SelectItem
                                      key={framework}
                                      value={framework}
                                    >
                                      {framework}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 2 weeks" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Short Description */}
                      <FormField
                        control={projectForm.control}
                        name="shortDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short Description *</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Brief description (max 200 characters)"
                                maxLength={200}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Project Settings */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <FormField
                          control={projectForm.control}
                          name="responsive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Responsive</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="browserCompatible"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Browser Compatible</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="documentation"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Documentation</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="featured"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Featured</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* URLs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={projectForm.control}
                          name="liveUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Live URL</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="https://example.com"
                                  type="url"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="frontendCodeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frontend Code URL</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="https://github.com/user/repo"
                                  type="url"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="backendCodeUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Backend Code URL</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="https://github.com/user/repo-server"
                                  type="url"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Order */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={projectForm.control}
                          name="order"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Order</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  min="0"
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={projectForm.control}
                          name="createdDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Created Date</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="date"
                                  value={
                                    field.value?.toISOString().split("T")[0] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    field.onChange(new Date(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Images */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Project Images
                        </h3>

                        <FileUpload
                          label="Main Image"
                          value={projectImages.mainImage}
                          onChange={(files) =>
                            setProjectImages((prev) => ({
                              ...prev,
                              mainImage: files,
                            }))
                          }
                          required={!editingProject}
                          description="Primary project image (required)"
                        />

                        <FileUpload
                          label="Full Page Screenshot"
                          value={projectImages.fullPageImage}
                          onChange={(files) =>
                            setProjectImages((prev) => ({
                              ...prev,
                              fullPageImage: files,
                            }))
                          }
                          description="Full page screenshot of the project (optional)"
                        />

                        <FileUpload
                          label="Additional Images"
                          value={projectImages.additionalImages}
                          onChange={(files) =>
                            setProjectImages((prev) => ({
                              ...prev,
                              additionalImages: files,
                            }))
                          }
                          multiple
                          description="Additional project images (optional)"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-4">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              {editingProject ? "Updating..." : "Creating..."}
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              {editingProject
                                ? "Update Project"
                                : "Create Project"}
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsProjectFormOpen(false);
                            resetProjectForm();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
