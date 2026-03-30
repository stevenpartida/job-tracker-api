import { applications } from "@/lib/memory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const byStatus: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  let withReferrals = 0;

  for (const app of applications) {
    byStatus[app.status] = (byStatus[app.status] || 0) + 1;
    byPriority[app.priority] = (byPriority[app.priority] || 0) + 1;

    if (app.referralContactId) {
      withReferrals++;
    }
  }

  return NextResponse.json(
    {
      data: {
        totalApplications: applications.length,
        byStatus,
        byPriority,
        withReferrals,
      },
    },
    { status: 200 },
  );
}
