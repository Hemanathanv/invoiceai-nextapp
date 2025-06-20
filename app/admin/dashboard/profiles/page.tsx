"use client"

import { useEffect, useState } from "react";
import { ProfilesTable } from "@/app/admin/_components/profiles/profiles-table"
import { ProfilesTableToolbar } from "@/app/admin/_components/profiles/profiles-table-toolbar"
import { Button } from "@/components/ui/button";
import { fetchProfiles, ProfileWithRole } from "@/app/admin/_components/profiles/_services/profilesService";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export default function ProfilesPage() {
  const ITEMS_PER_PAGE = 20;
  const [profiles, setProfiles] = useState<ProfileWithRole[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);


  const [emailQuery, setEmailQuery] = useState("");
  const [subscription, setSubscription] = useState<"Free" | "Pro" | "Enterprise" | "Teams">("Free");


  useEffect(() => {
    setLoading(true);
    fetchProfiles(emailQuery, subscription, page, ITEMS_PER_PAGE)
      .then(({ data, total: count, error }) => {
        if (!error) {
          setProfiles(data);
          setTotal(count);
        }
      })
      .finally(() => setLoading(false));
  }, [emailQuery, subscription, page]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Profiles</h1>
      </div>
      <ProfilesTableToolbar
        onFilterChange={(q, sub) => {
          setEmailQuery(q);
          setSubscription(sub);
          setPage(1); // reset to first page on filter change
        }}
      />
      <ProfilesTable profiles={profiles} loading={loading} subscription={subscription} />
      <div className="flex  items-center justify-end">
        
        <div className="space-x-2">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <span>
          Page {page} of {totalPages}
        </span>
          <Button
            disabled={page * 20 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div> 
    </div>
  )
}