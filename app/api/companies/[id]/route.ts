import { companies, applications, contacts } from "@/lib/memory";
import { NextRequest, NextResponse } from "next/server";

// GET /api/companies/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
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

  const company = companies[index];
  return NextResponse.json({ data: company }, { status: 200 });
}

// PATCH /api/companies/:id

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  const body = await request.json();

  // Validate: company exists
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

  // Update: spread existing, apply changes, protect server fields
  const company = companies[index];
  const updatedCompany = {
    ...company,
    ...body,
    id: company.id,
    createdAt: company.createdAt,
    updatedAt: new Date().toISOString(),
  };

  companies[index] = updatedCompany;

  return NextResponse.json({ data: updatedCompany }, { status: 200 });
}

// DELETE /api/companies/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  // Validate: company exists
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

  // Cascade delete: remove associated records
  for (let i = applications.length - 1; i >= 0; i--) {
    if (applications[i].companyId === id) applications.splice(i, 1);
  }
  for (let i = contacts.length - 1; i >= 0; i--) {
    if (contacts[i].companyId === id) contacts.splice(i, 1);
  }

  // Remove the company
  companies.splice(index, 1);

  // 204 No Content — successful deletion, no body
  return new NextResponse(null, { status: 204 });
}
