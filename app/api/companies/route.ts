import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/companies
export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: companies }, { status: 200 });
}

// POST /api/companies
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name) {
    return NextResponse.json(
      {
        error: {
          message: "Name is required",
          code: "MISSING_FIELD",
          status: 400,
        },
      },
      { status: 400 },
    );
  }

  // Create test user
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      passwordHash: "test-hash",
    },
  });

  const company = await prisma.company.create({
    data: {
      name: body.name,
      location: body.location,
      industry: body.industry,
      websiteUrl: body.websiteUrl,
      userId: testUser.id,
    },
  });
  return NextResponse.json({ data: company }, { status: 201 });
}
