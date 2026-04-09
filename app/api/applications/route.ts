import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/applications
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const companyId = searchParams.get("companyId");

  const applications = await prisma.application.findMany({
    where: {
      ...(status && { status }),
      ...(companyId && { companyId }),
    },
  });
  return NextResponse.json({ data: applications }, { status: 200 });
}
