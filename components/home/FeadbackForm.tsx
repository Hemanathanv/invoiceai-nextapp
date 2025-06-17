// Name: V.Hemanathan
// Describe: This component is used to display the feedback form.It is used in the main home page.
// Framework: Next.js -15.3.2


"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function FeedbackForm() {
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackRole, setFeedbackRole] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thank you for your feedback!", {
      description: "Your testimonial has been submitted for review.",
    });
    setFeedbackName("");
    setFeedbackRole("");
    setFeedbackMessage("");
  };

  return (
    <section className="pb-28">
      <div className="flex items-center justify-center p-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center ">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Share Your Experience
            </h2>
            <p className="text-lg text-muted-foreground">
              We’d love to hear about your experience with InvoiceAI
            </p>
          </div>

          <Card className="mx-auto max-w-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmitFeedback}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-1"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium mb-1"
                    >
                      Your Role or Company (Optional)
                    </label>
                    <Input
                      id="role"
                      value={feedbackRole}
                      onChange={(e) => setFeedbackRole(e.target.value)}
                      placeholder="Accountant at Tech Corp"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="feedback"
                      className="block text-sm font-medium mb-1"
                    >
                      Your Feedback
                    </label>
                    <Textarea
                      id="feedback"
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      placeholder="Share your experience with our service..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-white-100"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" /> Submit Feedback
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
