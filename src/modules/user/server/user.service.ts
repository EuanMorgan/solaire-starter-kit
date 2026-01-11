import { and, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { account, user } from "@/db/schema";

export async function getUserStats(userId: string) {
  const [userData] = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userData) {
    throw new Error("User not found");
  }

  const accountAgeDays = Math.floor(
    (Date.now() - userData.createdAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    accountAgeDays,
    emailVerified: userData.emailVerified,
    profileComplete: Boolean(userData.name && userData.email),
  };
}

export async function userHasPassword(userId: string): Promise<boolean> {
  const [credentialAccount] = await db
    .select()
    .from(account)
    .where(
      and(
        eq(account.userId, userId),
        eq(account.providerId, "credential"),
        isNotNull(account.password),
      ),
    )
    .limit(1);

  return Boolean(credentialAccount);
}
