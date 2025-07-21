"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const sections = [
  { id: "agreement", title: "Agreement to Terms" },
  { id: "service", title: "Service Description" },
  { id: "obligations", title: "User Obligations" },
  { id: "data", title: "Data Processing & Security" },
  { id: "ai-limitations", title: "AI Technology Limitations" },
  { id: "payment", title: "Subscription & Payment" },
  { id: "ip", title: "Intellectual Property Rights" },
  { id: "prohibited", title: "Prohibited Conduct" },
  { id: "termination", title: "Termination Provisions" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "governing", title: "Governing Law & Jurisdiction" },
  { id: "modification", title: "Terms Modification" },
  { id: "contact", title: "Contact Information" },
]

function NavigationContent({ onSectionClick }: { onSectionClick?: (id: string) => void }) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      onSectionClick?.(id)
    }
  }

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Quick Navigation</h3>
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="w-full text-left text-xs py-2 px-3 rounded hover:bg-muted transition-colors block"
        >
          <span className="text-muted-foreground">{index + 1}.</span> {section.title}
        </button>
      ))}
    </div>
  )
}

export default function TermsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background" tabIndex={-1}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-full mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Mobile Navigation Toggle */}
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <NavigationContent onSectionClick={() => setMobileNavOpen(false)} />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">Terms & Conditions</h1>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-full mx-auto flex">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:block w-48 flex-shrink-0">
          <div className="sticky top-20 p-4 h-[calc(100vh-5rem)] overflow-y-auto">
            <NavigationContent />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8 md:pl-4">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">Effective Date: 21 July 2025</p>
          </div>

          <div className="space-y-8">
            <section id="agreement">
              <h2 className="text-lg font-semibold mb-3">1. Agreement to Terms</h2>
              <div className="text-sm space-y-3">
                <p>
                  These Terms of Service constitute a legally binding agreement between you and InvoiceAI
                  regarding your access to and use of our artificial intelligence-powered invoice processing platform.
                </p>
                <p>
                  By accessing our services, you acknowledge that you have read, understood, and agree to be bound by
                  these Terms in their entirety.
                </p>
              </div>
            </section>

            <Separator />

            <section id="service">
              <h2 className="text-lg font-semibold mb-3">2. Service Description</h2>
              <div className="text-sm space-y-3">
                <p>InvoiceAI provides a comprehensive Software-as-a-Service platform featuring:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>AI-powered data extraction using Foundational llm models from invoice documents</li>
                  <li>Configurable invoice field definitions and extraction parameters</li>
                  <li>Secure document storage and management infrastructure</li>
                  <li>Multi-user collaboration and team workspace functionality</li>
                  <li>Administrative dashboards with analytics and reporting capabilities</li>
                  <li>Enterprise-grade authentication infrastructure</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section id="obligations">
              <h2 className="text-lg font-semibold mb-3">3. User Obligations</h2>
              <div className="text-sm space-y-3">
                <p>You covenant and agree to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide accurate, current, and complete registration information</li>
                  <li>Maintain the confidentiality of your authentication credentials</li>
                  <li>Immediately notify us of any suspected unauthorised account access</li>
                  <li>Assume full responsibility for all activities conducted under your account</li>
                  <li>Comply with all applicable laws and regulations in your use of the Service</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section id="data">
              <h2 className="text-lg font-semibold mb-3">4. Data Processing & Security</h2>
              <div className="text-sm space-y-3">
                <p>
                  Your uploaded documents and extracted data are processed and stored using secure
                  infrastructure, implementing industry-standard encryption and security protocols.
                </p>
                <p>
                  You retain complete ownership of your data and may request deletion at any time through our platform
                  interface. Our data handling practices are detailed in our Privacy Policy.
                </p>
              </div>
            </section>

            <Separator />

            <section id="ai-limitations">
              <h2 className="text-lg font-semibold mb-3">5. AI Technology Limitations</h2>
              <div className="text-sm space-y-3">
                <p className="font-medium">Important Disclaimer:</p>
                <p>
                  Our AI extraction technology is provided on an "as-is" basis. While designed for accuracy, machine
                  learning models may produce errors or incomplete results.
                </p>
                <p>
                  You acknowledge sole responsibility for verifying all extracted data before making business decisions.
                  InvoiceAI disclaims liability for decisions based on unverified AI outputs.
                </p>
              </div>
            </section>

            <Separator />

            <section id="payment">
              <h2 className="text-lg font-semibold mb-3">6. Subscription & Payment</h2>
              <div className="text-sm space-y-3">
                <p>
                  Subscription fees are charged in advance according to your selected plan. All payments are
                  non-refundable except as mandated by applicable consumer protection laws.
                </p>
                <p>
                  We reserve the right to modify pricing structures with thirty (30) days' written notice. Continued use
                  constitutes acceptance of revised pricing.
                </p>
              </div>
            </section>

            <Separator />

            <section id="ip">
              <h2 className="text-lg font-semibold mb-3">7. Intellectual Property Rights</h2>
              <div className="text-sm space-y-3">
                <p>
                  InvoiceAI retains all proprietary rights in our software, algorithms, machine learning models, and
                  platform architecture. These materials are protected by copyright, trade secret, and other
                  intellectual property laws.
                </p>
                <p>
                  Your licence to use our Service is limited, non-exclusive, and non-transferable. Reverse engineering,
                  decompilation, or extraction of our proprietary technology is strictly prohibited.
                </p>
              </div>
            </section>

            <Separator />

            <section id="prohibited">
              <h2 className="text-lg font-semibold mb-3">8. Prohibited Conduct</h2>
              <div className="text-sm space-y-3">
                <p>You are expressly prohibited from:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Uploading malicious software, viruses, or corrupted files</li>
                  <li>Attempting unauthorised access to our systems or other user accounts</li>
                  <li>Processing fraudulent, illegal, or misrepresented documents</li>
                  <li>Implementing automated systems that overload our infrastructure</li>
                  <li>Sharing account credentials or facilitating unauthorised access</li>
                  <li>Violating applicable laws or regulations through platform usage</li>
                  <li>Interfering with normal platform operations or other users' access</li>
                </ul>
              </div>
            </section>

            <Separator />

            <section id="termination">
              <h2 className="text-lg font-semibold mb-3">9. Termination Provisions</h2>
              <div className="text-sm space-y-3">
                <p>
                  Either party may terminate this agreement with or without cause. Account deletion may be initiated
                  through your platform settings.
                </p>
                <p>
                  We reserve the right to immediately suspend or terminate access for Terms violations or prohibited
                  activities. Upon termination, we may retain your data for a reasonable transition period.
                </p>
              </div>
            </section>

            <Separator />

            <section id="liability">
              <h2 className="text-lg font-semibold mb-3">10. Limitation of Liability</h2>
              <div className="text-sm space-y-3">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, INVOICEAI'S TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID
                  BY YOU IN THE TWELVE (12) MONTHS PRECEDING ANY CLAIM.
                </p>
                <p>
                  WE DISCLAIM LIABILITY FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
                  BUT NOT LIMITED TO LOST PROFITS OR BUSINESS INTERRUPTION.
                </p>
              </div>
            </section>

            <Separator />

            <section id="governing">
              <h2 className="text-lg font-semibold mb-3">11. Governing Law & Jurisdiction</h2>
              <div className="text-sm space-y-3">
                <p>
                  These Terms are governed by the laws of Tamil Nadu, India, without regard to conflict of law
                  principles. Any legal proceedings must be brought exclusively in the competent courts of Tamil Nadu.
                </p>
              </div>
            </section>

            <Separator />

            <section id="modification">
              <h2 className="text-lg font-semibold mb-3">12. Terms Modification</h2>
              <div className="text-sm space-y-3">
                <p>
                  We may revise these Terms at our discretion. Material changes will be communicated via email or
                  platform notification at least thirty (30) days prior to implementation.
                </p>
                <p>Continued use following notification constitutes acceptance of modified Terms.</p>
              </div>
            </section>

            <Separator />

            <section id="contact">
              <h2 className="text-lg font-semibold mb-3">13. Contact Information</h2>
              <div className="text-sm">
                <p>
                  For inquiries regarding these Terms, contact our legal department at{" "}
                  <a href="mailto:support@invoiceai.app" className="text-primary hover:underline font-medium">
                    support@invoiceai.app
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* <div className="mt-12 pt-6 border-t">
            <p className="text-xs text-muted-foreground text-center">© 2025 InvoiceAI. All rights reserved.</p>
          </div> */}
        </div>
      </div>
    </main>
  )
}
