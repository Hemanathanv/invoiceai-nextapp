import { ProfilesTable } from "@/app/admin/_components/profiles/profiles-table"
import { ProfilesTableToolbar } from "@/app/admin/_components/profiles/profiles-table-toolbar"

export default async function ProfilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Profiles</h1>
      </div>
      <ProfilesTableToolbar />
      <ProfilesTable />
    </div>
  )
}
