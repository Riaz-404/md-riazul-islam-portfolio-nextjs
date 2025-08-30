"use client";

import * as React from "react";
import { RefreshCw, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CacheSection {
  id: string;
  name: string;
  description: string;
  endpoint: string;
}

const cacheSections: CacheSection[] = [
  {
    id: "home-page",
    name: "Home Page",
    description: "Complete home page with all sections",
    endpoint: "/",
  },
  {
    id: "projects-page",
    name: "Projects Page",
    description: "Projects listing page",
    endpoint: "/projects",
  },
  {
    id: "hero",
    name: "Hero Section",
    description: "Personal information and profile data",
    endpoint: "/api/hero",
  },
  {
    id: "about",
    name: "About Section",
    description: "About myself and skills data",
    endpoint: "/api/about",
  },
  {
    id: "expertise",
    name: "Expertise Section",
    description: "Expertise and services data",
    endpoint: "/api/expertise",
  },
  {
    id: "navigation",
    name: "Navigation",
    description: "Navigation and social links data",
    endpoint: "/api/navigation",
  },
  {
    id: "projects",
    name: "Projects",
    description: "All projects data",
    endpoint: "/api/projects",
  },
  {
    id: "projects-featured",
    name: "Featured Projects",
    description: "Featured projects data",
    endpoint: "/api/projects/featured",
  },
];

export function AdminCacheSection() {
  const [loadingStates, setLoadingStates] = React.useState<
    Record<string, boolean>
  >({});
  const [lastRevalidated, setLastRevalidated] = React.useState<
    Record<string, Date>
  >({});

  const handleRevalidate = async (sectionId: string, endpoint: string) => {
    setLoadingStates((prev) => ({ ...prev, [sectionId]: true }));

    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "path",
          path: endpoint,
        }),
      });

      const result = await response.json();

      console.log("Revalidation result:", result);

      if (result.success) {
        setLastRevalidated((prev) => ({ ...prev, [sectionId]: new Date() }));
        const sectionName = cacheSections.find((s) => s.id === sectionId)?.name;
        toast.success(
          `Cache revalidated for ${sectionName}. Revalidated paths: ${
            Array.isArray(result.revalidated)
              ? result.revalidated.join(", ")
              : result.revalidated
          }`
        );
      } else {
        toast.error(result.error || "Failed to revalidate cache");
      }
    } catch (error) {
      console.error("Revalidation error:", error);
      toast.error("Failed to revalidate cache");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleRevalidateAll = async () => {
    setLoadingStates((prev) => ({ ...prev, all: true }));

    try {
      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "all" }),
      });

      const result = await response.json();

      if (result.success) {
        const now = new Date();
        const newRevalidated: Record<string, Date> = {};
        cacheSections.forEach((section) => {
          newRevalidated[section.id] = now;
        });
        setLastRevalidated(newRevalidated);
        toast.success("All caches revalidated successfully");
      } else {
        toast.error(result.error || "Failed to revalidate all caches");
      }
    } catch (error) {
      console.error("Revalidation error:", error);
      toast.error("Failed to revalidate all caches");
    } finally {
      setLoadingStates((prev) => ({ ...prev, all: false }));
    }
  };

  const formatLastRevalidated = (date: Date) => {
    return date.toLocaleTimeString() + " - " + date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Cache Management
          </h2>
          <p className="text-muted-foreground">
            Manage Next.js cache revalidation for all API endpoints
          </p>
        </div>
        <Button
          onClick={handleRevalidateAll}
          disabled={loadingStates.all}
          size="lg"
          className="bg-accent hover:bg-accent/90"
        >
          {loadingStates.all ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4 mr-2" />
          )}
          Revalidate All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cacheSections.map((section) => (
          <Card key={section.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{section.name}</CardTitle>
                {lastRevalidated[section.id] && (
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Updated
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Endpoint:</span>{" "}
                {section.endpoint}
              </div>

              {lastRevalidated[section.id] && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Last revalidated:</span>
                  <br />
                  {formatLastRevalidated(lastRevalidated[section.id])}
                </div>
              )}

              <Button
                onClick={() => handleRevalidate(section.id, section.endpoint)}
                disabled={loadingStates[section.id]}
                size="sm"
                variant="outline"
                className="w-full"
              >
                {loadingStates[section.id] ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Revalidate Cache
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <CardTitle className="text-lg text-orange-800 dark:text-orange-200">
              Cache Information
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-orange-700 dark:text-orange-300 space-y-2">
          <p>
            • Page routes (/, /projects) revalidate server components that fetch
            data directly from the database
          </p>
          <p>
            • API endpoints (/api/*) are cached with a 1-hour automatic
            revalidation period
          </p>
          <p>
            • Use manual revalidation after making content changes to see
            updates immediately
          </p>
          <p>
            • Revalidating API endpoints also triggers revalidation of
            corresponding pages
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
