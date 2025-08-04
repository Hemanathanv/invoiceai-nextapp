// Name: V.Hemanathan
// Describe: This component is used to display the extractions of the user.It gets Real time data from supabase and displays it in a table format
// Framework: Next.js -15.3.2 


import { Suspense } from "react"
import { InvoiceTabs } from "./_components/InvoiceTabs"
// import { MockDataBanner } from "./components/MockDataBanner"

export default function InvoiceExtractionsPage() {
  return (
    <div className="w-full min-h-[calc(120vh-200px)]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Invoice Extractions</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and review extracted invoice data</p>
      </div>

      {/* <MockDataBanner /> */}

      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-lg" />}>
        <InvoiceTabs />
      </Suspense>
    </div>
  )
}
