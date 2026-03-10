export default function ContactPage() {
    return (
        <div style={{ background: "#fff" }}>
            {/* Hero */}
            <section style={{
                background: "#000",
                color: "#fff",
                padding: "120px 4rem 80px",
                textAlign: "center",
            }}>
                <h1 style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "clamp(2.5rem, 6vw, 5rem)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-1px",
                    margin: "0 0 1rem",
                    lineHeight: 1.1,
                }}>
                    Contact Us
                </h1>
                <p style={{ fontSize: "1.1rem", color: "#aaa", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
                    Have a question or want to get involved? We'd love to hear from you.
                </p>
            </section>

            {/* Contact Grid */}
            <section style={{ padding: "5rem 4rem", maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>

                    {/* Info */}
                    <div>
                        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                            Get In Touch
                        </h2>
                        <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#666", marginBottom: "2.5rem" }}>
                            Whether you have questions about membership, upcoming events, or how to get involved with EPIC Foundation, our team is here to help.
                        </p>
                        {[
                            { label: "Email", value: "info@epicfoundation.com" },
                            { label: "Phone", value: "(555) 123-4567" },
                            { label: "Location", value: "United States" },
                        ].map((item) => (
                            <div key={item.label} style={{ marginBottom: "1.5rem", borderBottom: "1px solid #f0f0f0", paddingBottom: "1.5rem" }}>
                                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#999", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'Poppins', sans-serif" }}>{item.label}</div>
                                <div style={{ fontSize: "1rem", color: "#000", fontWeight: 600 }}>{item.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <div style={{ background: "#f8f8f8", borderRadius: "16px", padding: "2.5rem" }}>
                        <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.2rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1.5rem" }}>
                            Send a Message
                        </h3>
                        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {[
                                { name: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                                { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
                                { name: "subject", label: "Subject", type: "text", placeholder: "What is this about?" },
                            ].map((field) => (
                                <div key={field.name}>
                                    <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        placeholder={field.placeholder}
                                        style={{ width: "100%", padding: "12px 16px", border: "2px solid #e8e8e8", borderRadius: "8px", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "#fff" }}
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "#888", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={5}
                                    placeholder="Tell us more..."
                                    style={{ width: "100%", padding: "12px 16px", border: "2px solid #e8e8e8", borderRadius: "8px", fontSize: "0.95rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", background: "#fff" }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="view-all-btn"
                                style={{ marginTop: "0.5rem", width: "100%", textAlign: "center" }}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
