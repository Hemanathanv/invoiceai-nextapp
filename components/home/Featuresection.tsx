// /components/home/FeaturesSection.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-muted-foreground">
            Extract data from invoices with ease and accuracy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white border shadow-soft">
            <CardContent className="p-8">
              <div className="rounded-full bg-accent w-12 h-12 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Automatic Extraction</h3>
              <p className="text-muted-foreground">
                Our AI accurately extracts key information from your invoices,
                including invoice numbers, dates, and amounts.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-soft">
            <CardContent className="p-8">
              <div className="rounded-full bg-accent w-12 h-12 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Multiple Formats</h3>
              <p className="text-muted-foreground">
                Support for various document formats including PDFs, images, and
                scanned documents.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-soft">
            <CardContent className="p-8">
              <div className="rounded-full bg-accent w-12 h-12 flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2H2v10h10V2zM22 2h-8v6h8V2zM22 10h-8v12h8V10zM12 14H2v8h10v-8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Custom Fields</h3>
              <p className="text-muted-foreground">
                Specify and extract custom fields based on your specific
                business needs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
