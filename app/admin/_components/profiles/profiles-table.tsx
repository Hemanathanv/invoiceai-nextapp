"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient, fetchUserUsage } from "@/utils/supabase/client"

// import { EditProfileDialog } from "@/app/admin/_components/profiles/edit-profile-dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type Profile = {
  id: string
  email: string
  name: string
  subscription_tier: string
  uploads_used: number
  uploads_limit: number
  extractions_used: number
  extractions_limit: number
  is_admin: boolean
  created_at: string
}

export function ProfilesTable() {
  const supabase = createClient()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  // const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  // const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchProfiles()
  })

  async function fetchProfiles() {
    try {
      setLoading(true)
      // Fetch core profiles data
      const { data: coreProfiles, error: coreError } = await supabase
        .from("profiles")
        .select("id, email, name, subscription_tier, is_admin, created_at, uploads_limit, extractions_limit")
        .order("created_at", { ascending: false })

      if (coreError) throw coreError

      // For each profile, fetch usage via existing service
      const profilesWithUsage = await Promise.all(
        (coreProfiles || []).map(async (p) => {
          const { data, error } = await fetchUserUsage(p.id)
          if (error) {
            console.error(`Usage fetch failed for ${p.id}:`, error.message)
            return { ...p, uploads_used: 0, extractions_used: 0 }
          }
          return {
            ...p,
            uploads_used: data!.uploads_used,
            extractions_used: data!.extractions_used,
          }
        })
      )

      // Map to Profile type
      setProfiles(
        profilesWithUsage.map((row) => ({
          id: row.id,
          email: row.email,
          name: row.name,
          subscription_tier: row.subscription_tier,
          is_admin: row.is_admin,
          created_at: row.created_at,
          uploads_used: row.uploads_used,
          uploads_limit: row.uploads_limit,
          extractions_used: row.extractions_used,
          extractions_limit: row.extractions_limit,
        }))
      )
    } catch (error) {
      console.error("Error fetching profiles:", error)
      toast.error("Error fetching profiles: " + error)
    } finally {
      setLoading(false)
    }
  }

  // const handleEditProfile = (profile: Profile) => {
  //   setEditingProfile(profile)
  //   // setIsDialogOpen(true)
  // }

  // const handleSaveProfile = async (updatedProfile: Partial<Profile>) => {
  //   try {
  //     if (!editingProfile) return

  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .update({
  //         uploads_limit: updatedProfile.uploads_limit,
  //         extractions_limit: updatedProfile.extractions_limit,
  //       })
  //       .eq("id", editingProfile.id)
  //       .select()

  //     if (error) throw error

  //     setProfiles(
  //       profiles.map(profile =>
  //         profile.id === editingProfile.id ? { ...profile, ...updatedProfile } : profile
  //       )
  //     )

  //     // setIsDialogOpen(false)
  //     setEditingProfile(null)
  //   } catch (error: any) {
  //     console.error("Error updating profile:", error)
  //     toast.error("Error updating profile: " + error.message)
  //   }
  // }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Subscription</TableHead>
              <TableHead>Uploads Used</TableHead>
              <TableHead>Upload Limit</TableHead>
              <TableHead>Invoices Processed</TableHead>
              <TableHead>Invoice Limit</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Loading profiles...
                </TableCell>
              </TableRow>
            ) : profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No profiles found.
                </TableCell>
              </TableRow>
            ) : (
              profiles.map(profile => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.is_admin ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Badge variant={profile.subscription_tier === "Free" ? "default" : "secondary"}>
                      {profile.subscription_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>{profile.uploads_used}</TableCell>
                  <TableCell>{profile.uploads_limit}</TableCell>
                  <TableCell>{profile.extractions_used}</TableCell>
                  <TableCell>{profile.extractions_limit}</TableCell>
                  <TableCell>{formatDate(profile.created_at)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {/* <DropdownMenuItem onClick={() => handleEditProfile(profile)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* <EditProfileDialog
        profile={editingProfile}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveProfile}
      /> */}
    </>
  )
}