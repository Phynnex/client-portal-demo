export function exportElementAsPDF(element: HTMLElement) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(`<html><head><title>Report</title></head><body>${element.innerHTML}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

export function exportElementAsPNG(element: HTMLElement, fileName = 'report.png') {
  const svg = element.querySelector('svg');
  if (!svg) return;
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const bbox = svg.getBoundingClientRect();
  canvas.width = bbox.width;
  canvas.height = bbox.height;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.onload = () => {
    ctx?.drawImage(img, 0, 0);
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}

export function exportToCSV<T extends Record<string, unknown>>(data: T[], fileName = 'data.csv') {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => String(row[h] ?? '')).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
