import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/companies/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  return NextResponse.json({ data: company }, { status: 200 });
}

// PATCH /api/companies/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  // Validate: body is not empty
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

  const company = await prisma.company.findUnique({ where: { id } });

  // Validate: company exists
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

  const updatedCompany = await prisma.company.update({
    where: { id },
    data: {
      ...body,
      id: company.id,
      createdAt: company.createdAt,
    },
  });

  return NextResponse.json({ data: updatedCompany }, { status: 200 });
}

// DELETE /api/companies/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id } });
  // Validate: company exists
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

  await prisma.company.delete({
    where: { id },
  });

  // 204 No Content — successful deletion, no body
  return new NextResponse(null, { status: 204 });
}
