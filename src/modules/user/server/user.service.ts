import { eq } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";

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
