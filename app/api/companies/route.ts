// app/api/users/route.ts
// import { NextRequest, NextResponse } from 'next/server';

import { NextRequest, NextResponse } from "next/server";
import { companies } from "@/lib/memory";

//  GET /api/users
// export async function GET(request: NextRequest) {
//   const users = await db.user.findMany();
//   return NextResponse.json(users);  200 by default
// }
// GET /api/companies
export async function GET(request: NextRequest) {
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

  const newCompany = {
    ...body,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  companies.push(newCompany);
  return NextResponse.json({ data: newCompany }, { status: 201 });
}
