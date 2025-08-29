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
import { DraggableList } from "@/components/ui/draggable-list";
import { ExpertiseData } from "@/types/expertise";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { expertiseSchema, ExpertiseFormData } from "./schemas";

interface ExpertiseSectionProps {
  expertiseData: ExpertiseData | null;
  onExpertiseDataChange: (data: ExpertiseData) => void;
  isSaving: boolean;
}

export function ExpertiseSection({
  expertiseData,
  onExpertiseDataChange,
  isSaving,
}: ExpertiseSectionProps) {
  // Expertise form
  const expertiseForm = useForm<ExpertiseFormData>({
    resolver: zodResolver(expertiseSchema),
    defaultValues: {
      title: expertiseData?.title || "Expertise",
      subtitle: expertiseData?.subtitle || "Skills Set",
      categories: expertiseData?.categories || [],
    },
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

  // Update form when expertiseData changes
  React.useEffect(() => {
    if (expertiseData) {
      expertiseForm.reset({
        title: expertiseData.title,
        subtitle: expertiseData.subtitle,
        categories: expertiseData.categories,
      });
    }
  }, [expertiseData, expertiseForm]);

  // Expertise form submission
  const onSubmitExpertise = async (data: ExpertiseFormData) => {
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
        onExpertiseDataChange(result);
        toast.success("Expertise data saved successfully!");
      } else {
        toast.error("Failed to save expertise data");
      }
    } catch (error) {
      console.error("Failed to save expertise data:", error);
      toast.error("An error occurred while saving");
    }
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

  const handleExpertiseSkillsReorder = (
    categoryIndex: number,
    newItems: any[]
  ) => {
    expertiseForm.setValue(`categories.${categoryIndex}.skills`, newItems);
  };

  return (
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
              <Card key={category.id} className="border-l-4 border-l-primary">
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
                      onClick={() => removeExpertiseCategory(categoryIndex)}
                      className="ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Skills (Drag to reorder)</Label>
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

                    <DraggableList
                      items={
                        expertiseForm
                          .watch(`categories.${categoryIndex}.skills`)
                          ?.map((skill: any, index: number) => ({
                            ...skill,
                            id: skill.id || `skill-${index}`,
                          })) || []
                      }
                      onReorder={(newItems) =>
                        handleExpertiseSkillsReorder(categoryIndex, newItems)
                      }
                      renderItem={(skill, skillIndex) => (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                          <FormField
                            control={expertiseForm.control}
                            name={`categories.${categoryIndex}.skills.${skillIndex}.name`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Skill Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., React" />
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
                      )}
                    />
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
  );
}
