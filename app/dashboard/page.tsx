// Name: V.Hemanathan
// Describe: Application Dashboard. main page of the application where we upload and process the files.
// Framework: Next.js -15.3.2 


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UsageStats from "@/app/dashboard/_components/UsageStats";
import UploadBox from "@/app/dashboard/_components/UploadBox";
import { useUserProfile } from "@/hooks/useUserProfile";
import Sidebar from "@/app/dashboard/_components/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FieldsConfig from "./_components/FieldsConfig";

export default function DashboardPage() {
  // 1) Always call hooks at top level
  const { profile, loading } = useUserProfile();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<
    "overview" | "usage" | "process" | "Field settings"
  >("overview");

  // 2) Redirect if not authenticated
  useEffect(() => {
    if (!loading && !profile) {
      router.replace("/login");
    }
  }, [profile, loading, router]);

  // 3) Track URL hash to highlight sidebar item
  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash.replace("#", "") as
        | "overview"
        | "usage"
        | "process"
        | "Field settings";

      if (["overview", "usage", "process", "Field settings"].includes(hash)) {
        setCurrentSection(hash);
      }
    }

    onHashChange();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // 4) While loading or redirecting, show spinner
  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // 5) Now render sidebar + main content
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar currentSection={currentSection} />

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Overview */}
        <div className="w-full flex justify-between">
          
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
          <UsageStats />

        
        </section>

        {/* Document Processing */}
        <section id="process" className="mb-12">
          <h2 className="text-xl text-purple-600 font-medium mb-4">Document Processing</h2>
          <Tabs defaultValue="upload">
            <TabsList>
              <TabsTrigger value="upload">Upload & Extract</TabsTrigger>
              <TabsTrigger value="history">Processing History</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              <UploadBox />
              
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="text-center py-16 border rounded-md bg-muted/20">
                <h3 className="text-lg font-medium mb-2">No processing history yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload and process documents to see them here.
                </p>
                <Button variant="outline" onClick={() => (window.location.hash = "#process")}>
                  Upload Documents
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Settings */}
        <section id="Field settings" className="mb-12">
          <h2 className="text-xl text-purple-600 font-medium mb-4">Field Settings</h2>
          <p className="text-muted-foreground mb-4">
            Update Fields and Description to extract from invoices.
          </p>
          <FieldsConfig />
        </section>
      </main>
    </div>
  );
}
