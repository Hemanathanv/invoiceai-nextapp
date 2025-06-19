"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchProfiles } from "./_services/profilesService"

const SUBSCRIPTIONS = ["Free", "Pro", "Enterprise", "Authorised"] as const;

interface ProfilesTableToolbarProps {
  /** Called with fresh list whenever filters change */
  onResults?: (profiles: Profile[]) => void;
  defaultQuery?: string;
  defaultSub?: typeof SUBSCRIPTIONS[number];
}

export function ProfilesTableToolbar({
  onResults = () => {},
  defaultQuery = "",
  defaultSub = "Free",
}: ProfilesTableToolbarProps) {
  const [searchQuery, setSearchQuery] = useState(defaultQuery);
  const [subscription, setSubscription] = useState<typeof SUBSCRIPTIONS[number]>(
    defaultSub
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isActive = true;
    setLoading(true);

    fetchProfiles(searchQuery, subscription).then(({ data, error }) => {
      if (!isActive) return;
      setLoading(false);
      if (error) {
        console.error("Error loading profiles:", error);
      } else {
        onResults(data);
      }
    });

    return () => {
      isActive = false;
    };
  }, [searchQuery, subscription, onResults]);

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