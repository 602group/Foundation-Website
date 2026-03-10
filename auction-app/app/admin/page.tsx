import { db } from "@/app/lib/db";

const card = (label: string, value: number) => (
    <div key={label} style={{
        background: "#ffffff",
        border: "1px solid #e8e8e8",
        borderRadius: "12px",
        padding: "28px",
    }}>
        <div style={{
            color: "#888",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "12px",
        }}>{label}</div>
        <div style={{
            color: "#000000",
            fontSize: "40px",
            fontWeight: "900",
            lineHeight: 1,
        }}>{value}</div>
    </div>
);

export default async function AdminDashboard() {
    const userCount = await db.user.count();
    const auctionCount = await db.auction.count();
    const activeAuctionCount = await db.auction.count({ where: { status: "ACTIVE" } });
    const totalBids = await db.bid.count();

    return (
        <div style={{ padding: "40px 48px" }}>
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{
                    color: "#000000",
                    fontSize: "28px",
                    fontWeight: "900",
                    margin: "0 0 4px 0",
                    letterSpacing: "-0.5px",
                    textTransform: "uppercase",
                }}>Dashboard Overview</h1>
                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
                    Welcome back. Here's a summary of your data.
                </p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "40px",
            }}>
                {card("Total Users", userCount)}
                {card("Total Auctions", auctionCount)}
                {card("Active Auctions", activeAuctionCount)}
                {card("Total Bids", totalBids)}
            </div>

            <div style={{
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: "12px",
                padding: "28px",
            }}>
                <h2 style={{ color: "#000", fontSize: "15px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 16px 0" }}>
                    Quick Actions
                </h2>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {[
                        { label: "Create Auction", href: "/admin/auctions" },
                        { label: "View Users", href: "/admin/users" },
                        { label: "Manage Content", href: "/admin/content" },
                    ].map((action) => (
                        <a key={action.label} href={action.href} style={{
                            padding: "9px 20px",
                            background: "#000000",
                            border: "2px solid #000000",
                            borderRadius: "25px",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: "700",
                            textDecoration: "none",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}>
                            {action.label}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
