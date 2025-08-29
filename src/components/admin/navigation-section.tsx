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

// Icon Preview Component
const IconPreview = ({ iconValue }: { iconValue: string }) => {
  if (!iconValue) {
    return <span className="text-xs text-muted-foreground">No Icon</span>;
  }

  // Check if this icon might need a background for dark mode visibility
  const needsBackground =
    iconValue.includes("github") ||
    iconValue.includes("monochrome") ||
    iconValue.includes("material-outlined");

  return (
    <img
      src={iconValue}
      alt="Icon preview"
      className={
        needsBackground
          ? "w-5 h-5 object-contain bg-white dark:bg-white rounded-full"
          : "w-5 h-5 object-contain"
      }
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
        const nextElement = target.nextElementSibling as HTMLElement;
        if (nextElement) {
          nextElement.classList.remove("hidden");
        }
      }}
    />
  );
};

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
    navigationForm.reset({
      socialLinks: navigationData.socialLinks || [],
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
        <div className="text-sm text-muted-foreground space-y-2">
          <p>Add social media links with icons using external image URLs.</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Icons8:</strong> Get high-quality icons from{" "}
              <a
                href="https://icons8.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Icons8
              </a>
            </li>
            <li>
              <strong>Simple Icons:</strong> Use{" "}
              <a
                href="https://simpleicons.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Simple Icons
              </a>{" "}
              CDN:{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/[iconname].svg
              </code>
            </li>
            <li>
              <strong>Any URL:</strong> You can use any image URL that points to
              an icon
            </li>
            <li>
              <strong>Dark Mode Note:</strong> GitHub and other monochrome icons
              automatically get a white background in dark mode for better
              visibility
            </li>
          </ul>
        </div>
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
                      icon: "",
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
                          <FormItem className="col-span-4">
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
                      <div className="col-span-2">
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
                          <FormItem className="col-span-6">
                            <FormLabel>Icon Image URL</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <Input
                                  {...iconField}
                                  placeholder="https://img.icons8.com/fluency/48/facebook-new.png"
                                />
                                <p className="text-xs text-muted-foreground">
                                  Enter a complete image URL for the icon
                                  (Icons8, Simple Icons CDN, etc.)
                                </p>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Icon Preview */}
                      <div className="col-span-2">
                        <FormLabel>Preview</FormLabel>
                        <div className="flex items-center justify-center h-10 w-10 border rounded bg-muted/50">
                          <IconPreview
                            iconValue={navigationForm.watch(
                              `socialLinks.${index}.icon`
                            )}
                          />
                          <span className="hidden text-xs text-red-500">
                            Error
                          </span>
                        </div>
                      </div>

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
