import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "../../../db";
import { profiles, savedGames } from "../../../db/schema";

const MAX_BODY_BYTES = 16_384;
const ALLOWED_CURRENCIES = new Set(["BRL", "USD", "EUR"]);
const ALLOWED_LANGUAGES = new Set(["pt-BR", "en-US", "es-ES"]);

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function currentEmail() {
  const h = await headers();
  const value = h.get("oai-authenticated-user-email")?.trim().toLowerCase();
  if (!value || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null;
  return value;
}

function validateWriteRequest(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.startsWith("application/json")) return json({ error: "application/json required" }, 415);

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (!Number.isFinite(contentLength) || contentLength < 0 || contentLength > MAX_BODY_BYTES) {
    return json({ error: "request body too large" }, 413);
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return json({ error: "cross-origin request denied" }, 403);

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "invalid origin" }, 403);
  return null;
}

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? body as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const email = await currentEmail();
  if (!email) return json({ error: "authentication required" }, 401);
  const db = await getDb();
  await db.insert(profiles).values({ email }).onConflictDoNothing();
  const [profile] = await db.select().from(profiles).where(eq(profiles.email, email));
  const games = await db.select().from(savedGames).where(eq(savedGames.email, email));
  return json({ profile, games });
}

export async function PATCH(request: Request) {
  const rejected = validateWriteRequest(request);
  if (rejected) return rejected;
  const email = await currentEmail();
  if (!email) return json({ error: "authentication required" }, 401);
  const body = await readJson(request);
  if (!body) return json({ error: "invalid JSON body" }, 400);

  const displayName = typeof body.displayName === "string"
    ? body.displayName.trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, 80)
    : undefined;
  const currency = typeof body.currency === "string" && ALLOWED_CURRENCIES.has(body.currency) ? body.currency : undefined;
  const language = typeof body.language === "string" && ALLOWED_LANGUAGES.has(body.language) ? body.language : undefined;
  const dealAlerts = typeof body.dealAlerts === "boolean" ? body.dealAlerts : undefined;

  if (displayName === undefined && currency === undefined && language === undefined && dealAlerts === undefined) {
    return json({ error: "no valid fields supplied" }, 400);
  }

  const db = await getDb();
  await db.insert(profiles).values({ email }).onConflictDoNothing();
  await db.update(profiles).set({
    ...(displayName !== undefined ? { displayName } : {}),
    ...(currency !== undefined ? { currency } : {}),
    ...(language !== undefined ? { language } : {}),
    ...(dealAlerts !== undefined ? { dealAlerts } : {}),
    updatedAt: new Date().toISOString(),
  }).where(eq(profiles.email, email));
  return json({ ok: true });
}

export async function POST(request: Request) {
  const rejected = validateWriteRequest(request);
  if (rejected) return rejected;
  const email = await currentEmail();
  if (!email) return json({ error: "authentication required" }, 401);
  const body = await readJson(request);
  if (!body) return json({ error: "invalid JSON body" }, 400);

  const gameId = typeof body.gameId === "number" && Number.isSafeInteger(body.gameId) && body.gameId > 0 ? body.gameId : null;
  const state = body.state === "favorite" || body.state === "interested" ? body.state : null;
  if (!gameId || !state) return json({ error: "invalid saved game" }, 400);

  const db = await getDb();
  await db.insert(profiles).values({ email }).onConflictDoNothing();
  if (body.active === false) {
    await db.delete(savedGames).where(and(eq(savedGames.email, email), eq(savedGames.gameId, gameId), eq(savedGames.state, state)));
  } else {
    await db.insert(savedGames).values({ email, gameId, state }).onConflictDoNothing();
  }
  return json({ ok: true });
}
