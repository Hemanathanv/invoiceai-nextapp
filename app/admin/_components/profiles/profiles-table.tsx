"use client"

import { Ban, MoreHorizontal } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { EditProfileDialog } from "./edit-profile-dialog"
import { useState } from "react"
import { ProfileWithRole, saveProfile } from "./_services/profilesService"
import { toast } from "sonner"

interface ProfilesTableProps {
  profiles: ProfileWithRole[];
  loading?: boolean;
  subscription: string;
}

export function ProfilesTable({ profiles, loading, subscription }: ProfilesTableProps) {
  const [editingProfile, setEditingProfile] = useState<ProfileWithRole | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // const handleEditProfile = (profile: Profile) => {
  //   setEditingProfile(profile)
  //   setIsDialogOpen(true)
  // }

  const handleSaveProfile = async (updatedProfile: Partial<Profile>) => {
    if (!editingProfile) return;

  const { success, error } = await saveProfile(editingProfile.id, {
    is_admin: updatedProfile.is_admin,
    subscription_tier: updatedProfile.subscription_tier,
    uploads_limit: updatedProfile.uploads_limit,
    extractions_limit: updatedProfile.extractions_limit,
  });

  if (!success) {
    toast.error("Error updating profile: " + error);
    return;
  } 
    toast.success("Profile updated successfully")
    setIsDialogOpen(false)
    setEditingProfile(null)
  }

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
              {subscription === "Teams" && <TableHead>Role</TableHead>}
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
                <TableCell colSpan={10} className="h-24 text-center">
                  Loading profiles...
                </TableCell>
              </TableRow>
            ) : profiles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
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
                  {subscription === "Teams" && (
                    <TableCell>{profile.role ?? "—"}</TableCell>
                  )}
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
                        <DropdownMenuItem onClick={() => handleEditProfile(profile)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4" />
                          Block
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditProfileDialog
        profile={editingProfile}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveProfile}
      />
    </>
  )
}