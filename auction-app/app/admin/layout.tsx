import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import AdminSidebarNav from "@/components/shared/AdminSidebarNav";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            background: "#f5f5f5",
            paddingTop: "80px",
        }}>
            <div style={{ display: "flex", flex: 1 }}>
                {/* Sidebar */}
                <aside style={{
                    width: "240px",
                    background: "#000000",
                    display: "flex",
                    flexDirection: "column",
                    flexShrink: 0,
                    minHeight: "calc(100vh - 80px)",
                }}>
                    {/* Sidebar Header */}
                    <div style={{
                        padding: "24px 20px 18px",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}>
                        <div style={{
                            color: "white",
                            fontWeight: "900",
                            fontSize: "13px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                        }}>Admin Portal</div>
                        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginTop: "3px" }}>EPIC Foundation</div>
                    </div>

                    {/* Client-side nav with active state */}
                    <AdminSidebarNav />

                    {/* User info at bottom */}
                    <div style={{
                        padding: "14px 20px",
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                    }}>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", marginBottom: "2px", letterSpacing: "0.3px" }}>Signed in as</div>
                        <div style={{ color: "white", fontSize: "12px", fontWeight: "600", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {session.user?.email}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{
                    flex: 1,
                    background: "#f5f5f5",
                    overflowY: "auto",
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
