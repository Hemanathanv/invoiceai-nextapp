// /components/home/TestimonialsSection.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star, User as UserIcon } from "lucide-react";

export default function TestimonialsSection() {
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
<div className="flex w-full h-full justify-center items-center content-center">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <Card className="bg-white border shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center mr-3">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Accountant</div>
                  <div className="text-sm text-muted-foreground">at TechCorp</div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground">
                This tool has saved me countless hours. The accuracy is
                outstanding and setup was a breeze!
              </p>
            </CardContent>
          </Card>

          {/* Testimonial 2 */}
          <Card className="bg-white border shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center mr-3">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Small Business Owner</div>
                  <div className="text-sm text-muted-foreground"></div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground">
                Finally an easy way to process invoices without manually entering
                data. I absolutely love it!
              </p>
            </CardContent>
          </Card>

          {/* Testimonial 3 */}
          <Card className="bg-white border shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center mr-3">
                  <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Finance Manager</div>
                  <div className="text-sm text-muted-foreground"></div>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground">
                The AI is incredibly fast and reliable. It’s become an essential part
                of our workflow.
              </p>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </section>
  );
}
