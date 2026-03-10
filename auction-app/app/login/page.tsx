"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError("Invalid email or password. Please try again.");
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
            padding: "1rem",
            position: "relative",
            overflow: "hidden",
        }}>
            {/* Background decoration */}
            <div style={{
                position: "absolute",
                top: "-20%",
                right: "-10%",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute",
                bottom: "-20%",
                left: "-10%",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{
                width: "100%",
                maxWidth: "420px",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "20px",
                padding: "48px 40px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
                position: "relative",
                zIndex: 10,
            }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "64px",
                        height: "64px",
                        borderRadius: "16px",
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        marginBottom: "20px",
                        boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
                    }}>
                        <span style={{ color: "white", fontSize: "28px", fontWeight: "900" }}>E</span>
                    </div>
                    <h1 style={{
                        color: "white",
                        fontSize: "26px",
                        fontWeight: "800",
                        margin: "0 0 6px 0",
                        letterSpacing: "-0.5px",
                    }}>EPIC Foundation</h1>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
                        Sign in to your account
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div style={{
                        background: "rgba(239,68,68,0.15)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        marginBottom: "20px",
                        color: "#fca5a5",
                        fontSize: "14px",
                        textAlign: "center",
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{
                            display: "block",
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "13px",
                            fontWeight: "600",
                            marginBottom: "8px",
                            letterSpacing: "0.3px",
                        }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            style={{
                                width: "100%",
                                padding: "13px 16px",
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "10px",
                                color: "white",
                                fontSize: "15px",
                                outline: "none",
                                boxSizing: "border-box",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.7)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                        />
                    </div>

                    <div style={{ marginBottom: "28px" }}>
                        <label style={{
                            display: "block",
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "13px",
                            fontWeight: "600",
                            marginBottom: "8px",
                            letterSpacing: "0.3px",
                        }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••••"
                            style={{
                                width: "100%",
                                padding: "13px 16px",
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "10px",
                                color: "white",
                                fontSize: "15px",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.7)"}
                            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: loading
                                ? "rgba(99,102,241,0.5)"
                                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            border: "none",
                            borderRadius: "10px",
                            color: "white",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: loading ? "none" : "0 8px 24px rgba(99,102,241,0.4)",
                            transition: "all 0.2s",
                            letterSpacing: "0.3px",
                        }}
                    >
                        {loading ? "Signing in..." : "Sign In →"}
                    </button>
                </form>
            </div>
        </div>
    );
}
