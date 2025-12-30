import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("SuperSecretPassword123", 10);

  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: passwordHash,
      email: "admin@example.com",
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
