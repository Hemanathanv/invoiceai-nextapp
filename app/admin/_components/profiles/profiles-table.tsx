"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Profile = {
  id: string
  email: string
  name: string
  usage: number
  extractions: number
  status: string
  created_at: string
}

interface EditProfileDialogProps {
  profile: Profile 
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedProfile: Partial<Profile>) => void
}

export function EditProfileDialog({ profile, open, onOpenChange, onSave }: EditProfileDialogProps) {
  const [usage, setUsage] = useState(0)
  const [extractions, setExtractions] = useState(0)

  useEffect(() => {
<<<<<<< HEAD
    if (profile) {
      setUsage(profile.usage)
      setExtractions(profile.extractions)
=======
    fetchProfiles()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

   const fetchProfiles = async () => {
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
      if (error instanceof Error) {
        toast.error("Error fetching profiles: " + error.message)
      } else {
        toast.error("Error fetching profiles")
      }
    } finally {
      setLoading(false)
>>>>>>> d774a5d (profile  eslint-disable-next-line)
    }
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      usage,
      extractions,
    })
  }

<<<<<<< HEAD
  if (!profile) return null
=======
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

  //     setIsDialogOpen(false)
  //     setEditingProfile(null)
  //   } catch (error: any) {
  //     console.error("Error updating profile:", error)
  //     toast.error("Error updating profile: " + error.message)
  //   }
  // }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()
>>>>>>> d774a5d (profile  eslint-disable-next-line)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update the usage and extractions for {profile.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={profile.name} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" value={profile.email} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usage" className="text-right">
                Usage
              </Label>
              <Input
                id="usage"
                type="number"
                value={usage}
                onChange={(e) => setUsage(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="extractions" className="text-right">
                Extractions
              </Label>
              <Input
                id="extractions"
                type="number"
                value={extractions}
                onChange={(e) => setExtractions(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
