import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/applications/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const application = await prisma.application.findUnique({ where: { id } });

  if (!application) {
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

  return NextResponse.json({ data: application }, { status: 200 });
}

// PATCH /api/applications/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

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

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) {
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

  const updatedApplication = await prisma.application.update({
    where: { id },
    data: {
      ...body,
      id: application.id,
      companyId: application.companyId,
      createdAt: application.createdAt,
    },
  });

  return NextResponse.json({ data: updatedApplication }, { status: 200 });
}

// DELETE /api/applications/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const application = await prisma.application.findUnique({ where: { id } });

  if (!application) {
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

  await prisma.application.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}
