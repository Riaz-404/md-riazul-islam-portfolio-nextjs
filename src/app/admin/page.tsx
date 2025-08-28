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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

type AboutFormData = z.infer<typeof aboutSchema>;

export default function AdminPanel() {
  const [aboutData, setAboutData] = React.useState<AboutData>(defaultAboutData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      myself: aboutData.myself,
      skills: aboutData.skills,
    },
  });

  const {
    fields: skillCategories,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control: form.control,
    name: "skills.categories",
  });

  // Fetch data on component mount
  React.useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/about");
      const result = await response.json();

      if (result.success) {
        setAboutData(result.data);
        form.reset({
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

  const onSubmit = async (data: AboutFormData) => {
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
        alert("About data updated successfully!");
      } else {
        alert("Failed to update data: " + result.error);
      }
    } catch (error) {
      console.error("Failed to save about data:", error);
      alert("Failed to save data");
    } finally {
      setIsSaving(false);
    }
  };

  const addSkillCategory = () => {
    appendCategory({
      id: `category-${Date.now()}`,
      name: "",
      items: [],
    });
  };

  const addSkillItem = (categoryIndex: number) => {
    const currentItems =
      form.getValues(`skills.categories.${categoryIndex}.items`) || [];
    form.setValue(`skills.categories.${categoryIndex}.items`, [
      ...currentItems,
      {
        id: `skill-${Date.now()}`,
        name: "",
        description: "",
      },
    ]);
  };

  const removeSkillItem = (categoryIndex: number, itemIndex: number) => {
    const currentItems = form.getValues(
      `skills.categories.${categoryIndex}.items`
    );
    const newItems = currentItems.filter((_, index) => index !== itemIndex);
    form.setValue(`skills.categories.${categoryIndex}.items`, newItems);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading...
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="myself" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="myself">About Myself</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="myself" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About Myself Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
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
                      {form.watch("myself.description").map((_, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Paragraph {index + 1}</Label>
                            {form.watch("myself.description").length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const current =
                                    form.getValues("myself.description");
                                  form.setValue(
                                    "myself.description",
                                    current.filter((_, i) => i !== index)
                                  );
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <RichTextEditor
                            content={form.watch(`myself.description.${index}`)}
                            onChange={(content) =>
                              form.setValue(
                                `myself.description.${index}`,
                                content
                              )
                            }
                            placeholder="Enter description paragraph..."
                          />
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const current = form.getValues("myself.description");
                          form.setValue("myself.description", [...current, ""]);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Paragraph
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="skills.title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Skills" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <Label>Skill Categories</Label>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addSkillCategory}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </div>

                      {skillCategories.map((category, categoryIndex) => (
                        <Card key={category.id} className="border-dashed">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">
                                Category {categoryIndex + 1}
                              </CardTitle>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeCategory(categoryIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <FormField
                              control={form.control}
                              name={`skills.categories.${categoryIndex}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="e.g., Technical Skills"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <Label>Skills</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addSkillItem(categoryIndex)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Skill
                                </Button>
                              </div>

                              {form
                                .watch(
                                  `skills.categories.${categoryIndex}.items`
                                )
                                ?.map((item, itemIndex) => (
                                  <div
                                    key={item.id}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 border rounded"
                                  >
                                    <FormField
                                      control={form.control}
                                      name={`skills.categories.${categoryIndex}.items.${itemIndex}.name`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Skill Name</FormLabel>
                                          <FormControl>
                                            <Input
                                              {...field}
                                              placeholder="e.g., Programming Language"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />

                                    <FormField
                                      control={form.control}
                                      name={`skills.categories.${categoryIndex}.items.${itemIndex}.description`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <div className="flex items-center justify-between">
                                            <FormLabel>Description</FormLabel>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                removeSkillItem(
                                                  categoryIndex,
                                                  itemIndex
                                                )
                                              }
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                          <FormControl>
                                            <Input
                                              {...field}
                                              placeholder="e.g., C++, Python, JavaScript"
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={fetchAboutData}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
