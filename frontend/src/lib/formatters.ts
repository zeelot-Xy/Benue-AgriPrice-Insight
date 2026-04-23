function asUtcDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function formatCalendarDate(value: string) {
  return asUtcDate(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatWeekEnding(value: string) {
  return `Week ending ${formatCalendarDate(value)}`;
}

export function formatShortDate(value: string) {
  return asUtcDate(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
