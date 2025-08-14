"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OrganizationSetup } from "@/app/teams/dashboard/_components/organization-setup"
import { ClientManagement } from "@/app/teams/dashboard/_components/client-management"
import { CreditManagement } from "@/app/teams/dashboard/_components/credit-management"
import { Building2, Users, CreditCard, Settings } from "lucide-react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { getOrgForUser } from "./_service/org_service"
import { Overview } from "./_components/Overview"
import { toast } from "sonner"
import LoadingScreen from "@/components/LoadingScreen"

export default function TeamsPage() {
  const { data: profile, isLoading, isError, error } = useUserProfile();

  const [currentOrg, setCurrentOrg] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string>("")
  const [role, setRole] = useState<string>("")
  const [orgLoading, setOrgLoading] = useState(true);

  useEffect(() => {
    if (!profile?.id) {
      setOrgLoading(false)
      return
    }
    if (isError) {
      const message = (error as Error | null)?.message ?? "Something went wrong";
      toast.error(message);
    }
    setOrgLoading(true)
    getOrgForUser(profile.id)
      .then((teamInfo) => {
        if (teamInfo) {
          setCurrentOrg(teamInfo.org_id)
          setOrgName(teamInfo.org_name)
          setRole(teamInfo.role || "user")
        }
      })
      .finally(() => setOrgLoading(false))
  }, [profile, isError, error])

  if (isLoading || !profile ) {
    return <LoadingScreen />;
  }

  if (role === "user") {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Teams {role}</h1>
            {isLoading || orgLoading ?  (
          <div className="text-center"> Loading...</div>
        ) :  currentOrg ? (
            <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
            <Overview orgId={currentOrg} profile={profile as Profile} role={role} />
              {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,350</div>
                    <p className="text-xs text-muted-foreground">-180 from last week</p>
                  </CardContent>
                </Card>
              </div> */}
            </TabsContent>
            </Tabs>
        ): (
          <div className="text-center">No organization selected</div>
        )}
          </div>
        </div>
      </div>
    )
    }
  
  if (role === "manager") {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Teams Management</h1>
          <p className="text-muted-foreground">Manage your Team, clients, and credit allocation</p>
        </div>
        {/* Organization Setup or Management */}
        {isLoading || orgLoading ? (
          <LoadingScreen />
        ) : 
          !currentOrg ? (
          <OrganizationSetup onOrgCreated={setCurrentOrg} profile = {profile} />
        ) : (
          <Tabs defaultValue="clients" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="Users" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clients">
              <ClientManagement orgName={orgName!} orgID={currentOrg } user_id={profile?.id as string} />
            </TabsContent>

            <TabsContent value="Users">
              <CreditManagement orgId={currentOrg} profile={profile as Profile}/>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Teams Settings</CardTitle>
                  <CardDescription>Manage your organization configuration and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col items-left w-max justify-between p-6 border rounded-lg">
                    <div>
                        <h2 className="font-medium">Organization Name</h2>
                        <p className="text-sm text-muted-foreground">{orgName}</p>
                      </div>
                      <div>
                        <h3 className="font-medium">Organization ID</h3>
                        <p className="text-sm text-muted-foreground">{currentOrg}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="overview">
            <Overview orgId={currentOrg} profile={profile as Profile} role={role} />
              {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,350</div>
                    <p className="text-xs text-muted-foreground">-180 from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">48</div>
                    <p className="text-xs text-muted-foreground">+12 from last month</p>
                  </CardContent>
                </Card>
              </div> */}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
}
