import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    // Ping database with simple query
    await db.execute(sql`SELECT 1`);

    return NextResponse.json(
      {
        status: "ok",
        timestamp,
        database: "connected",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp,
        database: "unreachable",
      },
      { status: 503 },
    );
  }
}
