export const dynamic = 'force-dynamic';
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/app/lib/db";
import BiddingInterface from "./BiddingInterface";
import "./auction-round.css";

export default async function AuctionPage({
    params,
}: {
    params: { id: string };
}) {
    const auction = await db.auction.findUnique({
        where: { id: params.id },
        include: {
            bids: {
                orderBy: { amount: "desc" },
                take: 1,
            },
        },
    });

    if (!auction) {
        return notFound();
    }

    const currentHighestBid =
        auction.bids.length > 0 ? auction.bids[0].amount : auction.currentBid;

    return (
        <div className="pt-24">
            <section className="auction-hero">
                <Link href="/auctions" className="back-to-auctions">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                    Back to All Auctions
                </Link>
                <div className="hero-container">
                    <div className="main-image-container">
                        <img
                            src={auction.images[0] || "/hero.png"}
                            alt={auction.title}
                            className="main-image"
                        />
                    </div>

                    <div className="side-images-container">
                        <div className="side-image">
                            <img src={auction.images[1] || "/hero.png"} alt="Golf Course View 1" />
                        </div>
                        <div className="side-image">
                            <img src={auction.images[2] || "/hero.png"} alt="Golf Course View 2" />
                            <button className="view-more-btn">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    style={{ width: "20px", height: "20px", marginRight: "8px" }}
                                >
                                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                </svg>
                                View photos
                            </button>
                        </div>
                    </div>

                    {/* This is the dynamic interactive bidding component */}
                    <BiddingInterface
                        auctionId={auction.id}
                        initialHighestBid={currentHighestBid}
                        endDate={auction.endDate}
                        status={auction.status}
                        buyoutPrice={auction.buyoutPrice}
                    />
                </div>
            </section>

            <section className="auction-info">
                <div className="info-container">
                    <div className="info-main">
                        <h1>{auction.title}</h1>

                        <div className="auction-meta">
                            <span className="location">
                                <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                {auction.location}
                            </span>
                            <span className="date">
                                <svg className="meta-icon" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                                </svg>
                                Ends: {auction.endDate.toDateString()}
                            </span>
                        </div>

                        <div className="item-details-section">
                            <h2>Item Details</h2>
                            <p className="section-intro whitespace-pre-wrap">{auction.description}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
