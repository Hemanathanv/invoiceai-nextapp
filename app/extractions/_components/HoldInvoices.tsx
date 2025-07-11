import React from "react";
import { ExtractionRecord } from "@/types/invoice";

interface HoldInvoicesProps {
  docs: ExtractionRecord[];
}

const HoldInvoices: React.FC<HoldInvoicesProps> = ({ docs }) => {
  const holdDocs = docs.filter(doc => doc.status === "hold");

  return (
    <div>
      {holdDocs.length === 0 ? (
        <p>No hold invoices.</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 sticky top-0">
              <th className="border px-4 py-2 text-left">File Name</th>
              <th className="border px-4 py-2 text-left">Invoice Number</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {holdDocs.map((doc, idx) => (
              <tr key={doc.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-4 py-2">{doc.file_name}</td>
                <td className="border px-4 py-2">{(doc as any).invoice_number || "-"}</td>
                <td className="border px-4 py-2">{doc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HoldInvoices; 