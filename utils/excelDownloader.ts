import * as XLSX from "xlsx";

/**
 * Converts a generic array of objects to an Excel file and triggers a download.
 * @param data - Array of typed records to export
 * @param fileName - Filename without extension
 */
export function downloadJSONAsExcel<T extends Record<string, string | number | boolean | null>>(
  data: T[],
  fileName: string
): void {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer: ArrayBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${fileName}.xlsx`;
  anchor.click();

  URL.revokeObjectURL(url);
}
