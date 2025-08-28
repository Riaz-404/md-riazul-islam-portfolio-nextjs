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
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { AboutData, defaultAboutData } from "@/types/about";
import { ExpertiseData } from "@/types/expertise";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

type AboutFormData = z.infer<typeof aboutSchema>;
type ExpertiseFormData = z.infer<typeof expertiseSchema>;

export default function AdminPanel() {
  const [aboutData, setAboutData] = React.useState<AboutData>(defaultAboutData);
  const [expertiseData, setExpertiseData] =
    React.useState<ExpertiseData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("myself");

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

  // Fetch data on component mount
  React.useEffect(() => {
    fetchAboutData();
    fetchExpertiseData();
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
        alert("About data saved successfully!");
      } else {
        alert("Failed to save about data");
      }
    } catch (error) {
      console.error("Failed to save about data:", error);
      alert("An error occurred while saving");
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
        alert("Expertise data saved successfully!");
      } else {
        alert("Failed to save expertise data");
      }
    } catch (error) {
      console.error("Failed to save expertise data:", error);
      alert("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="myself">About Myself</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="expertise">Expertise</TabsTrigger>
          </TabsList>

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
        </Tabs>
      </div>
    </div>
  );
}
