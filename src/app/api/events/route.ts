import { NextRequest, NextResponse } from "next/server";
import { getEvents, getEventById } from "@/lib/dal/events";
import type { EventCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ids = searchParams.get("ids");

  if (ids) {
    const idList = ids.split(",");
    const events = await Promise.all(idList.map((id) => getEventById(id)));
    return NextResponse.json(events.filter(Boolean));
  }

  const query = searchParams.get("q") ?? undefined;
  const category = (searchParams.get("category") as EventCategory) ?? undefined;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;
  const events = await getEvents({ query, category, dateFrom, dateTo });
  return NextResponse.json(events);
}
