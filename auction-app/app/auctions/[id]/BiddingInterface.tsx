"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BiddingInterface({
    auctionId,
    initialHighestBid,
    endDate,
    status,
    buyoutPrice,
}: {
    auctionId: string;
    initialHighestBid: number;
    endDate: Date;
    status: string;
    buyoutPrice: number | null;
}) {
    const { data: session } = useSession();
    const router = useRouter();
    const [bidding, setBidding] = useState(false);
    const [bidAmount, setBidAmount] = useState(initialHighestBid + 200);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleBid = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        if (bidAmount <= initialHighestBid) {
            setError(`Bid must be higher than $${initialHighestBid}`);
            return;
        }

        setBidding(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/bids", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: bidAmount, auctionId }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess("Bid placed successfully!");
            router.refresh(); // Refresh the page to show new bid
        } catch (err: any) {
            setError(err.message);
        } finally {
            setBidding(false);
        }
    };

    return (
        <div className="auction-details">
            <div className="time-left-section">
                <h3>Time Left</h3>
                <p className="auction-end">
                    {status === "ACTIVE"
                        ? `Ends: ${new Date(endDate).toLocaleString()}`
                        : "Auction Closed"}
                </p>
            </div>

            <div className="pricing-section">
                <div className="current-bid-display">
                    <h2>${initialHighestBid.toLocaleString()}</h2>
                    <p>Current bid</p>
                </div>
                <div className="bid-info">
                    <div className="bid-increment">
                        <span className="label">Custom Bid:</span>
                        <input
                            type="number"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(Number(e.target.value))}
                            className="mt-2 p-2 rounded text-black font-bold w-full max-w-[150px]"
                            min={initialHighestBid + 10}
                            disabled={status !== "ACTIVE"}
                        />
                    </div>
                    {buyoutPrice && (
                        <div className="buy-now-price">
                            <span className="label">Buy It Now</span>
                            <span className="value">${buyoutPrice.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {error && <p className="text-red-400 mt-2 font-bold">{error}</p>}
            {success && <p className="text-green-400 mt-2 font-bold">{success}</p>}

            <div className="action-buttons mt-4">
                {status === "ACTIVE" ? (
                    <button
                        onClick={handleBid}
                        disabled={bidding}
                        className="bid-btn w-full disabled:opacity-50"
                    >
                        {bidding ? "PLACING BID..." : "PLACE BID"}
                    </button>
                ) : (
                    <button disabled className="bid-btn w-full opacity-50 cursor-not-allowed">
                        CLOSED
                    </button>
                )}
            </div>
        </div>
    );
}
