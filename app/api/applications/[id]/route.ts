import { NextRequest, NextResponse } from "next/server";
import { applications } from "@/lib/memory";

// PATCH /api/companies/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const index = applications.findIndex((a) => a.id === id);
  if (index === -1) {
    return NextResponse.json(
      {
        error: {
          message: `Application with id: ${id} was not found`,
          code: "NOT_FOUND",
          status: 404,
        },
      },
      { status: 404 },
    );
  }

  if (Object.keys(body).length === 0) {
    return NextResponse.json(
      {
        error: {
          message: "Request body cannot be empty",
          code: "EMPTY_BODY",
          status: 400,
        },
      },
      { status: 400 },
    );
  }

  const application = applications[index];
  const updatedApplication = {
    ...application,
    ...body,
    id: application.id,
    companyId: application.companyId,
    createdAt: application.createdAt,
    updatedAt: new Date().toISOString(),
  };

  applications[index] = updatedApplication;

  return NextResponse.json({ data: updatedApplication }, { status: 200 });
}
