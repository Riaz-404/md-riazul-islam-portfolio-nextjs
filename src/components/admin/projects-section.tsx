"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Save, RefreshCw, Edit } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";
import { ProjectImageDisplay } from "@/components/ui/project-image";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ProjectLoading } from "@/components/ui/project-loading";
import { ProjectData, projectCategories, frameworks } from "@/types/project";
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
import { projectSchema, ProjectFormData } from "./schemas";

interface ProjectsSectionProps {
  projects: ProjectData[];
  onProjectsChange: () => void;
  isProjectsLoading: boolean;
  isSaving: boolean;
}

export function ProjectsSection({
  projects,
  onProjectsChange,
  isProjectsLoading,
  isSaving,
}: ProjectsSectionProps) {
  // Projects state
  const [editingProject, setEditingProject] =
    React.useState<ProjectData | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = React.useState(false);
  const [projectImages, setProjectImages] = React.useState({
    mainImage: [] as File[],
    fullPageImage: [] as File[],
    additionalImages: [] as File[],
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

  // Field arrays for project form - Explicitly cast the control type
  const featuresFieldArray = useFieldArray({
    control: projectForm.control as any,
    name: "features",
  });

  const tagsFieldArray = useFieldArray({
    control: projectForm.control as any,
    name: "tags",
  });

  const {
    fields: features,
    append: appendFeature,
    remove: removeFeature,
  } = featuresFieldArray;

  const { fields: tags, append: appendTag, remove: removeTag } = tagsFieldArray;

  // Project form submission
  const onSubmitProject = async (data: ProjectFormData) => {
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
      formData.append("featured", (data.featured ?? false).toString());
      formData.append("order", data.order.toString());

      if (data.liveUrl) formData.append("liveUrl", data.liveUrl);
      if (data.frontendCodeUrl)
        formData.append("frontendCodeUrl", data.frontendCodeUrl);
      if (data.backendCodeUrl)
        formData.append("backendCodeUrl", data.backendCodeUrl);

      // Add arrays as JSON
      formData.append("description", JSON.stringify(data.description));
      formData.append("features", JSON.stringify(data.features ?? []));
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
        onProjectsChange();
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
        onProjectsChange();
      } else {
        toast.error(`Failed to delete project: ${result.message}`);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("An error occurred while deleting project");
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

    // Scroll to project form section after state updates
    setTimeout(() => {
      const projectFormElement = document.getElementById(
        "project-form-section"
      );
      if (projectFormElement) {
        projectFormElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">Project Management</h2>
        <Button
          onClick={() => {
            resetProjectForm();
            setIsProjectFormOpen(true);
            // Scroll to project form section after state updates
            setTimeout(() => {
              const projectFormElement = document.getElementById(
                "project-form-section"
              );
              if (projectFormElement) {
                projectFormElement.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                  inline: "nearest",
                });
              }
            }, 100);
          }}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Add New Project</span>
          <span className="sm:hidden">Add Project</span>
        </Button>
      </div>

      {/* Projects List */}
      {isProjectsLoading ? (
        <ProjectLoading count={5} />
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project._id} className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <ProjectImageDisplay
                      image={project.mainImage}
                      alt={project.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg truncate">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {project.category} • {project.framework}
                    </p>
                    <p className="text-xs text-gray-500 truncate sm:block">
                      {project.shortDescription}
                    </p>
                    {project.featured && (
                      <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 sm:flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editProject(project)}
                    className="flex-1 sm:flex-none"
                  >
                    <Edit className="h-4 w-4 sm:mr-0" />
                    <span className="ml-2 sm:hidden">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteProject(project._id!)}
                    className="flex-1 sm:flex-none"
                  >
                    <Trash2 className="h-4 w-4 sm:mr-0" />
                    <span className="ml-2 sm:hidden">Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {!isProjectsLoading && projects.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                No projects found. Click &quot;Add New Project&quot; to create
                your first project.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Project Form Modal/Sheet */}
      {isProjectFormOpen && (
        <Card className="mt-6" id="project-form-section">
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
                          <Input {...field} placeholder="e.g., Auto Car Shop" />
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
                              <SelectItem key={framework} value={framework}>
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

                  <FormField
                    control={projectForm.control}
                    name="createdDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Created Date *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            value={field.value.toISOString().split("T")[0]}
                            onChange={(e) =>
                              field.onChange(new Date(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={projectForm.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Order</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                            placeholder="0"
                          />
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

                {/* Description */}
                <FormField
                  control={projectForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Description *</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Features</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendFeature("")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Feature
                    </Button>
                  </div>
                  {features.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={projectForm.control}
                        name={`features.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., User authentication"
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
                        onClick={() => removeFeature(index)}
                        disabled={features.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Tags *</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendTag("")}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tag
                    </Button>
                  </div>
                  {tags.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={projectForm.control}
                        name={`tags.${index}`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} placeholder="e.g., React" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTag(index)}
                        disabled={tags.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

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

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <FormLabel>Main Image</FormLabel>
                    <FileUpload
                      label="Choose main image"
                      value={projectImages.mainImage}
                      onChange={(files) =>
                        setProjectImages((prev) => ({
                          ...prev,
                          mainImage: files,
                        }))
                      }
                      accept="image/*"
                    />
                  </div>

                  <div>
                    <FormLabel>Full Page Image</FormLabel>
                    <FileUpload
                      label="Choose full page image"
                      value={projectImages.fullPageImage}
                      onChange={(files) =>
                        setProjectImages((prev) => ({
                          ...prev,
                          fullPageImage: files,
                        }))
                      }
                      accept="image/*"
                    />
                  </div>

                  <div>
                    <FormLabel>Additional Images</FormLabel>
                    <FileUpload
                      label="Choose additional images"
                      value={projectImages.additionalImages}
                      onChange={(files) =>
                        setProjectImages((prev) => ({
                          ...prev,
                          additionalImages: files,
                        }))
                      }
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {editingProject ? "Update Project" : "Create Project"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
