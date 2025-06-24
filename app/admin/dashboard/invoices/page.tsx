import { InvoicesTable } from "@/app/admin/_components/invoices/invoices-table";
import { InvoicesTableToolbar } from "@/app/admin/_components/invoices/invoices-table-toolbar";


export default async function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoice Documents</h1>
      </div>
      <InvoicesTableToolbar />
      <InvoicesTable />
    </div>
  )
}
