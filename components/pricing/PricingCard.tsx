import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCardProps {
  title: string
  description: string
  price: string | null
  features: PricingFeature[]
  buttonText: string
  popular?: boolean
  tier: string
}

export default function PricingCard({
  title,
  description,
  price,
  features,
  buttonText,
  popular = false,
  tier,
}: PricingCardProps) {
  return (
    <Card className={`flex flex-col ${popular ? "border-primary shadow-lg" : ""}`}>
      {popular && (
        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">Most Popular</div>
      )}

      <CardHeader className="flex-1">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="mt-4">
          {price !== null ? (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">${price}</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
          ) : (
            <div className="text-xl font-medium">Contact Us</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Link
          href={
            tier === "free"
              ? "/login?tab=signup"
              : tier === "enterprise" || tier === "authorised"
                ? "/contact"
                : "/login"
          }
          className="w-full"
        >
          <Button className={`w-full ${popular ? "bg-primary" : ""}`}>{buttonText}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
