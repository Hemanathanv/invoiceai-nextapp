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
    if (profile) {
      setUsage(profile.usage)
      setExtractions(profile.extractions)
    }
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      usage,
      extractions,
    })
  }

  if (!profile) return null

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
