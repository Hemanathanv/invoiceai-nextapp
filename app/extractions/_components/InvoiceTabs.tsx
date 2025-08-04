"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesTable } from "./InvoicesTable"
import { InvoiceToolbar } from "./InvoiceToolbar"
import { getOrgNameFromId, useInvoiceCounts } from "../service/extraction.service"
import { Badge } from "@/components/ui/badge"
import { useUserProfile } from "@/hooks/useUserProfile"
import { HoldTable } from "./HoldTable"
import { DuplicateTable } from "./DuplicateTable"
import { ApprovedTable } from "./ApprovedTable"

type TabType = "ai-results" | "hold" | "duplicate" | "approved"

export function InvoiceTabs() {
  // 1) All hooks unconditionally at the top:
  const { profile, loading: profileLoading } = useUserProfile()
  const userId = profile?.id

  const [activeTab, setActiveTab] = useState<TabType>("ai-results")
  const [dateRange, setDateRange] = useState({
    from: new Date(), 
    to: new Date(),
  })
  const [searchTerm, setSearchTerm] = useState("")
  // const [selectedClient, setSelectedClient] = useState("all")
  const [selectedClient, setSelectedClient] = useState<string>("")


  // only start fetching counts once we know our userId
  const { data: counts, isLoading: countsLoading } = useInvoiceCounts(userId ?? "")

  // Mock current org — replace with real from profile or another hook
  const { data } = getOrgNameFromId(userId ?? "")
  const currentOrg: string = data?.org_name ?? "" 
  const currentOrgId: string = data?.org_id ?? ""

  // console.log("client", selectedClient)
  // 2) Early return if we can't render yet:
  if (profileLoading) {
    return <div>Loading profile…</div>
  }
  if (!userId) {
    return <div>No user logged in</div>
  }

  

  const tabs = [
    { id: "ai-results" as TabType, label: "AI Results", count: counts?.aiResults ?? 0, status: null },
    { id: "hold"      as TabType, label: "Hold",       count: counts?.hold      ?? 0, status: "hold" },
    { id: "duplicate" as TabType, label: "Duplicate",  count: counts?.duplicate ?? 0, status: "duplicate" },
    { id: "approved"  as TabType, label: "Approved",   count: counts?.approved  ?? 0, status: "approved" },
  ]


  return (
    <div className="w-full bg-white rounded-lg border">
      {/* Organization Label */}
      {profile.subscription_tier === "Teams" && (
      <div className="px-6 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            Organization:
          </span>
          <Badge variant="outline" className="font-semibold">
            {currentOrg}
          </Badge>
        </div>
      </div>
    )}


      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="h-auto p-0 bg-transparent rounded-none w-full justify-start">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="relative rounded-none border-b-2 border-transparent bg-transparent px-6 py-3 font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 data-[state=active]:border-blue-500 data-[state=active]:bg-white data-[state=active]:text-blue-600">
                <span className="flex items-center gap-2">
                  {tab.label}
                  <Badge className="bg-red-600 text-white rounded-full px-2 text-xs">
                    {countsLoading ? "…" : tab.count}
                  </Badge>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="p-6">
            {/* Toolbar always visible so user can select client/date */}
            <InvoiceToolbar
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              {...(profile.subscription_tier === "Teams"
                ? {
                    selectedClient,
                    onClientChange: (val: string) => {
                      setSelectedClient(val)
                      // reset to full range when new client is selected
                      setDateRange({ from: new Date(0), to: new Date() })
                    },
                  }
                : {})}
              pendingCount={countsLoading ? 0 : tab.count}
            />

            {/* Data area: only show table once client selected for Teams */}
            <div className="mt-6">
              {profile.subscription_tier === "Teams" && !selectedClient ? (
                <div className="py-12 text-center text-gray-500">Please select a client to view data.</div>
              ) : (
                <>
                  {tab.id === "ai-results" && (
                    <InvoicesTable                  
                      userId={userId}
                      tab={tab.id}
                      status={tab.status}
                      dateRange={dateRange}
                      searchTerm={searchTerm}
                      selectedClient={selectedClient}
                      currentOrg={currentOrg}
                      subscriptionTier={profile.subscription_tier}
                    />     
                  )}
                  {tab.id === "hold" && (
                    <HoldTable
                      userId={userId}
                      dateRange={dateRange}
                      searchTerm={searchTerm}
                      selectedClient={selectedClient}
                      currentOrg={currentOrg}
                      subscriptionTier={profile.subscription_tier}
                    />
                  )}
                  {tab.id === "duplicate" && (
                    <DuplicateTable
                      userId={userId}
                      dateRange={dateRange}
                      searchTerm={searchTerm}
                      selectedClient={selectedClient}
                      currentOrg={currentOrg}
                      subscriptionTier={profile.subscription_tier}
                    />
                  )}
                  {tab.id === "approved" && (
                    <ApprovedTable
                      userId={userId}
                      dateRange={dateRange}
                      searchTerm={searchTerm}
                      selectedClient={selectedClient}
                      currentOrg={currentOrg}
                      subscriptionTier={profile.subscription_tier}
                    />
                  )}
                </>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
