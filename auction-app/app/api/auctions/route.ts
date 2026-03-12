/**
 * Auctions API  —  POST (create) / GET (list)
 *
 * POST /api/auctions
 *   Creates a new auction. Auto-generates internalId (AUC-XXXX).
 *   Rejects with 409 if gsItemId already exists in DB (dedup).
 *
 * GET /api/auctions
 *   Returns all auctions for the admin panel.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

const prisma = db;

// ── internalId generator: AUC-0001 … AUC-9999 … AUC-10000 ──────────────────
async function generateInternalId(): Promise<string> {
  const last = await prisma.auction.findFirst({
    orderBy: { internalId: 'desc' },
    select: { internalId: true },
  });
  let next = 1;
  if (last?.internalId) {
    const num = parseInt(last.internalId.replace('AUC-', ''), 10);
    if (!isNaN(num)) next = num + 1;
  }
  return `AUC-${String(next).padStart(4, '0')}`;
}

// ── POST — Create auction ────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { title, description, location, images, startingBid, buyoutPrice, endDate,
          gsItemUrl, gsItemId, gsEventId } = body as Record<string, string>;

  if (!title || !endDate) {
    return NextResponse.json({ error: 'title and endDate are required.' }, { status: 400 });
  }

  // Duplicate check — same GiveSmart item should never appear twice
  if (gsItemId) {
    const existing = await prisma.auction.findFirst({ where: { gsItemId } });
    if (existing) {
      return NextResponse.json(
        { error: `Duplicate: GiveSmart item ${gsItemId} is already linked to auction ${existing.internalId}.` },
        { status: 409 }
      );
    }
  }

  const internalId = await generateInternalId();

  const auction = await prisma.auction.create({
    data: {
      internalId,
      title,
      description: description ?? '',
      location: location ?? '',
      images: Array.isArray(images) ? images : [],
      startingBid: parseFloat(String(startingBid ?? '0')),
      buyoutPrice: buyoutPrice ? parseFloat(String(buyoutPrice)) : null,
      endDate: new Date(endDate),
      gsItemUrl: gsItemUrl ?? null,
      gsItemId: gsItemId ?? null,
      gsEventId: gsEventId ?? null,
      gsLastSynced: gsItemUrl ? new Date() : null,
    },
  });

  return NextResponse.json(auction, { status: 201 });
}

// ── GET — List auctions ──────────────────────────────────────────────────────
export async function GET() {
  const auctions = await prisma.auction.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      internalId: true,
      title: true,
      location: true,
      status: true,
      startingBid: true,
      currentBid: true,
      endDate: true,
      images: true,
      gsItemUrl: true,
      gsItemId: true,
      gsEventId: true,
      gsLastSynced: true,
      createdAt: true,
    },
  });
  return NextResponse.json(auctions);
}
