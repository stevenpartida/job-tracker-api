import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

//GET /api/appilcations/stats
export async function GET() {
  // Total applications count
  const totalApplications = await prisma.application.count();

  // Group by status
  const statusGroup = await prisma.application.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  // Transform array into {applied: 3, not_applied: 5} shape
  const byStatus = statusGroup.reduce(
    (acc, group) => {
      acc[group.status] = group._count.status;
      return acc;
    },
    {} as Record<string, number>,
  );

  const priorityGroup = await prisma.application.groupBy({
    by: ["priority"],
    _count: { priority: true },
  });

  const byPriority = priorityGroup.reduce(
    (acc, group) => {
      acc[group.priority] = group._count.priority;
      return acc;
    },
    {} as Record<string, number>,
  );

  const withReferrals = await prisma.application.count({
    where: { referralContactId: { not: null } },
  });

  return NextResponse.json(
    {
      data: {
        totalApplications,
        byStatus,
        byPriority,
        withReferrals,
      },
    },
    { status: 200 },
  );
}
