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
import { NavigationData } from "@/types/navigation";
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
import { navigationSchema, NavigationFormData } from "./schemas";

interface NavigationSectionProps {
  navigationData: NavigationData;
  onNavigationDataChange: (data: NavigationData) => void;
  isSaving: boolean;
}

export function NavigationSection({
  navigationData,
  onNavigationDataChange,
  isSaving,
}: NavigationSectionProps) {
  // Navigation form
  const navigationForm = useForm<NavigationFormData>({
    resolver: zodResolver(navigationSchema),
    defaultValues: {
      socialLinks: navigationData.socialLinks,
    },
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

  // Update form when navigationData changes
  React.useEffect(() => {
    const socialLinksWithIconType =
      navigationData.socialLinks?.map((link: any) => ({
        ...link,
        iconType: link.iconType || "lucide",
      })) || [];

    navigationForm.reset({
      socialLinks: socialLinksWithIconType,
    });
  }, [navigationData, navigationForm]);

  // Navigation form submission
  const onSubmitNavigation = async (data: NavigationFormData) => {
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
        onNavigationDataChange(result);
        toast.success("Navigation data saved successfully!");
      } else {
        toast.error("Failed to save navigation data");
      }
    } catch (error) {
      console.error("Failed to save navigation data:", error);
      toast.error("An error occurred while saving");
    }
  };

  const handleSocialLinksReorder = (newItems: typeof socialLinks) => {
    navigationForm.setValue("socialLinks", newItems);
  };

  return (
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
                <Label>Social Links (Drag to reorder)</Label>
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

              <DraggableList
                items={socialLinks}
                onReorder={handleSocialLinksReorder}
                renderItem={(field, index) => (
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <FormField
                        control={navigationForm.control}
                        name={`socialLinks.${index}.label`}
                        render={({ field: labelField }) => (
                          <FormItem className="col-span-3">
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                              <Input {...labelField} placeholder="Facebook" />
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
                  Save Navigation
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
