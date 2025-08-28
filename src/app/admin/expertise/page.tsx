"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, RefreshCw, ArrowLeft } from "lucide-react";
import { ExpertiseData } from "@/types/expertise";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

type ExpertiseFormData = z.infer<typeof expertiseSchema>;

export default function ExpertiseAdmin() {
  const [expertiseData, setExpertiseData] =
    React.useState<ExpertiseData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const form = useForm<ExpertiseFormData>({
    resolver: zodResolver(expertiseSchema),
    defaultValues: {
      title: "Expertise",
      subtitle: "Skills Set",
      categories: [],
    },
  });

  const {
    fields: categories,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control: form.control,
    name: "categories",
  });

  // Fetch data on component mount
  React.useEffect(() => {
    fetchExpertiseData();
  }, []);

  const fetchExpertiseData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/expertise");
      if (response.ok) {
        const data = await response.json();
        setExpertiseData(data);
        form.reset({
          title: data.title,
          subtitle: data.subtitle,
          categories: data.categories,
        });
      }
    } catch (error) {
      console.error("Failed to fetch expertise data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ExpertiseFormData) => {
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

  const addSkillToCategory = (categoryIndex: number) => {
    const currentSkills =
      form.getValues(`categories.${categoryIndex}.skills`) || [];
    const newSkill = {
      id: `skill-${Date.now()}`,
      name: "",
      percentage: 0,
      category: form.getValues(`categories.${categoryIndex}.id`),
    };
    form.setValue(`categories.${categoryIndex}.skills`, [
      ...currentSkills,
      newSkill,
    ]);
  };

  const removeSkillFromCategory = (
    categoryIndex: number,
    skillIndex: number
  ) => {
    const currentSkills = form.getValues(`categories.${categoryIndex}.skills`);
    const newSkills = currentSkills.filter(
      (_: any, index: number) => index !== skillIndex
    );
    form.setValue(`categories.${categoryIndex}.skills`, newSkills);
  };

  const addNewCategory = () => {
    const newCategory = {
      id: `category-${Date.now()}`,
      name: "",
      skills: [],
    };
    appendCategory(newCategory);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading expertise data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Expertise Management</h1>
        <p className="text-muted-foreground">
          Manage your skills and expertise levels
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Section Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skill Categories</CardTitle>
                <Button type="button" onClick={addNewCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((category, categoryIndex) => (
                <Card key={category.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <FormField
                          control={form.control}
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

                      {form
                        .watch(`categories.${categoryIndex}.skills`)
                        ?.map((skill: any, skillIndex: number) => (
                          <div
                            key={skillIndex}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
                          >
                            <FormField
                              control={form.control}
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
                              control={form.control}
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
                                  removeSkillFromCategory(
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
                  Save Changes
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={fetchExpertiseData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
