"use client"

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { data: session, status } = useSession();
    const [scrolled, setScrolled] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close modal on Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const res = await signIn("credentials", { email, password, redirect: false });
        setLoading(false);
        if (res?.ok) {
            setModalOpen(false);
            setEmail("");
            setPassword("");
        } else {
            setError("Invalid email or password.");
        }
    };

    const openModal = () => {
        setError("");
        setEmail("");
        setPassword("");
        setModalOpen(true);
    };

    return (
        <>
            <header className={`hero-header ${scrolled ? "scrolled" : ""}`}>
                <Link href="/" className="logo">EPIC Foundation</Link>
                <nav className="nav-menu">
                    <Link href="/" className="nav-link">Home</Link>
                    <Link href="/auctions" className="nav-link">Auction</Link>
                    <Link href="/travel-events" className="nav-link">Travel &amp; Events</Link>
                    <Link href="/about" className="nav-link">About Us</Link>
                    <Link href="/contact" className="nav-link">Contact Us</Link>

                    {status === "loading" ? null : session ? (
                        <Link href="/dashboard" className="login-btn" style={{ display: "inline-block", background: "#f0f0f0", color: "#000" }}>
                            My Account
                        </Link>
                    ) : (
                        <button onClick={openModal} className="login-btn">Sign In</button>
                    )}
                </nav>
            </header>

            {/* Sign In Modal Overlay */}
            {modalOpen && (
                <div
                    onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.7)",
                        zIndex: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                    }}
                >
                    <div style={{
                        background: "#ffffff",
                        borderRadius: "16px",
                        padding: "48px 40px",
                        width: "100%",
                        maxWidth: "400px",
                        position: "relative",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
                    }}>
                        {/* Close button */}
                        <button
                            onClick={() => setModalOpen(false)}
                            style={{
                                position: "absolute", top: "16px", right: "20px",
                                background: "none", border: "none", cursor: "pointer",
                                fontSize: "24px", color: "#aaa", lineHeight: 1,
                            }}
                            aria-label="Close"
                        >×</button>

                        {/* Header */}
                        <div style={{ marginBottom: "28px" }}>
                            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#000", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>
                                Sign In
                            </h2>
                            <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>
                                Access your EPIC Foundation account
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                background: "#fff0f0", border: "1px solid #ffcccc",
                                borderRadius: "8px", padding: "10px 14px",
                                color: "#cc0000", fontSize: "13px", marginBottom: "16px",
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    style={{
                                        width: "100%", padding: "11px 14px",
                                        border: "2px solid #e8e8e8", borderRadius: "8px",
                                        fontSize: "14px", color: "#000", outline: "none",
                                        boxSizing: "border-box", fontFamily: "inherit",
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    style={{
                                        width: "100%", padding: "11px 14px",
                                        border: "2px solid #e8e8e8", borderRadius: "8px",
                                        fontSize: "14px", color: "#000", outline: "none",
                                        boxSizing: "border-box", fontFamily: "inherit",
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: "100%", padding: "13px",
                                    background: "#000", color: "#fff",
                                    border: "2px solid #000", borderRadius: "25px",
                                    fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                                    textTransform: "uppercase", letterSpacing: "0.5px",
                                    opacity: loading ? 0.6 : 1,
                                    transition: "all 0.2s",
                                    fontFamily: "inherit",
                                    marginTop: "4px",
                                }}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        {/* Create account link */}
                        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#aaa" }}>
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                onClick={() => setModalOpen(false)}
                                style={{ color: "#000", fontWeight: "700", textDecoration: "underline" }}
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
