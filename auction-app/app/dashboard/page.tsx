import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignOutButton from "@/components/shared/SignOutButton";

const labelStyle: React.CSSProperties = {
    fontSize: "11px",
    fontWeight: "700",
    color: "#888",
    letterSpacing: "1.2px",
    textTransform: "uppercase" as const,
    marginBottom: "4px",
};

const valueStyle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#000",
};

const tableHeaderStyle: React.CSSProperties = {
    padding: "10px 16px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#888",
    letterSpacing: "1.2px",
    textTransform: "uppercase" as const,
    textAlign: "left" as const,
    borderBottom: "2px solid #e8e8e8",
    background: "#fafafa",
};

const tableCellStyle: React.CSSProperties = {
    padding: "13px 16px",
    fontSize: "14px",
    color: "#222",
    borderBottom: "1px solid #f0f0f0",
};

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            bids: {
                include: { auction: true },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!user) redirect("/login");

    const activeBids = user.bids.filter(b => b.auction.status === "ACTIVE");
    const pastBids = user.bids.filter(b => b.auction.status !== "ACTIVE");

    return (
        <div style={{ background: "#f5f5f5", minHeight: "100vh", paddingTop: "80px" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>

                {/* Page Header */}
                <div style={{ marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#000", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>
                            My Account
                        </h1>
                        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
                            Welcome back, {user.name || user.email}
                        </p>
                    </div>
                    <SignOutButton />
                </div>

                {/* Account Details Card */}
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "28px", marginBottom: "24px" }}>
                    <h2 style={{ fontSize: "13px", fontWeight: "800", color: "#000", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 20px 0" }}>
                        Account Details
                    </h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                        <div>
                            <div style={labelStyle}>Full Name</div>
                            <div style={valueStyle}>{user.name || "—"}</div>
                        </div>
                        <div>
                            <div style={labelStyle}>Email</div>
                            <div style={valueStyle}>{user.email}</div>
                        </div>
                        <div>
                            <div style={labelStyle}>Account Type</div>
                            <div style={{ ...valueStyle }}>
                                <span style={{
                                    padding: "3px 10px", borderRadius: "20px", fontSize: "12px",
                                    fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px",
                                    background: user.role === "ADMIN" ? "#000" : "#f0f0f0",
                                    color: user.role === "ADMIN" ? "#fff" : "#555",
                                }}>{user.role}</span>
                            </div>
                        </div>
                        <div>
                            <div style={labelStyle}>Member Since</div>
                            <div style={valueStyle}>{user.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                        </div>
                    </div>
                </div>

                {/* Active Bids */}
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden", marginBottom: "24px" }}>
                    <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0" }}>
                        <h2 style={{ fontSize: "13px", fontWeight: "800", color: "#000", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                            Active Bids <span style={{ color: "#aaa", fontWeight: "600" }}>({activeBids.length})</span>
                        </h2>
                    </div>
                    {activeBids.length > 0 ? (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Auction</th>
                                    <th style={tableHeaderStyle}>Your Bid</th>
                                    <th style={tableHeaderStyle}>Current Bid</th>
                                    <th style={tableHeaderStyle}>Ends</th>
                                    <th style={tableHeaderStyle}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeBids.map(bid => (
                                    <tr key={bid.id}>
                                        <td style={{ ...tableCellStyle, fontWeight: "600" }}>
                                            <Link href={`/auctions/${bid.auctionId}`} style={{ color: "#000", textDecoration: "underline" }}>
                                                {bid.auction.title}
                                            </Link>
                                        </td>
                                        <td style={tableCellStyle}>${bid.amount.toLocaleString()}</td>
                                        <td style={tableCellStyle}>${bid.auction.currentBid.toLocaleString()}</td>
                                        <td style={{ ...tableCellStyle, color: "#888" }}>{bid.auction.endDate.toLocaleDateString()}</td>
                                        <td style={tableCellStyle}>
                                            <span style={{
                                                padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                                                background: bid.amount >= bid.auction.currentBid ? "#000" : "#f0f0f0",
                                                color: bid.amount >= bid.auction.currentBid ? "#fff" : "#666",
                                            }}>
                                                {bid.amount >= bid.auction.currentBid ? "Leading" : "Outbid"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: "40px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>
                            You have no active bids.{" "}
                            <Link href="/auctions" style={{ color: "#000", fontWeight: "600", textDecoration: "underline" }}>Browse auctions →</Link>
                        </div>
                    )}
                </div>

                {/* Past Auctions */}
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden" }}>
                    <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f0f0f0" }}>
                        <h2 style={{ fontSize: "13px", fontWeight: "800", color: "#000", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
                            Past Auctions <span style={{ color: "#aaa", fontWeight: "600" }}>({pastBids.length})</span>
                        </h2>
                    </div>
                    {pastBids.length > 0 ? (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={tableHeaderStyle}>Auction</th>
                                    <th style={tableHeaderStyle}>Your Bid</th>
                                    <th style={tableHeaderStyle}>Final Price</th>
                                    <th style={tableHeaderStyle}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastBids.map(bid => (
                                    <tr key={bid.id}>
                                        <td style={{ ...tableCellStyle, fontWeight: "600" }}>{bid.auction.title}</td>
                                        <td style={tableCellStyle}>${bid.amount.toLocaleString()}</td>
                                        <td style={tableCellStyle}>${bid.auction.currentBid.toLocaleString()}</td>
                                        <td style={{ ...tableCellStyle, color: "#888" }}>{bid.createdAt.toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: "40px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>
                            No past auction history yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
