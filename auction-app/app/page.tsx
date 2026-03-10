export const dynamic = 'force-dynamic';
import Link from "next/link";
import { db } from "@/app/lib/db";

export default async function Home() {
  const auctions = await db.auction.findMany({
    where: { status: "ACTIVE" },
    orderBy: { endDate: "asc" },
    take: 8,
  });

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              SWING FOR CHARITY.
              <span className="hero-subtitle">PLAY LIKE A PRO.</span>
            </h1>
            <Link href="/auctions" style={{ textDecoration: "none" }}>
              <button className="cta-button">View all Auctions</button>
            </Link>
          </div>
        </div>

        <a href="#auctions" className="explore-more">
          <span className="explore-text">Explore More</span>
          <svg
            className="arrow-down"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M12 19L19 12M12 19L5 12"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </section>

      <section className="auction-section" id="auctions">
        <h2 className="section-title">Active Auctions</h2>
        <div className="cards-grid">
          {auctions.map((auction) => (
            <Link
              href={`/auctions/${auction.id}`}
              className="auction-card-link"
              key={auction.id}
            >
              <div className="auction-card">
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
                  <p className="card-bids">Ends: {auction.endDate.toDateString()}</p>
                  <div className="card-footer">
                    <div className="price-info">
                      <span className="current-bid">
                        ${auction.currentBid.toLocaleString()}
                      </span>
                      <span className="bid-label">Current Bid</span>
                    </div>
                    {auction.buyoutPrice && (
                      <button className="buy-now-btn">
                        ${auction.buyoutPrice.toLocaleString()} Buy it Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {auctions.length === 0 && (
            <p style={{ color: "black", padding: "2rem 0" }}>
              No active auctions at the moment.
            </p>
          )}
        </div>

        <div className="view-all-container">
          <Link href="/auctions" style={{ textDecoration: "none" }}>
            <button className="view-all-btn">View All Auctions</button>
          </Link>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <h2 className="about-title">About EPIC Foundation</h2>
          <p className="about-description">
            We create once-in-a-lifetime golf experiences at the world's most
            exclusive courses while raising funds for charitable causes. Every
            auction supports our mission to make a meaningful impact through the
            game we love.
          </p>
          <div className="about-features">
            <div className="feature-item">
              <h3 className="feature-title">Exclusive Access</h3>
              <p className="feature-text">
                Play legendary courses like Augusta National, Pebble Beach, and
                Pine Valley
              </p>
            </div>
            <div className="feature-item">
              <h3 className="feature-title">Charitable Impact</h3>
              <p className="feature-text">
                100% of proceeds support our partner charities and community
                programs
              </p>
            </div>
            <div className="feature-item">
              <h3 className="feature-title">Unforgettable Experiences</h3>
              <p className="feature-text">
                Create memories that last a lifetime with rounds at dream
                destinations
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="email-signup-section">
        <div className="email-signup-overlay">
          <div className="email-signup-content">
            <h2 className="email-signup-title">Sign up for our email list!</h2>
            <p className="email-signup-description">
              Email subscribers get early access to all of our amazing charity
              golf auctions
            </p>
            <form className="email-signup-form">
              <input
                type="email"
                className="email-input"
                placeholder="Your email address"
                required
              />
              <button type="submit" className="subscribe-btn">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
