"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, User as UserIcon } from "lucide-react";
import { useGetFeedbacks, type Feedback } from "@/components/home/_services/feedbackservice"; // adjust path if needed

export default function TestimonialsSection() {
  const { data: feedbacks, isError, isFetching } = useGetFeedbacks();

  // Show latest 3 testimonials (change as needed)
  const itemsToShow: Feedback[] = (feedbacks ?? []).slice(0, 3);

  // Simple placeholder/skeleton while loading
  if (isFetching && (!feedbacks || feedbacks.length === 0)) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Professionals Around the World
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our users are saying about InvoiceExtract
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-white border shadow-soft animate-pulse">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center mr-3" />
                    <div>
                      <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-4 w-4 bg-gray-200 rounded-full mr-1" />
                    ))}
                  </div>

                  <div className="h-12 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Professionals Around the World
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our users are saying about InvoiceExtract
            </p>
          </div>

          <div className="text-center text-red-500">Failed to load testimonials.</div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!itemsToShow || itemsToShow.length === 0) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Professionals Around the World
            </h2>
            <p className="text-lg text-muted-foreground">
              Be the first to leave a testimonial!
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Render real feedbacks
  return (
    <section className="py-20 bg-slate-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Professionals Around the World
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our users are saying about InvoiceExtract
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {itemsToShow.map((fb) => (
            <Card key={fb.id} className="bg-white border shadow-soft">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center mr-3">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{fb.name ?? "Anonymous"}</div>
                    <div className="text-sm text-muted-foreground">{fb.role ?? ""}</div>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const filled = s <= (fb.rating ?? 0);
                    return (
                      <Star
                        key={s}
                        className={`h-4 w-4 mr-1 ${filled ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                      />
                    );
                  })}
                </div>

                <p className="text-muted-foreground">{fb.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
