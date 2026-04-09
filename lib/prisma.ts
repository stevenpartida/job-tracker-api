import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function makePrisma() {
  const connectionString = process.env.DATABASE_URL!;
  const parsed = new URL(connectionString);

  const adapter = new PrismaPg({
    host: parsed.hostname,
    port: parseInt(parsed.port),
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.slice(1),
    ssl: { rejectUnauthorized: false },
  });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof makePrisma> | undefined;
};

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
