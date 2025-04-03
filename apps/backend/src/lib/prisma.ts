// apps/backend/src/lib/prisma.ts
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma || new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma as PrismaClient;
}
