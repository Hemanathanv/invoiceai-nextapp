import { LogsTable } from "@/app/admin/_components/logs/logs-table"
import { LogsTableToolbar } from "@/app/admin/_components/logs/logs-table-toolbar"

export default async function LogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Supabase Logs</h1>
      </div>
      <LogsTableToolbar />
      <LogsTable />
    </div>
  )
}
