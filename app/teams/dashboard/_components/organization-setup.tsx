"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, Plus } from "lucide-react"
import { insertOrgForUser } from "../_service/org_service"
import { useUserProfile } from "@/hooks/useUserProfile"

interface OrganizationSetupProps {
  onOrgCreated: (orgId: string) => void
}

export function OrganizationSetup({ onOrgCreated }: OrganizationSetupProps) {
  const {profile, loading} = useUserProfile()
  const user_id = profile?.id
  const [orgName, setOrgName] = useState("")
  const [orgId, setOrgId] = useState("")
  const [description, setDescription] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const generateOrgId = () => {
    const randomPart = Math.random()
      .toString(36)
      .slice(2, 16);
  
    const id =
      orgName
        .toLowerCase()
        .replace(/\s+/g, "-")
      + "-" + randomPart;
  
    setOrgId(id);
  };

  const handleCreateOrg = async () => {
    if (!orgName || !orgId || !user_id) return;
  
    setIsCreating(true);
    try {
      // persist orgId to both tables
      await insertOrgForUser({ userId: user_id, orgName, orgId });
      onOrgCreated(orgId);
    } catch (error) {
      // console.error("Failed to save orgId:", error);
      // optionally show an error toast here
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Your Organization</CardTitle>
          <CardDescription>Set up your organization to start managing clients and credits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input
              id="org-name"
              placeholder="Enter organization name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-id">Organization ID</Label>
            <div className="flex gap-2">
              <Input
                id="org-id"
                placeholder="Enter or generate organization ID"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
              />
              <Button variant="outline" onClick={generateOrgId} disabled={!orgName}>
                Generate
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This will be used to identify your organization across the platform
            </p>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your organization"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div> */}

          <Button onClick={handleCreateOrg} disabled={!orgName || !orgId || isCreating} className="w-full">
            {isCreating ? (
              "Creating Organization..."
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
