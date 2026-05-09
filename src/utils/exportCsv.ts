export function exportToCsv(filename: string, rows: any[]) {
  if (!rows || rows.length === 0) {
    alert("Aucune donnée à exporter");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csvContent = [
    headers.join(";"),
    ...rows.map(row =>
      headers.map(field => {
        const value = row[field] ?? "";
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(";")
    )
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
