export function parseCsvContent(csvContent: string) {
  const trimmed = csvContent.trim();

  if (!trimmed) {
    return [];
  }

  const [headerLine, ...lines] = trimmed.split(/\r?\n/);
  const headers = headerLine.split(",").map((entry) => entry.trim());

  return lines.filter(Boolean).map((line) => {
    const values = line.split(",").map((entry) => entry.trim());

    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = values[index] ?? "";
      return acc;
    }, {});
  });
}
