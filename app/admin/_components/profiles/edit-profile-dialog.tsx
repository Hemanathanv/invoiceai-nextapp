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
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"


interface EditProfileDialogProps {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedProfile: Partial<Profile>) => void
}

export function EditProfileDialog({ profile, open, onOpenChange, onSave }: EditProfileDialogProps) {
  const [uploads_limit, setUsage] = useState(0)
  const [extractions_limit, setExtractions] = useState(0)
  const plans = ["Free", "Pro", "Enterprise", "Authorised"];
  const [subscription, setSubscription] = useState<string>("Free");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setUsage(profile.uploads_limit)
      setExtractions(profile.extractions_limit)
      setSubscription(profile.subscription_tier)
      setIsAdmin(profile.is_admin)
    }
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      uploads_limit,
      extractions_limit,
      subscription_tier: subscription,
      is_admin: isAdmin
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
    <Label htmlFor="is_admin" className="text-right">
      Admin
    </Label>
    <div className="col-span-3 flex items-center space-x-2">
      <Checkbox
        id="is_admin"
        checked={isAdmin}
        onCheckedChange={(val) => setIsAdmin(!!val)}
      />
      <span>{isAdmin ? "Yes" : "No"}</span>
    </div>
  </div>

            <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="subscription" className="text-right">
      Subscription
    </Label>
    <select
      id="subscription"
      value={subscription}
      onChange={(e) => setSubscription(e.target.value)}
      className="col-span-3 rounded border p-2"
    >
      {plans.map((plan) => (
        <option key={plan} value={plan}>
          {plan}
        </option>
      ))}
    </select>
  </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="usage" className="text-right">
                Usage
              </Label>
              <Input
                id="usage"
                type="number"
                value={uploads_limit}
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
                value={extractions_limit}
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
