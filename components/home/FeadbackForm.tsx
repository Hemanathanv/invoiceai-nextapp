"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";

import { useSaveFeedback } from "@/components/home/_services/feedbackservice"; // adjust path

export default function FeedbackForm() {
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackRole, setFeedbackRole] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [rating, setRating] = useState<number>(5); // default to 5 stars

  const mutation = useSaveFeedback();

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackName.trim() || !feedbackMessage.trim()) {
      return toast.error("Please provide your name and feedback message.");
    }

    if (!rating || rating < 1 || rating > 5) {
      return toast.error("Please select a rating between 1 and 5.");
    }

    try {
      await mutation.mutateAsync({
        name: feedbackName.trim(),
        role: feedbackRole.trim() || null,
        message: feedbackMessage.trim(),
        rating,
      });

      toast.success("Thank you for your feedback!", {
        description: "Your testimonial has been submitted for review.",
      });

      setFeedbackName("");
      setFeedbackRole("");
      setFeedbackMessage("");
      setRating(5);
    } catch (err: any) {
      console.error("Failed to submit feedback", err);
      toast.error(err?.message ?? "Failed to submit the feedback. Try again.");
    }
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
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
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
                    <label htmlFor="role" className="block text-sm font-medium mb-1">
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
                    <label htmlFor="rating" className="block text-sm font-medium mb-1">
                      Rating
                    </label>

                    <fieldset className="flex items-center gap-2">
                      <legend className="sr-only">Select rating (1 to 5)</legend>

                      {/* Stars */}
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const filled = star <= rating;
                          return (
                            <button
                              key={star}
                              type="button"
                              aria-label={`${star} star${star > 1 ? "s" : ""}`}
                              onClick={() => setRating(star)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") setRating(star);
                              }}
                              className={`p-1 focus:outline-none ${
                                filled ? "text-yellow-400" : "text-gray-300"
                              }`}
                            >
                              <Star size={18} />
                            </button>
                          );
                        })}
                      </div>

                      <div className="ml-3 text-sm text-muted-foreground">
                        {rating} {rating === 1 ? "star" : "stars"}
                      </div>
                    </fieldset>
                  </div>

                  <div>
                    <label htmlFor="feedback" className="block text-sm font-medium mb-1">
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
                      disabled={mutation.isPending}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {mutation.isPending ? "Submitting..." : "Submit Feedback"}
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
