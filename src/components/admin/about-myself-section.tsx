"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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

interface AboutMyselfSectionProps {
  aboutData: AboutData;
  onAboutDataChange: (data: AboutData) => void;
  isSaving: boolean;
}

export function AboutMyselfSection({
  aboutData,
  onAboutDataChange,
  isSaving,
}: AboutMyselfSectionProps) {
  // About form
  const aboutForm = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      myself: aboutData.myself,
      skills: aboutData.skills,
    },
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

  return (
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
                      {aboutForm.watch("myself.description").length > 1 && (
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
                      content={aboutForm.watch(`myself.description.${index}`)}
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
                  const current = aboutForm.getValues("myself.description");
                  aboutForm.setValue("myself.description", [...current, ""]);
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
  );
}
