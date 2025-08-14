"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoicesTable } from "./InvoicesTable"
import { InvoiceToolbar } from "./InvoiceToolbar"
import { useOrgNameFromId, useInvoiceCounts } from "../service/extraction.service"
import { Badge } from "@/components/ui/badge"
import { useUserProfile } from "@/hooks/useUserProfile"
import { HoldTable } from "./HoldTable"
import { DuplicateTable } from "./DuplicateTable"
import { ApprovedTable } from "./ApprovedTable"
import { toast } from "sonner"
import { fetchInvoicesFromDb, useClientConnection } from "../service/insert.service"
import { ConnectionAction } from "@/types/invoice"
import { buildAvailableColumns, exportCSV,  UseInvoicesParams } from "../service/exportCSV.service"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import LoadingScreen from "@/components/LoadingScreen"

type TabType = "ai-results" | "hold" | "duplicate" | "approved"



export function InvoiceTabs() {
  // 1) All hooks unconditionally at the top:
  const { data: profile, isLoading} = useUserProfile();
  const userId  = profile?.id
  const [activeTab, setActiveTab] = useState<TabType>("ai-results")
  const [dateRange, setDateRange] = useState({
    from: new Date(), 
    to: new Date(),
  })
  const [searchTerm, setSearchTerm] = useState("")
  // const [selectedClient, setSelectedClient] = useState("all")
  const [selectedClient, setSelectedClient] = useState<string>("")


  

  // Mock current org — replace with real from profile or another hook
  const { data } = useOrgNameFromId(userId ?? "")
  const currentOrg: string = data?.org_name ?? "" 
  const currentOrgId: string = data?.org_id ?? ""
  const isTeamsManager: boolean = (data?.role ?? "").toLowerCase() === "manager";
  const queryClient = useQueryClient();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [availableCols, setAvailableCols] = useState<string[]>([]);
  const [selectedCols, setSelectedCols] = useState<Record<string, boolean>>({});
  const [loadingCols, setLoadingCols] = useState(false);

  // only start fetching counts once we know our userId
  const { data: counts, isLoading: countsLoading } = useInvoiceCounts(userId ?? "",  selectedClient, isTeamsManager, currentOrgId)
// Handlers must be declared before used
const openExportModal = async () => {
  setExportModalOpen(true);
  setLoadingCols(true);
  try {
    const params: UseInvoicesParams = {
      userId: userId ?? "",
      status: activeTab === "approved" ? "approved" : null,
      dateRange,
      searchTerm,
      selectedClient,
      page: 1,
      pageSize: 1000,
      isTeamsManager
    };
    // fetch rows (uses cache if present)
    const rows = await queryClient.fetchQuery({
      queryKey: ["invoices", params],
      queryFn: () => fetchInvoicesFromDb(params),
      staleTime: 30000,
    });

    const { allColumns } = buildAvailableColumns(rows);
    setAvailableCols(allColumns);
    // default select all
    const m: Record<string, boolean> = {};
    allColumns.forEach(c => m[c] = true);
    setSelectedCols(m);
  } catch (err) {
    console.error("Failed to load columns", err);
    toast.error("Failed to prepare export columns");
    setExportModalOpen(false);
  } finally {
    setLoadingCols(false);
  }
};

const toggleCol = (col: string) => setSelectedCols(s => ({ ...s, [col]: !s[col] }));

const handleExportConfirm = async () => {
  const chosen = Object.keys(selectedCols).filter(c => selectedCols[c]);
  try {
    toast("Preparing export…");
    const params: UseInvoicesParams = {
      userId: userId ?? "",
      status: "approved",
      dateRange,
      searchTerm,
      selectedClient,
      page: 1,
      pageSize: 1000,
      isTeamsManager
    };
    await exportCSV(params, queryClient, chosen);
    toast.success("Export download started.");
  } catch (err) {
    // console.error("Export failed", err);
    if (err instanceof Error){
      toast.error(err?.message ?? "Export failed");
    }
    
  } finally {
    setExportModalOpen(false);
  }
};

const handleSendToZoho = async () => {
if (activeTab !== "approved") return
// const rows = approvedExporterRef?.getVisibleRows?.()
toast.success("Sending to Zoho Books")
}


const isTeams = profile?.subscription_tier === "Teams";
const isApprovedTab = activeTab === "approved";
const clientIdForConn = isTeams ? (selectedClient || undefined) : "";

const { data: clientDbConnection } = useClientConnection(
  userId ?? "",
  currentOrgId,
  clientIdForConn ?? ""
  );


const action: ConnectionAction =
!isApprovedTab
? { kind: "none" }
: isTeams
? (
// Teams: require client selection; then use connection to decide.
!selectedClient
? { kind: "none" }
: clientDbConnection === "excel"
? { kind: "excel", onClick: openExportModal }
: clientDbConnection === "zoho"
? { kind: "zoho", onClick: handleSendToZoho }
: { kind: "none" }
)
: (
// Non-Teams: default to Excel regardless of client
{ kind: "excel", onClick: openExportModal }
);

  

  // console.log("client", selectedClient)
  // 2) Early return if we can't render yet:
  if (isLoading || !userId) {
    return <LoadingScreen />;
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
              action={action}
              profile={profile}
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
                      isTeamsManager={isTeamsManager}
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
                      isTeamsManager={isTeamsManager}
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
                      isTeamsManager={isTeamsManager}
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
                      isTeamsManager={isTeamsManager}
                    />
                  )}
                </>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {exportModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded p-6 w-[720px] max-h-[80vh] overflow-auto">
      <h3 className="text-lg font-semibold mb-3">Select columns to export</h3>

      {loadingCols ? (
        <div>Loading…</div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {availableCols.map(col => (
            <label key={col} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!selectedCols[col]}
                onChange={() => toggleCol(col)}
              />
              <span className="text-sm">{col}</span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setExportModalOpen(false)}>Cancel</Button>
        <Button onClick={handleExportConfirm}>Export selected</Button>
      </div>
    </div>
  </div>
)}

    </div>
  )
}
