// Name: V.Hemanathan
// Describe: This component is used to display the How it works section.It is used in the main home page.
// Framework: Next.js -15.3.2


"use client";

export default function HowItWorksSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground">
            Extract data from your invoices in just three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-medium mb-3">Upload Documents</h3>
            <p className="text-muted-foreground">
              Upload your invoice documents in PDF or image format to our
              secure platform.
            </p>
          </div>

          <div className="text-center">
            <div className="relative w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-medium mb-3">Specify Fields</h3>
            <p className="text-muted-foreground">
              Choose standard fields or define custom fields for extraction.
            </p>
          </div>

          <div className="text-center">
            <div className="relative w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-medium mb-3">Get Results</h3>
            <p className="text-muted-foreground">
              Receive structured data extracted from your invoices in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
