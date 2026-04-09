import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/companies/:id/contacts
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

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

  // TODO: replace with authenticated user id when auth is implemented
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      passwordHash: "test-hash",
    },
  });

  const contact = await prisma.contact.create({
    data: {
      name: body.name,
      companyId: id,
      userId: testUser.id,
      role: body.role,
      email: body.email,
      linkedinUrl: body.linkedinUrl,
      connectionType: body.connectionType ?? "recruiter",
      notes: body.notes,
      followUpDate: body.followUpDate,
    },
  });

  return NextResponse.json({ data: contact }, { status: 201 });
}

// GET /api/companies/:id/contacts
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

  const contacts = await prisma.contact.findMany({
    where: { companyId: id },
  });

  return NextResponse.json({ data: contacts }, { status: 200 });
}
