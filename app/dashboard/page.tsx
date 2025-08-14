// Name: V.Hemanathan
// Describe: Application Dashboard. main page of the application where we upload and process the files.
// Framework: Next.js -15.3.2 


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UsageStats from "@/app/dashboard/_components/UsageStats";
import UploadBox from "@/app/dashboard/_components/UploadBox";
import { useUserProfile } from "@/hooks/useUserProfile";
import AppMainSidebar from "@/app/dashboard/_components/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select"
import FieldsConfig from "./_components/FieldsConfig";
import { SidebarInset,  SidebarTrigger } from "@/components/ui/sidebar";
import DocumentsHistorytab from "./_components/DocumentsHistorytab";
import { getClientsForOrg, Client } from "../teams/dashboard/_service/client_service";
import ClientFieldsConfig from "../teams/dashboard/_components/client-invoice-config";
import { getOrgForUser } from "../teams/dashboard/_service/org_service";
import { toast } from "sonner";
import TeamsUploadBox from "./_components/TeamsUploadBox";
import LoadingScreen from "@/components/LoadingScreen";

export default function DashboardPage() {
  // 1) Always call hooks at top level
  const { data: profile, isLoading, isError, error } = useUserProfile();
  const router = useRouter();
  // const [currentSection, setCurrentSection] = useState<
  //   "overview" | "usage" | "process" | "Field settings"
  // >("overview");
  // Only relevant for Teams tier:
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientsLoading, setClientsLoading] = useState(false)
  const [role, setRole] = useState("")


  // 2) Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !profile) {
      router.replace("/login");
    }
    if (isError ) {
      const message = (error as Error | null)?.message ?? "Something went wrong";
      toast.error(message);
    }
    if (profile?.subscription_tier === "Teams" && profile?.org_id) {
      setClientsLoading(true)
      getClientsForOrg(profile.org_id)
        .then((list) => setClients(list))
        .catch((e) => toast.error(e))
        .finally(() => setClientsLoading(false))
      getOrgForUser(profile.id)
        .then((org) => {
          if (org) {
            setRole(org.role)
          } else {
            toast.error("No org found for user")
          }
        })
        .catch((e) => toast.error(e))
        .finally(() => setClientsLoading(false))
    }
  }, [profile, isLoading, router, isError, error]);

  // console.log(clients)
  // console.log(role)
  // 3) Track URL hash to highlight sidebar item
  // useEffect(() => {
  //   // function onHashChange() {
  //   //   const hash = window.location.hash.replace("#", "") as
  //   //     | "overview"
  //   //     | "usage"
  //   //     | "process"
  //   //     | "Field settings";

  //   //   // if (["overview", "usage", "process", "Field settings"].includes(hash)) {
  //   //   //   setCurrentSection(hash);
  //   //   // }
  //   // }

  //   onHashChange();
  //   window.addEventListener("hashchange", onHashChange);
  //   return () => window.removeEventListener("hashchange", onHashChange);
  // }, []);

  // 4) While loading or redirecting, show spinner
  if (isLoading || !profile) {
    return <LoadingScreen />;
  }

  const userClients = clients.filter(c => c.user_id === profile?.id && c.status === "Active");

  // console.log(userClients)
  // 5) Now render sidebar + main content
  return (
    <div className="flex w-full bg-white">
      <AppMainSidebar  />
      {/* Sidebar */}      <SidebarInset className="flex flex-col">
      

<div className=" w-full  ">
  
      <SidebarTrigger />
      {/* Main content */}
      <main className="flex-1 p-5  w-full ">
        {/* Overview */}
        <div className="w-full px-5 flex flex-col  md:flex-col xl:flex-row 2xl:flex-row justify-between">
        
        <section id="overview" className="">
          <h1 className="text-3xl font-bold mb-2">
          Welcome,<span className="text-purple-600">{profile.name ? `${profile.name}` : ""}</span>!
          </h1>
          <p className="text-muted-foreground">
            Manage your documents and extraction requests here.
          </p>
        </section>
        {profile.subscription_tier.toLowerCase() === "free" && (
         
            <div className=" p-4 border rounded-md bg-accent">
              {/* <div className="flex flex-col sm:flex-row items-center justify-between"> */}
                <div className="flex justify-between">
                  <h3 className="font-medium ">Upgrade Available</h3>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90" onClick={() => router.push("/pricing")}>Upgrade to Pro</Button>
                </div>
                  <p className="text-sm mt-5 text-muted-foreground ">
                    You’re on the Free plan. Upgrade to Pro for higher limits.
                  </p>
              {/* </div> */}
            </div>
          )}
        </div>
      
          {/* Usage */}
          <section id="usage" className="mb-3">
          <h2 className="text-xl text-purple-600 font-medium mb-4">Your Usage</h2>
          <UsageStats {...profile} />

        
        </section>

        {/* Document Processing */}
{profile.subscription_tier.toLowerCase() === "teams" ? (
  <section id="process" className="mb-12">
    {clientsLoading ? (
      <p>Loading clients…</p>
    ) : userClients.length === 0 ? (
      <p className="text-sm text-muted-foreground">None</p>
    ) : (
      <>
        <h2 className="text-xl text-purple-600 font-medium mb-4">
          Document Processing
        </h2>
        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="upload">Upload & Extract</TabsTrigger>
            <TabsTrigger value="history">Processing History</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
              {selectedClient
                ? <TeamsUploadBox client={selectedClient} role={role} profile={profile} />
                : <p className="text-sm text-muted-foreground">Please select a client before uploading.</p>
              }
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <DocumentsHistorytab profileId={profile.id} />
          </TabsContent>
        </Tabs>
      </>
    )}
  </section>
) : (
  <section id="process" className="mb-12">
    <h2 className="text-xl text-purple-600 font-medium mb-4">
      Document Processing
    </h2>
    <Tabs defaultValue="upload">
      <TabsList>
        <TabsTrigger value="upload">Upload & Extract</TabsTrigger>
        <TabsTrigger value="history">Processing History</TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="mt-6">
        <UploadBox {...profile} />
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        <DocumentsHistorytab profileId={profile.id} />
      </TabsContent>
    </Tabs>
  </section>
)}


        {/* Settings */}
        <section id="Field settings" className="mb-12">
          <h2 className="text-xl text-purple-600 font-medium mb-4">Field Settings</h2>
          <p className="text-muted-foreground mb-4">
            Update Fields and Description to extract from invoices.
          </p>
          {profile.subscription_tier.toLowerCase() === "teams" ? (
            <div className="space-y-4">
              {clientsLoading ? (
                <p>Loading clients…</p>
              ) : userClients.length === 0 ? (
                // No clients for this user:
                <p className="text-sm text-muted-foreground">Your Manager yet to add clients</p>
              ) :
              
              (
                <>
                  <Select
                    onValueChange={(name) => {
                      const c = userClients.find((c) => c.client_name === name)
                      setSelectedClient(c || null)
                    }}
                    value={selectedClient?.client_name || ""}
                  >
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {userClients.map((c) => (
                        <SelectItem key={c.id} value={c.client_name}>
                          {c.client_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedClient && (
                    <ClientFieldsConfig client={selectedClient} role={role} />
                  )}
                </>
              )}
            </div>
          ) : (
          
          
          <FieldsConfig {...profile} />
          )}
        </section>
      </main>  
      </div> 
         </SidebarInset>
    </div>
  );
}
