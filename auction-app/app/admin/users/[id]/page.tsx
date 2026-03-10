import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

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

export default async function AdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") redirect("/login");

    const { id } = await params;

    const user = await db.user.findUnique({
        where: { id },
        include: {
            bids: {
                include: { auction: true },
                orderBy: { createdAt: "desc" },
            },
            _count: { select: { bids: true } },
        },
    });

    if (!user) notFound();

    const activeBids = user.bids.filter((b: any) => b.auction.status === "ACTIVE");
    const pastBids = user.bids.filter((b: any) => b.auction.status !== "ACTIVE");

    return (
        <div style={{ padding: "40px 48px" }}>
            {/* Back link */}
            <Link href="/admin/users" style={{ color: "#888", fontSize: "13px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "24px" }}>
                ← Back to Users
            </Link>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                        width: "56px", height: "56px", borderRadius: "50%",
                        background: "#000", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px", fontWeight: "900", flexShrink: 0,
                    }}>
                        {(user.name || user.email || "?")[0].toUpperCase()}
                    </div>
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#000", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>
                            {user.name || "Unnamed User"}
                        </h1>
                        <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>{user.email}</p>
                    </div>
                </div>
                <span style={{
                    padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                    textTransform: "uppercase", letterSpacing: "0.5px",
                    background: user.role === "ADMIN" ? "#000" : "#f0f0f0",
                    color: user.role === "ADMIN" ? "#fff" : "#666",
                }}>{user.role}</span>
            </div>

            {/* Account Details */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: "#000", margin: "0 0 16px 0" }}>Account Info</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
                    {[
                        { label: "User ID", value: user.id },
                        { label: "Email", value: user.email },
                        { label: "Name", value: user.name || "—" },
                        { label: "Joined", value: user.createdAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                        { label: "Total Bids", value: String(user._count.bids) },
                    ].map(item => (
                        <div key={item.label}>
                            <div style={{ fontSize: "11px", fontWeight: "700", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>{item.label}</div>
                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#000", wordBreak: "break-all" }}>{item.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Bids */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0f0f0" }}>
                    <h2 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: "#000", margin: 0 }}>
                        Active Bids ({activeBids.length})
                    </h2>
                </div>
                {activeBids.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr>
                            <th style={tableHeaderStyle}>Auction</th>
                            <th style={tableHeaderStyle}>Bid Amount</th>
                            <th style={tableHeaderStyle}>Current Price</th>
                            <th style={tableHeaderStyle}>Ends</th>
                        </tr></thead>
                        <tbody>
                            {activeBids.map((bid: any) => (
                                <tr key={bid.id}>
                                    <td style={{ ...tableCellStyle, fontWeight: "600" }}>{bid.auction.title}</td>
                                    <td style={tableCellStyle}>${bid.amount.toLocaleString()}</td>
                                    <td style={tableCellStyle}>${bid.auction.currentBid.toLocaleString()}</td>
                                    <td style={{ ...tableCellStyle, color: "#888" }}>{bid.auction.endDate.toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: "32px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>No active bids.</div>
                )}
            </div>

            {/* Past Bids */}
            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0f0f0" }}>
                    <h2 style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", color: "#000", margin: 0 }}>
                        Past Bids ({pastBids.length})
                    </h2>
                </div>
                {pastBids.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead><tr>
                            <th style={tableHeaderStyle}>Auction</th>
                            <th style={tableHeaderStyle}>Bid Amount</th>
                            <th style={tableHeaderStyle}>Final Price</th>
                            <th style={tableHeaderStyle}>Date</th>
                        </tr></thead>
                        <tbody>
                            {pastBids.map((bid: any) => (
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
                    <div style={{ padding: "32px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>No past bid history.</div>
                )}
            </div>
        </div>
    );
}
