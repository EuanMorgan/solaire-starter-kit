import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";

export interface UserStats {
  accountAgeDays: number;
  emailVerified: boolean;
  profileComplete: boolean;
}

export async function getUserStats(userId: string): Promise<UserStats> {
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

export async function updateUser(userId: string, data: { name: string }) {
  const [updated] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, userId))
    .returning();
  return updated;
}

export async function deleteUser(userId: string) {
  await db.delete(user).where(eq(user.id, userId));
}
