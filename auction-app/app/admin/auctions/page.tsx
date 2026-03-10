import { db } from "@/app/lib/db";
import Link from "next/link";
import { revalidatePath } from "next/cache";

async function deleteAuction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await db.auction.delete({ where: { id } });
    revalidatePath("/admin/auctions");
}

const tableHeaderStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#888",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    textAlign: "left",
    borderBottom: "2px solid #e8e8e8",
    background: "#fafafa",
};

const tableCellStyle: React.CSSProperties = {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#222",
    borderBottom: "1px solid #f0f0f0",
};

export default async function ManageAuctions() {
    const auctions = await db.auction.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div style={{ padding: "40px 48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "28px" }}>
                <div>
                    <h1 style={{ color: "#000", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>
                        Manage Auctions
                    </h1>
                    <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>{auctions.length} total auctions</p>
                </div>
                <Link
                    href="/admin/auctions/new"
                    style={{
                        background: "#000000",
                        color: "#ffffff",
                        border: "2px solid #000000",
                        padding: "10px 22px",
                        borderRadius: "25px",
                        fontSize: "13px",
                        fontWeight: "700",
                        textDecoration: "none",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                    }}
                >
                    + Add Auction
                </Link>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Title</th>
                            <th style={tableHeaderStyle}>Status</th>
                            <th style={tableHeaderStyle}>Current Bid</th>
                            <th style={tableHeaderStyle}>Ends</th>
                            <th style={{ ...tableHeaderStyle, textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map((auction: any) => (
                            <tr key={auction.id} style={{ cursor: "default" }}>
                                <td style={{ ...tableCellStyle, fontWeight: "600" }}>{auction.title}</td>
                                <td style={tableCellStyle}>
                                    <span style={{
                                        padding: "3px 10px",
                                        borderRadius: "20px",
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        background: auction.status === "ACTIVE" ? "#000" : "#f0f0f0",
                                        color: auction.status === "ACTIVE" ? "#fff" : "#666",
                                    }}>
                                        {auction.status}
                                    </span>
                                </td>
                                <td style={tableCellStyle}>${auction.currentBid.toLocaleString()}</td>
                                <td style={{ ...tableCellStyle, color: "#666" }}>{auction.endDate.toLocaleDateString()}</td>
                                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                                    <form action={deleteAuction} style={{ display: "inline" }}>
                                        <input type="hidden" name="id" value={auction.id} />
                                        <button type="submit"
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "12px", fontWeight: "600", textDecoration: "underline" }}
                                            onClick={(e) => { if (!confirm("Delete this auction?")) e.preventDefault(); }}
                                        >
                                            Delete
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {auctions.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>
                                    No auctions yet. Click "Add Auction" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
