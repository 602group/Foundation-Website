"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "2px solid #e8e8e8",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#000",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    background: "#fff",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: "700",
    color: "#888",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "6px",
};

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Registration failed.");
            setLoading(false);
            return;
        }

        const signInRes = await signIn("credentials", { email, password, redirect: false });
        setLoading(false);

        if (signInRes?.ok) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            paddingTop: "100px",
        }}>
            <div style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "48px 40px",
                width: "100%",
                maxWidth: "420px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                border: "1px solid #e8e8e8",
            }}>
                {/* Header */}
                <div style={{ marginBottom: "28px" }}>
                    <h1 style={{
                        fontSize: "22px", fontWeight: "900", color: "#000",
                        textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0",
                    }}>
                        Create Account
                    </h1>
                    <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                        Join EPIC Foundation to start bidding
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: "#fff0f0", border: "1px solid #ffcccc",
                        borderRadius: "8px", padding: "10px 14px",
                        color: "#cc0000", fontSize: "13px", marginBottom: "16px",
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                        <label style={labelStyle}>Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 6 characters" style={inputStyle} />
                    </div>
                    <div>
                        <label style={labelStyle}>Confirm Password</label>
                        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" style={inputStyle} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%", padding: "13px",
                            background: "#000", color: "#fff",
                            border: "2px solid #000", borderRadius: "25px",
                            fontSize: "14px", fontWeight: "700",
                            cursor: loading ? "not-allowed" : "pointer",
                            textTransform: "uppercase", letterSpacing: "0.5px",
                            opacity: loading ? 0.6 : 1,
                            fontFamily: "inherit",
                            marginTop: "4px",
                        }}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#aaa" }}>
                    Already have an account?{" "}
                    <Link href="/" style={{ color: "#000", fontWeight: "700", textDecoration: "underline" }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
