// Name: V.Hemanathan
// Describe: This component is used to display the pricing card for the user.
// Framework: Next.js -15.3.2 


import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface PricingCardProps {
  title: string;
  description: string;
  price: string | null;
  features: { text: string; included: boolean }[];
  tier: string;
  buttonText: string;
  disabled?: boolean;
  popular?: boolean;
}

const actionMap: Record<string, { href?: string; message?: string }> = {
  'Get Started': { href: '/login' },
  'Join Team': { href: '/teamlogin' },
  'Upgrade to Pro': { message: 'Pro features will be arriving soon' },
  'Contact Sales': { message: 'Our sales executive will contact you shortly' },
};

function renderAction(buttonText: string, disabled: boolean) {
  const action = actionMap[buttonText] || {};
  const button = (
    <Button
      size="lg"
      disabled={disabled}
      onClick={() => action.message && toast(action.message )}
      className="w-full"
    >
      {buttonText}
    </Button>
  );

  return action.href ? <Link href={action.href}>{button}</Link> : button;
}

export default function PricingCard({
  title,
  description,
  price,
  features,
  buttonText,
  disabled = false,
  popular = false,
}: PricingCardProps) {

  return (
    <div
      className={`border rounded-lg p-6 flex flex-col items-center ${
        popular ? "ring-2 ring-purple-500" : ""
      }`}
    >
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 text-center">{description}</p>
      <div className="text-4xl font-extrabold mb-6">
        {price === null ? "—" : `$${price}`}
      </div>

      <ul className="mb-6 space-y-2 w-full">
        {features.map((feature, idx) => (
          <li
            key={idx}
            className={`flex items-center gap-2 ${
              feature.included ? "text-gray-900" : "text-gray-400 line-through"
            }`}
          >
            {feature.included ? "✔️" : "✖️"} {feature.text}
          </li>
        ))}
      </ul>
      {renderAction(buttonText, disabled)}
    </div>
  );
}
