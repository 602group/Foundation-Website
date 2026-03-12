/**
 * Single Auction API  —  GET / PATCH
 *
 * GET  /api/auctions/:id  → full auction record (includes GiveSmart fields)
 * PATCH /api/auctions/:id → update any auction fields, including GiveSmart mapping
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db';

const prisma = db;

type Params = { params: Promise<{ id: string }> };

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const auction = await prisma.auction.findUnique({ where: { id } });
  if (!auction) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(auction);
}

// ── PATCH ────────────────────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  // If updating gsItemId, ensure no duplicate
  if (body.gsItemId) {
    const existing = await prisma.auction.findFirst({
      where: { gsItemId: String(body.gsItemId), NOT: { id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: `Duplicate: GiveSmart item ${body.gsItemId} is already linked to ${existing.internalId}.` },
        { status: 409 }
      );
    }
  }

  // Build update payload — only include fields present in body
  const data: Record<string, unknown> = {};
  const allowed = ['title', 'description', 'location', 'images', 'startingBid',
                   'currentBid', 'buyoutPrice', 'endDate', 'status',
                   'gsItemUrl', 'gsItemId', 'gsEventId'];
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }
  if (body.endDate) data.endDate = new Date(String(body.endDate));
  if (body.startingBid) data.startingBid = parseFloat(String(body.startingBid));
  if (body.currentBid)  data.currentBid  = parseFloat(String(body.currentBid));
  if (body.buyoutPrice) data.buyoutPrice  = parseFloat(String(body.buyoutPrice));

  // Update gsLastSynced whenever GS fields change
  if (body.gsItemUrl || body.gsItemId || body.gsEventId) {
    data.gsLastSynced = new Date();
  }

  const updated = await prisma.auction.update({ where: { id }, data });
  return NextResponse.json(updated);
}

// ── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await prisma.auction.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
