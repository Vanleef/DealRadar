import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "../../../db";
import { profiles, savedGames } from "../../../db/schema";

async function currentEmail() {
  const h = await headers();
  return h.get("oai-authenticated-user-email");
}

export async function GET() {
  const email = await currentEmail();
  if (!email) return Response.json({ error: "authentication required" }, { status: 401 });
  const db = await getDb();
  await db.insert(profiles).values({ email }).onConflictDoNothing();
  const [profile] = await db.select().from(profiles).where(eq(profiles.email, email));
  const games = await db.select().from(savedGames).where(eq(savedGames.email, email));
  return Response.json({ profile, games });
}

export async function PATCH(request: Request) {
  const email = await currentEmail();
  if (!email) return Response.json({ error: "authentication required" }, { status: 401 });
  const body = await request.json() as { displayName?: string; currency?: string; language?: string; dealAlerts?: boolean };
  const db = await getDb();
  await db.insert(profiles).values({ email }).onConflictDoNothing();
  await db.update(profiles).set({
    ...(body.displayName ? { displayName: body.displayName.slice(0, 80) } : {}),
    ...(body.currency && ["BRL", "USD", "EUR"].includes(body.currency) ? { currency: body.currency } : {}),
    ...(body.language ? { language: body.language.slice(0, 10) } : {}),
    ...(typeof body.dealAlerts === "boolean" ? { dealAlerts: body.dealAlerts } : {}),
    updatedAt: new Date().toISOString(),
  }).where(eq(profiles.email, email));
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const email = await currentEmail();
  if (!email) return Response.json({ error: "authentication required" }, { status: 401 });
  const body = await request.json() as { gameId?: number; state?: "favorite" | "interested"; active?: boolean };
  if (!body.gameId || !body.state || !["favorite", "interested"].includes(body.state)) return Response.json({ error: "invalid saved game" }, { status: 400 });
  const db = await getDb();
  await db.insert(profiles).values({ email }).onConflictDoNothing();
  if (body.active === false) await db.delete(savedGames).where(and(eq(savedGames.email,email),eq(savedGames.gameId,body.gameId),eq(savedGames.state,body.state)));
  else await db.insert(savedGames).values({ email, gameId: body.gameId, state: body.state }).onConflictDoNothing();
  return Response.json({ ok: true });
}
