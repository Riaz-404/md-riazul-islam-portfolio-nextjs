import { Card } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";

interface ProjectLoadingProps {
  count?: number;
}

export function ProjectLoading({ count = 3 }: ProjectLoadingProps) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="p-3 sm:p-4 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="flex space-x-2 sm:flex-shrink-0">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ProjectLoadingCenter() {
  return (
    <Card className="p-8 text-center">
      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
      <p className="text-gray-500">Loading projects...</p>
    </Card>
  );
}
