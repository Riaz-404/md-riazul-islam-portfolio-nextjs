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
import { ImageUpload } from "@/components/ui/image-upload";
import { HeroData } from "@/types/hero";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { heroSchema, HeroFormData } from "./schemas";

interface HeroSectionProps {
  heroData: HeroData;
  onHeroDataChange: (data: HeroData) => void;
  isSaving: boolean;
}

export function HeroSection({
  heroData,
  onHeroDataChange,
  isSaving,
}: HeroSectionProps) {
  // Hero form
  const heroForm = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: heroData.name,
      rotatingTexts: heroData.rotatingTexts,
      description: heroData.description,
      profileImage: heroData.profileImage || "",
      cvDownloadUrl: heroData.cvDownloadUrl,
      techIcons: heroData.techIcons,
    },
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

  // Update form when heroData changes
  React.useEffect(() => {
    heroForm.reset({
      name: heroData.name,
      rotatingTexts: heroData.rotatingTexts,
      description: heroData.description,
      profileImage: heroData.profileImage || "",
      cvDownloadUrl: heroData.cvDownloadUrl,
      techIcons: heroData.techIcons,
    });
  }, [heroData, heroForm]);

  // Hero form submission
  const onSubmitHero = async (data: HeroFormData) => {
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
        onHeroDataChange(result);
        toast.success("Hero data saved successfully!");
      } else {
        toast.error("Failed to save hero data");
      }
    } catch (error) {
      console.error("Failed to save hero data:", error);
      toast.error("An error occurred while saving");
    }
  };

  // Drag and drop handlers
  const handleRotatingTextsReorder = (newItems: typeof rotatingTexts) => {
    heroForm.setValue("rotatingTexts", newItems);
  };

  const handleTechIconsReorder = (newItems: typeof techIcons) => {
    heroForm.setValue("techIcons", newItems);
  };

  return (
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
                  <ImageUpload
                    label="Profile Image"
                    value={field.value || ""}
                    onChange={field.onChange}
                    folder="hero"
                    description="This image will be used for favicon and social media sharing"
                    required
                  />
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
                    <Input {...field} placeholder="Enter CV download URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rotating Texts */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Rotating Texts (Drag to reorder)</Label>
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

              <DraggableList
                items={rotatingTexts}
                onReorder={handleRotatingTextsReorder}
                renderItem={(field, index) => (
                  <div className="flex gap-2">
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
                )}
              />
            </div>

            {/* Tech Icons */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Tech Icons (Drag to reorder)</Label>
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

              <DraggableList
                items={techIcons}
                onReorder={handleTechIconsReorder}
                renderItem={(field, index) => (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <FormField
                        control={heroForm.control}
                        name={`techIcons.${index}.title`}
                        render={({ field: titleField }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...titleField} placeholder="Icon title" />
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
                )}
              />
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
  );
}
