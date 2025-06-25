"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SUBSCRIPTIONS = ["Free", "Pro", "Enterprise", "Authorised"] as const;

interface ProfilesTableToolbarProps {
  onFilterChange: (emailQuery: string, subscription: typeof SUBSCRIPTIONS[number]) => void;
}

export function ProfilesTableToolbar({ onFilterChange }: ProfilesTableToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");;
  const [subscription, setSubscription] = useState<typeof SUBSCRIPTIONS[number]>(
    "Free"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onFilterChange(searchQuery, subscription);
  }, [searchQuery, subscription, onFilterChange]);

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={subscription}
          onValueChange={(val) => setSubscription(val as typeof SUBSCRIPTIONS[number])}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Subscription" />
          </SelectTrigger>
          <SelectContent>
            {SUBSCRIPTIONS.map((tier) => (
              <SelectItem key={tier} value={tier}>
                {tier === "Free" ? "Free"  : tier}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Button disabled={loading}>{loading ? "Loading…" : "Export"}</Button>
      </div>
    </div>
  );
}