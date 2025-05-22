// app/page.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { MessageSquare, Star, User } from 'lucide-react'

export default function Home() {
  const [feedbackName, setFeedbackName] = useState('')
  const [feedbackRole, setFeedbackRole] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault()

    // Use toast() from 'sonner', not from '@/components/ui/sonner'
    toast.success('Thank you for your feedback!', {
      description: 'Your testimonial has been submitted for review.',
    })

    setFeedbackName('')
    setFeedbackRole('')
    setFeedbackMessage('')
  }

  return (
    <div className="relative overflow-hidden">
     <div className="absolute -top-96 -left-60 w-[800px] h-[800px] bg-purple-300 blur-3xl opacity-30 rounded-full rotate-45 animate-pulse-gentle" />
     <div className="absolute -bottom-96 -right-60 w-[900px] h-[900px] bg-blue-300 blur-3xl opacity-30 rounded-full rotate-45 animate-pulse-gentle" />
      {/* <Header /> */}

      {/* Place your Sonner Toaster near the root so any toast() call will show up */}
      <Toaster />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Animated AI GIF */}
              <div className="mb-8">
                <img
                  src="/Animation.gif"
                  alt="AI animation"
                  className="mx-auto w-32 h-32 object-contain"
                />
              </div>
              
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Extract invoice data{' '}
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">automatically</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10">
                Save hours of manual data entry with our AI-powered invoice
                extraction platform. Process invoices, receipts, and documents
                in seconds.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/login" passHref>
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90">
                    Try for Free
                  </Button>
                </Link>
                <Link href="/pricing" passHref>
                  <Button size="lg" variant="outline">
                    View Pricing
                  </Button>
                </Link>
              </div>
              
            </div>

            {/* Abstract background shapes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl aspect-[2/1] -z-10 opacity-20">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-purple-light rounded-full filter blur-3xl animate-pulse-gentle" />
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-brand-400 rounded-full filter blur-3xl animate-pulse-gentle" />
            </div>
          </div>
        </section>

        {/* Features Section */}
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
                    Support for various document formats including PDFs, images,
                    and scanned documents.
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

        {/* How It Works */}
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

        {/* Testimonials Section */}
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
              {/* Testimonial 1 */}
              <Card className="bg-white border shadow-soft">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary" />
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
                    "This tool has saved me countless hours. The accuracy is
                    outstanding and setup was a breeze!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 2 */}
              <Card className="bg-white border shadow-soft">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary" />
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
                    "Finally an easy way to process invoices without manually
                    entering data. I absolutely love it!"
                  </p>
                </CardContent>
              </Card>

              {/* Testimonial 3 */}
              <Card className="bg-white border shadow-soft">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-accent w-10 h-10 flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-primary" />
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
                    "The AI is incredibly fast and reliable. It's become an
                    essential part of our workflow."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feedback Submission Form */}
        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Share Your Experience
                </h2>
                <p className="text-lg text-muted-foreground">
                  We'd love to hear about your experience with InvoiceAI
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
                        <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-white-100">
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

        {/* CTA Section */}
        {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to automate your invoice processing?
            </h2>
            <p className="text-xl text-white text-opacity-80 mb-8">
              Join thousands of businesses saving time with InvoiceAI.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login?tab=signup">
                <Button size="lg" className="bg-white text-primary hover:bg-blue-100">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-primary hover:bg-blue-100">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </main>
      {/* <Footer /> */}
    </div>
  )
}