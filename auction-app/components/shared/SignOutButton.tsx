"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
                padding: "8px 16px",
                background: "transparent",
                color: "#ff3333",
                border: "1px solid #ffcccc",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                transition: "all 0.2s",
                fontFamily: "inherit",
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.background = "#fff0f0";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
            }}
        >
            Sign Out
        </button>
    );
}
