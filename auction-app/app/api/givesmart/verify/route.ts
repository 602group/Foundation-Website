/**
 * GiveSmart Verify Endpoint  —  SERVER SIDE ONLY
 *
 * Validates that a GiveSmart item URL is reachable, using the private API
 * key stored in environment variables. The private key never leaves the server.
 *
 * POST /api/givesmart/verify
 * Body: { itemUrl: string, itemId?: string }
 * Returns: { ok: boolean, status: number, message: string }
 */

import { NextRequest, NextResponse } from 'next/server';

const GS_PRIVATE_KEY = process.env.GIVESMART_PRIVATE_KEY;
const GS_API_BASE    = process.env.GIVESMART_API_BASE ?? 'https://fundraise.givesmart.com/api/v2';

export async function POST(req: NextRequest) {
  if (!GS_PRIVATE_KEY) {
    return NextResponse.json(
      { ok: false, message: 'GiveSmart private key not configured on server.' },
      { status: 500 }
    );
  }

  let body: { itemUrl?: string; itemId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 });
  }

  const { itemUrl, itemId } = body;

  if (!itemUrl) {
    return NextResponse.json({ ok: false, message: 'itemUrl is required.' }, { status: 400 });
  }

  // Validate the URL format
  let parsed: URL;
  try {
    parsed = new URL(itemUrl);
  } catch {
    return NextResponse.json({ ok: false, message: 'itemUrl is not a valid URL.' }, { status: 400 });
  }

  // Verify the GiveSmart URL is reachable (HEAD request)
  try {
    const probe = await fetch(parsed.toString(), { method: 'HEAD', redirect: 'follow' });
    const reachable = probe.status < 400;

    // Optionally verify GS API connectivity with the private key
    const fundraiserCheck = await fetch(`${GS_API_BASE}/fundraisers`, {
      headers: {
        'Authorization': `Token token="${GS_PRIVATE_KEY}"`,
        'Accept': 'application/json',
      },
    });

    return NextResponse.json({
      ok: reachable,
      status: probe.status,
      apiConnected: fundraiserCheck.ok,
      message: reachable
        ? 'GiveSmart URL verified and reachable.'
        : `GiveSmart URL returned HTTP ${probe.status}.`,
      itemUrl,
      itemId: itemId ?? null,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, message: `Verification failed: ${(err as Error).message}` },
      { status: 502 }
    );
  }
}
