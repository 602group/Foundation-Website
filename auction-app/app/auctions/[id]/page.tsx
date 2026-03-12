export const dynamic = 'force-dynamic';
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/app/lib/db";
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

                    {/* ── GiveSmart bidding panel ─────────────────────────── */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        minWidth: '280px',
                    }}>
                        {/* Internal ID badge */}
                        {auction.internalId && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6d28d9', background: '#ede9fe', borderRadius: '6px', padding: '2px 8px', width: 'fit-content' }}>
                                {auction.internalId}
                            </span>
                        )}

                        {/* Starting bid */}
                        {auction.startingBid > 0 && (
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting Bid</div>
                                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111' }}>
                                    ${auction.startingBid.toLocaleString()}
                                </div>
                            </div>
                        )}

                        {/* Status / CTA */}
                        {auction.status === 'CLOSED' ? (
                            <div style={{
                                background: '#f3f4f6', color: '#6b7280',
                                borderRadius: '12px', padding: '1rem 1.5rem',
                                textAlign: 'center', fontWeight: 700, fontSize: '1rem',
                                border: '2px solid #e5e7eb',
                            }}>
                                ⛔ This auction is closed
                            </div>
                        ) : auction.gsItemUrl ? (
                            <a
                                href={auction.gsItemUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'block', textAlign: 'center',
                                    background: '#16a34a', color: '#fff',
                                    borderRadius: '12px', padding: '1rem 1.5rem',
                                    fontWeight: 800, fontSize: '1.05rem',
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 12px rgba(22,163,74,0.35)',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#15803d')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#16a34a')}
                            >
                                ⛳ Bid Now on GiveSmart
                            </a>
                        ) : (
                            <div style={{
                                background: '#fef9c3', color: '#a16207',
                                borderRadius: '12px', padding: '1rem 1.5rem',
                                textAlign: 'center', fontWeight: 600, fontSize: '0.9rem',
                                border: '1px solid #fde68a',
                            }}>
                                🕐 Bidding opens soon
                            </div>
                        )}

                        <p style={{ fontSize: '0.73rem', color: '#aaa', margin: 0, textAlign: 'center' }}>
                            Bidding is handled securely on GiveSmart
                        </p>
                    </div>

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
