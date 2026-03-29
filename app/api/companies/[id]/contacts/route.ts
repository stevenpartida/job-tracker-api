import { NextRequest, NextResponse } from "next/server";
import { companies, contacts } from "@/lib/memory";

// POST /api/companies/:id/contacts
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
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

  if (!body.name) {
    return NextResponse.json(
      {
        error: {
          message: "Contact Name is required",
          code: "MISSING_FIELD",
          status: 400,
        },
      },
      { status: 400 },
    );
  }

  const company = companies[index];

  const newContact = {
    ...body,
    id: crypto.randomUUID(),
    companyId: company.id,
    connectionType: body.connectionType || "recruiter",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  contacts.push(newContact);
  return NextResponse.json({ data: newContact }, { status: 201 });
}

// GET /api/companies/:id/contacts
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

  const companyContacts = contacts.filter((c) => c.companyId === id);

  return NextResponse.json({ data: companyContacts }, { status: 200 });
}
