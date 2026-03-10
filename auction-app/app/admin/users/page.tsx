export const dynamic = 'force-dynamic';
import { db } from "@/app/lib/db";
import Link from "next/link";

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

export default async function AdminUsers() {
    const users = await db.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { bids: true } } },
    });

    return (
        <div style={{ padding: "40px 48px" }}>
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ color: "#000", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>
                    Manage Users
                </h1>
                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>{users.length} registered accounts — click a row to view full details</p>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th style={tableHeaderStyle}>Name</th>
                            <th style={tableHeaderStyle}>Email</th>
                            <th style={tableHeaderStyle}>Role</th>
                            <th style={tableHeaderStyle}>Bids</th>
                            <th style={tableHeaderStyle}>Joined</th>
                            <th style={{ ...tableHeaderStyle, textAlign: "right" }}>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.id} style={{ transition: "background 0.1s" }}>
                                <td style={{ ...tableCellStyle, fontWeight: "600" }}>{user.name || "—"}</td>
                                <td style={{ ...tableCellStyle, color: "#555" }}>{user.email}</td>
                                <td style={tableCellStyle}>
                                    <span style={{
                                        padding: "3px 10px",
                                        borderRadius: "20px",
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        background: user.role === "ADMIN" ? "#000" : "#f0f0f0",
                                        color: user.role === "ADMIN" ? "#fff" : "#666",
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={tableCellStyle}>{user._count.bids}</td>
                                <td style={{ ...tableCellStyle, color: "#888", fontSize: "13px" }}>
                                    {user.createdAt.toLocaleDateString()}
                                </td>
                                <td style={{ ...tableCellStyle, textAlign: "right" }}>
                                    <Link
                                        href={`/admin/users/${user.id}`}
                                        style={{
                                            padding: "5px 14px",
                                            background: "#000",
                                            color: "#fff",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            textDecoration: "none",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.3px",
                                        }}
                                    >
                                        View →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>
                                    No users registered yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
