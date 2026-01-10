import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { seed } from "drizzle-seed";
import { nanoid } from "nanoid";
import { db } from "./index";
import * as schema from "./schema";

const TEST_USER = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
};

async function main() {
  console.log("🌱 Starting database seed...");

  // Check if test user already exists
  const existingUser = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, TEST_USER.email))
    .limit(1);

  if (existingUser.length > 0) {
    console.log("✅ Test user already exists, skipping...");
    return;
  }

  // Hash password using better-auth's scrypt implementation
  const hashedPassword = await hashPassword(TEST_USER.password);
  const userId = nanoid();

  // Create test user
  await db.insert(schema.user).values({
    id: userId,
    email: TEST_USER.email,
    name: TEST_USER.name,
    emailVerified: true,
  });

  // Create credential account (for email/password auth)
  await db.insert(schema.account).values({
    id: nanoid(),
    userId,
    accountId: userId,
    providerId: "credential",
    password: hashedPassword,
  });

  console.log("✅ Test user created:");
  console.log(`   Email: ${TEST_USER.email}`);
  console.log(`   Password: ${TEST_USER.password}`);

  // Optionally seed some dummy posts for the test user
  await seed(db, { post: schema.post }).refine((f) => ({
    post: {
      count: 3,
      columns: {
        userId: f.valuesFromArray({ values: [userId] }),
        published: f.valuesFromArray({ values: [true] }),
      },
    },
  }));

  console.log("✅ Seeded 3 test posts");
  console.log("🌱 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
