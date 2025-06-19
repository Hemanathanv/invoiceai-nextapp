"use client"

import { ProfilesTable } from "@/app/admin/_components/profiles/profiles-table"
import { ProfilesTableToolbar } from "@/app/admin/_components/profiles/profiles-table-toolbar"
import { useState } from "react";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Profiles</h1>
      </div>
      <ProfilesTableToolbar  onResults={setProfiles}/>
      <ProfilesTable profiles={profiles} />
    </div>
  )
}
