// app/pricing/page.tsx
import PricingCard from '@/components/pricing/PricingCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PricingPage() {
  const freeFeatures = [
    { text: 'Up to 2 document uploads', included: true },
    { text: '2 extraction requests per day', included: true },
    { text: 'Standard field extraction', included: true },
    { text: 'Custom field extraction', included: true },
  ]

  const proFeatures = [
    { text: 'Up to 100 document uploads', included: true },
    { text: '1000 extraction requests per day', included: true },
    { text: 'Standard field extraction', included: true },
    { text: 'Custom field extraction', included: true },
    { text: 'Priority support', included: true },
  ]

  const enterpriseFeatures = [
    { text: 'Unlimited document uploads', included: true },
    { text: 'Unlimited extraction requests', included: true },
    { text: 'Standard field extraction', included: true },
    { text: 'Custom field extraction', included: true },
    { text: 'Dedicated support', included: true },
  ]

  const authorisedFeatures = [
    { text: 'Only for Authorised Users', included: true },
    { text: 'Unlimited Usage', included: true },
    { text: 'Standard field extraction', included: true },
    { text: 'Custom field extraction', included: true },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}

      <main className="flex-1 container py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="Free"
              description="Perfect for trying out the platform"
              price="0"
              features={freeFeatures}
              buttonText="Get Started"
              tier="free"
            />

            <PricingCard
              title="Pro"
              description="For businesses processing multiple invoices"
              price="49"
              features={proFeatures}
              buttonText="Upgrade to Pro"
              popular={true}
              tier="pro"
            />

            <PricingCard
              title="Enterprise"
              description="For organizations with high-volume needs"
              price={null}
              features={enterpriseFeatures}
              buttonText="Contact Sales"
              tier="enterprise"
            />

            <PricingCard
              title="Authorised Users"
              description="Special plan for authorised users"
              price={null}
              features={authorisedFeatures}
              buttonText="Contact Sales"
              tier="authorised"
            />
          </div>

          <div className="mt-16 bg-accent rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">What happens when I reach my usage limit?</h3>
                <p className="text-muted-foreground">
                  You'll be notified when you're approaching your limits. You can upgrade your plan at any time to increase your limits.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">What file formats are supported?</h3>
                <p className="text-muted-foreground">
                  We support PDF documents and various image formats including JPG, PNG, and TIFF.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, we use industry-standard encryption and security practices to protect your data. All files are processed securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  )
}
