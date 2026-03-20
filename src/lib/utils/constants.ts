import type { LucideIcon } from "lucide-react";
import {
  Music,
  Trophy,
  Palette,
  UtensilsCrossed,
  Cpu,
  Briefcase,
  Users,
  Trees,
} from "lucide-react";
import type { EventCategory } from "@/lib/types";

export const CATEGORY_ICONS: Record<EventCategory, LucideIcon> = {
  music: Music,
  sports: Trophy,
  arts: Palette,
  food: UtensilsCrossed,
  tech: Cpu,
  business: Briefcase,
  community: Users,
  outdoor: Trees,
};

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  music: "Музыка",
  sports: "Спорт",
  arts: "Искусство и культура",
  food: "Еда и напитки",
  tech: "Технологии",
  business: "Бизнес",
  community: "Сообщество",
  outdoor: "На открытом воздухе",
};

export const CATEGORY_MARKER_COLORS: Record<EventCategory, string> = {
  music: "#9333ea",
  sports: "#16a34a",
  arts: "#db2777",
  food: "#ea580c",
  tech: "#2563eb",
  business: "#4b5563",
  community: "#ca8a04",
  outdoor: "#059669",
};

export const CATEGORY_ICON_COLORS: Record<EventCategory, string> = {
  music: "text-[#9333ea]",
  sports: "text-[#16a34a]",
  arts: "text-[#db2777]",
  food: "text-[#ea580c]",
  tech: "text-[#2563eb]",
  business: "text-[#4b5563]",
  community: "text-[#ca8a04]",
  outdoor: "text-[#059669]",
};

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  music: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  sports: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  arts: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  tech: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  business: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  community: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  outdoor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
};

export const APP_NAME = "local.events";
export const APP_DESCRIPTION = "Пульс событий вокруг вас";
