"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: "▪" },
    { href: "/admin/auctions", label: "Manage Auctions", icon: "▪" },
    { href: "/admin/users", label: "Manage Users", icon: "▪" },
    { href: "/admin/content", label: "Manage Content", icon: "▪" },
];

export default function AdminSidebarNav() {
    const pathname = usePathname();

    return (
        <nav style={{ padding: "8px 16px", flex: 1 }}>
            <p style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "0 8px",
                marginBottom: "6px",
                marginTop: "8px",
            }}>Menu</p>

            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                            textDecoration: "none",
                            fontSize: "13.5px",
                            fontWeight: isActive ? "700" : "500",
                            marginBottom: "2px",
                            background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                            borderLeft: isActive ? "3px solid #ffffff" : "3px solid transparent",
                            letterSpacing: "0.2px",
                        }}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
