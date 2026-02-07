export function renderBar(value: number, width = 22): string {
  const filled = Math.round((value / 100) * width);
  const empty = width - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${value}%`;
}
