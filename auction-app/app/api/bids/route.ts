import { NextResponse } from "next/server";
import { auth } from  "@/app/lib/auth";
import { db } from  "@/app/lib/db";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session?.user) {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
                status: 401,
            });
        }

        const { amount, auctionId } = await req.json();

        if (!amount || !auctionId) {
            return new NextResponse(JSON.stringify({ message: "Missing fields" }), {
                status: 400,
            });
        }

        // Wrap in a transaction to prevent race conditions
        const result = await db.$transaction(async (tx: any) => {
            const auction = await tx.auction.findUnique({
                where: { id: auctionId },
                include: {
                    bids: {
                        orderBy: { amount: "desc" },
                        take: 1,
                    },
                },
            });

            if (!auction) throw new Error("Auction not found");
            if (auction.status !== "ACTIVE") throw new Error("Auction is closed");

            const currentHighest =
                auction.bids.length > 0 ? auction.bids[0].amount : auction.currentBid;

            if (amount <= currentHighest) {
                throw new Error(`Bid must be higher than current highest bid of $${currentHighest}`);
            }

            const newBid = await tx.bid.create({
                data: {
                    amount: amount,
                    userId: session.user.id,
                    auctionId: auction.id,
                },
            });

            await tx.auction.update({
                where: { id: auction.id },
                data: { currentBid: amount },
            });

            return newBid;
        });

        return NextResponse.json(result);
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ message: error.message || "Internal Server Error" }),
            { status: 500 }
        );
    }
}
