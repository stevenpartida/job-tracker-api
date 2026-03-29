import { NextRequest, NextResponse } from "next/server";
import { companies, applications } from "@/lib/memory";

// POST /api/companies/:id/applications
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const index = companies.findIndex((c) => c.id === id);
  if (index === -1) {
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

  const company = companies[index];

  const newApplication = {
    ...body,
    id: crypto.randomUUID(),
    companyId: company.id,
    priority: body.priority || "medium",
    status: body.status || "not_applied",
    workModel: body.workModel || "on_site",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  applications.push(newApplication);
  return NextResponse.json({ data: newApplication }, { status: 201 });
}
