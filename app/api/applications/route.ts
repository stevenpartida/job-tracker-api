import { applications } from "@/lib/memory";
import { NextRequest, NextResponse } from "next/server";

// GET /api/applications
export async function GET(request: NextRequest) {
  return NextResponse.json({ data: applications }, { status: 200 });
}
