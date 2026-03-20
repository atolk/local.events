import { format, formatDistanceToNow, isAfter, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";

export function formatEventDate(dateStr: string): string {
  return format(new Date(dateStr), "EEE, d MMM yyyy", { locale: ru });
}

export function formatEventTime(dateStr: string): string {
  return format(new Date(dateStr), "HH:mm", { locale: ru });
}

export function formatEventDateRange(start: string, end?: string): string {
  const startDate = new Date(start);
  if (!end) return formatEventDate(start);
  const endDate = new Date(end);

  if (isSameDay(startDate, endDate)) {
    return `${formatEventDate(start)}, ${formatEventTime(start)} – ${formatEventTime(end)}`;
  }
  return `${formatEventDate(start)} – ${formatEventDate(end)}`;
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ru });
}

export function isUpcoming(dateStr: string): boolean {
  return isAfter(new Date(dateStr), new Date());
}
