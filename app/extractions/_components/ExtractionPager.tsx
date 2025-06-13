// app/extractions/_components/ExtractionPager.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ExtractionPagerProps {
  items: Record<string, string | number>[];
  pageSize?: number;
}

export default function ExtractionPager({
  items,
  pageSize = 1,
}: ExtractionPagerProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(items.length / pageSize);

  const start = page * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  if (items.length === 0) {
    return <span className="text-gray-500">—</span>;
  }

  return (
    <div>
      <table className="w-full border-collapse mb-2">
        <thead>
          <tr>
            {Object.keys(pageItems[0]).map((key) => (
              <th key={key} className="border px-2 py-1 text-left">
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageItems.map((item, i) => (
            <tr key={i}>
              {Object.values(item).map((v, j) => (
                <td key={j} className="border px-2 py-1">
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-end space-x-2 text-sm">
          <Button
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </Button>
          <span className="self-center">
            {page + 1} / {totalPages}
          </span>
          <Button
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
