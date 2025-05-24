// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UsageStats from "@/components/dashboard/UsageStats";
import UploadBox from "@/components/dashboard/UploadBox";
import { useUserProfile } from "@/hooks/useUserProfile";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function DashboardPage() {
  // 1) Always call hooks at top level
  const { profile, loading } = useUserProfile();
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<
    "overview" | "usage" | "process" | "settings"
  >("overview");

  // 2) Redirect if not authenticated
  useEffect(() => {
    if (!loading && !profile) {
      router.replace("/login/sign-in");
    }
  }, [profile, loading, router]);

  // 3) Track URL hash to highlight sidebar item
  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash.replace("#", "") as
        | "overview"
        | "usage"
        | "process"
        | "settings";

      if (["overview", "usage", "process", "settings"].includes(hash)) {
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
        <section id="overview" className="mb-12">
          <h1 className="text-3xl font-bold mb-2">
            Welcome{profile.name ? `, ${profile.name}` : ""}!
          </h1>
          <p className="text-muted-foreground">
            Manage your documents and extraction requests here.
          </p>
        </section>

        {/* Usage */}
        <section id="usage" className="mb-12">
          <h2 className="text-xl font-medium mb-4">Your Usage</h2>
          <UsageStats />

          {profile.subscription_tier.toLowerCase() === "free" && (
            <div className="mt-6 p-4 border rounded-md bg-accent">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Upgrade Available</h3>
                  <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
                    You’re on the Free plan. Upgrade to Pro for higher limits.
                  </p>
                </div>
                <Button onClick={() => router.push("/pricing")}>Upgrade to Pro</Button>
              </div>
            </div>
          )}
        </section>

        {/* Document Processing */}
        <section id="process" className="mb-12">
          <h2 className="text-xl font-medium mb-4">Document Processing</h2>
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
        <section id="settings" className="mb-12">
          <h2 className="text-xl font-medium mb-4">Settings</h2>
          <p className="text-muted-foreground mb-4">
            Update account details or change your password.
          </p>
          <Button variant="outline" onClick={() => router.push("/settings")}>
            Go to Settings Page
          </Button>
        </section>
      </main>
    </div>
  );
}
