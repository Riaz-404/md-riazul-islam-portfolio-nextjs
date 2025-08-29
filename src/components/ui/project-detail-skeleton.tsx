export function ProjectDetailSkeleton() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="animate-pulse">
        {/* Navigation placeholder */}
        <div className="h-16 bg-card border-b border-border"></div>

        {/* Page Title Section */}
        <section className="py-16 bg-background">
          <div className="container-custom content-constrained">
            <div className="text-center">
              <div className="h-4 bg-muted rounded w-32 mx-auto mb-6"></div>
              <div className="h-12 bg-muted rounded w-96 mx-auto"></div>
            </div>
          </div>
        </section>

        {/* Project Content */}
        <section className="section-padding">
          <div className="container-custom content-constrained">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                {/* Image placeholder */}
                <div className="w-full aspect-video bg-muted rounded mb-8"></div>

                {/* Description */}
                <div className="mb-8">
                  <div className="h-6 bg-muted rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/5"></div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <div className="h-6 bg-muted rounded w-24 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="h-6 bg-muted rounded w-32 mx-auto mb-6"></div>

                  <div className="space-y-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-4 bg-muted rounded w-20"></div>
                        <div className="h-4 bg-muted rounded w-16"></div>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-6">
                    <div className="h-5 bg-muted rounded w-16 mx-auto mb-4"></div>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-6 bg-muted rounded w-16"
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-6 space-y-3">
                    <div className="h-10 bg-muted rounded"></div>
                    <div className="h-10 bg-muted rounded"></div>
                    <div className="h-10 bg-muted rounded"></div>
                  </div>
                </div>

                {/* Contact section */}
                <div className="bg-card border border-border rounded-lg p-6 mt-6">
                  <div className="h-6 bg-muted rounded w-48 mx-auto mb-4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
