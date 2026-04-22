export function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function toDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}
