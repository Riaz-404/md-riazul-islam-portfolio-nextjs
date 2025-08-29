"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AboutData } from "@/types/about";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { aboutSchema, AboutFormData } from "./schemas";

interface SkillsSectionProps {
  aboutData: AboutData;
  onAboutDataChange: (data: AboutData) => void;
  isSaving: boolean;
}

export function SkillsSection({
  aboutData,
  onAboutDataChange,
  isSaving,
}: SkillsSectionProps) {
  // About form
  const aboutForm = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      myself: aboutData.myself,
      skills: aboutData.skills,
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

  // Update form when aboutData changes
  React.useEffect(() => {
    aboutForm.reset({
      myself: aboutData.myself,
      skills: aboutData.skills,
    });
  }, [aboutData, aboutForm]);

  // About form submission
  const onSubmitAbout = async (data: AboutFormData) => {
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
        onAboutDataChange(result.data);
        toast.success("About data saved successfully!");
      } else {
        toast.error("Failed to save about data");
      }
    } catch (error) {
      console.error("Failed to save about data:", error);
      toast.error("An error occurred while saving");
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

  return (
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
              <Card key={category.id} className="border-l-4 border-l-primary">
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
                        onClick={() => addSkillToCategory(categoryIndex)}
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
  );
}
