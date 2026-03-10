export const dynamic = 'force-dynamic';
import Link from "next/link";
import { db } from "@/app/lib/db";
import "./auctions.css";

export default async function Auctions() {
    const auctions = await db.auction.findMany({
        orderBy: { endDate: "asc" },
    });

    return (
        <div className="auctions-container pt-32">
            <aside className="filters-sidebar">
                <div className="filters-header">
                    <h3>FILTERS</h3>
                    <button className="reset-btn">Reset</button>
                </div>

                <div className="filter-section">
                    <h4>Rankings</h4>
                    <select className="filter-select" id="rankings-select">
                        <option value="">All</option>
                        <option value="top100">Top 100</option>
                        <option value="top50">Top 50</option>
                        <option value="top25">Top 25</option>
                    </select>
                </div>

                <div className="filter-section">
                    <h4>Location by State</h4>
                    <select className="filter-select" id="location-select">
                        <option value="">All</option>
                        <option value="ca">California</option>
                        <option value="ny">New York</option>
                        <option value="fl">Florida</option>
                        <option value="ga">Georgia</option>
                        <option value="pa">Pennsylvania</option>
                        <option value="nj">New Jersey</option>
                    </select>
                </div>

                <div className="filter-section">
                    <h4>Price Range</h4>
                    <div className="price-dropdowns">
                        <select className="filter-select" id="min-price-select">
                            <option value="0">Min Price</option>
                            <option value="1000">$1,000</option>
                            <option value="5000">$5,000</option>
                        </select>
                        <div className="separator-text">to</div>
                        <select className="filter-select" id="max-price-select">
                            <option value="100000">Max Price</option>
                            <option value="5000">$5,000</option>
                            <option value="10000">$10,000</option>
                            <option value="50000">$50,000+</option>
                        </select>
                    </div>
                </div>
            </aside>

            <main className="auctions-main">
                <div className="search-bar">
                    <div className="results-count">Showing {auctions.length} Listings</div>
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="Search Course Name or Auction Title"
                            className="search-input"
                        />
                        <button className="search-btn">🔍</button>
                    </div>
                    <div className="sort-container">
                        <label>Sort By:</label>
                        <select className="sort-select">
                            <option value="ending">Ending Soonest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="newest">Newest First</option>
                        </select>
                    </div>
                </div>

                <div className="auction-cards-grid">
                    {auctions.map((auction) => (
                        <div className="auction-card" key={auction.id}>
                            <Link href={`/auctions/${auction.id}`} className="card-link-overlay" aria-label="View auction details"></Link>
                            <div
                                className="card-image"
                                style={{
                                    background: `#e0e0e0 url('${auction.images[0] || "/hero.png"
                                        }') center/cover no-repeat`,
                                }}
                            ></div>

                            <div className="card-content">
                                <h3 className="card-title">{auction.title}</h3>
                                <p className="card-location">{auction.location}</p>
                                <p className="card-bids">{auction.status === "ACTIVE" ? `Ends: ${auction.endDate.toDateString()}` : "CLOSED"}</p>

                                <div className="card-footer">
                                    <div className="price-info">
                                        <span className="current-bid">${auction.currentBid.toLocaleString()}</span>
                                        <span className="bid-label">Current Bid</span>
                                    </div>
                                    {auction.buyoutPrice && (
                                        <span className="buy-now-btn">${auction.buyoutPrice.toLocaleString()} Buy it Now</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {auctions.length === 0 && (
                        <p style={{ color: "black", padding: "2rem" }}>No active auctions found in the database.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
