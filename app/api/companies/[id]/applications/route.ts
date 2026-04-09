import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/companies/:id/applications
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  if (!body.roleTitle) {
    return NextResponse.json(
      {
        error: {
          message: "Role Title is required",
          code: "MISSING_FIELD",
          status: 400,
        },
      },
      { status: 400 },
    );
  }

  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) {
    return NextResponse.json(
      {
        error: {
          message: `Company with id: ${id} was not found`,
          code: "NOT_FOUND",
          status: 404,
        },
      },
      { status: 404 },
    );
  }

  //TODO: replace w/ auathenticated user id
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      passwordHash: "test-hash",
    },
  });

  const application = await prisma.application.create({
    data: {
      roleTitle: body.roleTitle,
      companyId: id,
      userId: testUser.id,
      status: body.status ?? "not_applied",
      priority: body.priority ?? "medium",
      workModel: body.workModel ?? "on_site",
      jobUrl: body.jobUrl,
      techStack: body.techStack ?? [],
      salaryMin: body.salaryMin,
      salaryMax: body.salaryMax,
      referralContactId: body.referralContactId,
      notes: body.notes,
    },
  });

  return NextResponse.json({ data: application }, { status: 201 });
}
