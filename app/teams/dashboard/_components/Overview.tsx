"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { TabsContent } from '@/components/ui/tabs'
import { getUsersForOrg } from '@/app/teams/dashboard/_service/credit_management_servise'
import { getClientsForOrg } from '@/app/teams/dashboard/_service/client_service'
import { toast } from 'sonner'
import { Users, CreditCard, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingScreen from '@/components/LoadingScreen'

interface User {
    id: string
    name: string
    email: string
    credits: number
    role: string
    client_names: string[]
    uploads_used: number
  }
  
  interface Client {
    id: string
    user_id: string
    org_id: string
    client_id: string
    client_name: string
    client_email: string
    status: "Active" | "inActive"
    dbConnection?: string
  }

interface OverviewProps {
  orgId: string
  profile: Profile
  role: string
}

export function Overview({ orgId, profile, role }: OverviewProps) {
  const [users, setUsers] = useState<User[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (profile?.subscription_tier === "Teams" && profile.org_id === orgId) {
      setLoadingUsers(true);
  
      getUsersForOrg(orgId)
        .then((rows) => {
          const mapped: User[] = rows.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            credits: u.uploads_limit,
            role: u.role,
            client_names: u.client_names,
            uploads_used: u.uploads_used,
          }))
          setUsers(mapped)
  
          // return the next promise so that .catch/.finally will see errors here too
          return getClientsForOrg(orgId);
        })
        .then((rows) => {
          const clients: Client[] = rows.map((u) => ({
            id: u.id,
            user_id: u.user_id,
            org_id: u.org_id,
            client_id: u.client_id,
            client_name: u.client_name,
            client_email: u.client_email,
            status: u.status,
            dbConnection: u.dbConnection,
          }));
          setClients(clients);
        })
        .catch((e: Error) => {
          toast.error(e.message);
        })
        .finally(() => {
          setLoadingUsers(false);
        });
    }
  }, [orgId, profile]);

  // derive stats
  const roleUsers = useMemo(() => users.filter(u => u.role === 'user'), [users])
  const totalClients = useMemo(() => {
    const activeIds = clients
      .filter(c => c.status === 'Active')
      .map(c => c.client_id)
  
    return new Set(activeIds).size
  }, [clients])
  const activeUsers = useMemo(() => roleUsers.length, [roleUsers])
  const totalCredits = profile?.uploads_limit ?? 0
  const allocated = useMemo(() => roleUsers.reduce((sum, u) => sum + u.credits, 0), [roleUsers])
  const used = useMemo(() => users.reduce((sum, u) => sum + u.uploads_used, 0), [users])
  const remaining = totalCredits - allocated - used
  const activeUser = users.find(u => u.id === profile.id);
  const activeUserCredits = activeUser ? activeUser.uploads_used : 0;
  const activeUserClients = activeUser ? activeUser.client_names.length : 0
  const userRemaining = profile?.uploads_limit - activeUserCredits

  // placeholder deltas (implement real logic as needed)
  // const diffClients = 0
  // const diffUsers = 0
  // const creditsDelta = 0

  if (loadingUsers) {
    return <LoadingScreen />;
  }

  if (role === 'user') {
    return (

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeUserClients}</div>
                    {/* <p className="text-xs text-muted-foreground">+2 from last month</p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userRemaining}</div>
                    <p className="text-xs text-muted-foreground">{profile?.uploads_limit} credits allocated to you</p>
                  </CardContent>
                </Card>
              </div> 
    )}

  return (
    <TabsContent value="overview">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalClients}</div>
                    {/* <p className="text-xs text-muted-foreground">+2 from last month</p> */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{remaining}</div>
                    <p className="text-xs text-muted-foreground">{allocated} credits allocated</p>
                    <p className="text-xs text-muted-foreground">{used} credits consumed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeUsers}</div>
                    {/* <p className="text-xs text-muted-foreground">+12 from last month</p> */}
                  </CardContent>
                </Card>
              </div>
    </TabsContent>
  )
}
