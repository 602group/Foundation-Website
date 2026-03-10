export default function AboutPage() {
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
                    About EPIC Foundation
                </h1>
                <p style={{ fontSize: "1.1rem", color: "#aaa", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 }}>
                    Creating once-in-a-lifetime golf experiences while making a lasting impact
                </p>
            </section>

            {/* Mission */}
            <section style={{ padding: "5rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase" }}>
                    Our Mission
                </h2>
                <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#444", marginBottom: "1rem" }}>
                    EPIC Foundation exists to democratize access to the world's most exclusive golf courses while generating meaningful support for charitable causes. We believe that unforgettable golf experiences shouldn't be limited to the privileged few, and that every round played can contribute to something greater than the game itself.
                </p>
                <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#444" }}>
                    Through our innovative auction and event platform, we connect passionate golfers with once-in-a-lifetime opportunities at legendary courses—from Pebble Beach to Augusta National—while channeling 100% of proceeds toward organizations making real change in their communities.
                </p>
            </section>

            {/* Three Pillars */}
            <section style={{ background: "#f8f8f8", padding: "5rem 4rem" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "3rem", textAlign: "center" }}>
                        Where Your Money Goes
                    </h2>
                    <div className="about-features">
                        {[
                            { title: "Youth Golf Development", pct: "35%", desc: "Proceeds support programs that introduce golf to underserved youth, providing equipment, instruction, and access to courses. We partner with The First Tee and local junior golf programs." },
                            { title: "Veteran Support Services", pct: "35%", desc: "Funds golf therapy programs for veterans dealing with PTSD and physical rehabilitation. We work with organizations that use the game to help veterans heal and transition back to civilian life." },
                            { title: "Environmental Conservation", pct: "30%", desc: "Supports golf course sustainability initiatives and conservation efforts. We fund projects that protect natural habitats, promote water conservation, and help courses adopt eco-friendly practices." },
                        ].map((p) => (
                            <div key={p.title} className="feature-item">
                                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff", marginBottom: "0.5rem" }}>{p.pct}</div>
                                <h3 className="feature-title">{p.title}</h3>
                                <p className="feature-text">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who We Are */}
            <section style={{ padding: "5rem 4rem", maxWidth: "900px", margin: "0 auto" }}>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", textTransform: "uppercase" }}>
                    Who We Are
                </h2>
                <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#444", marginBottom: "1rem" }}>
                    EPIC Foundation was founded by a group of passionate golfers who saw an opportunity to bridge two worlds: the exclusive realm of private golf clubs and the broader community of players who dream of experiencing these legendary courses.
                </p>
                <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#444", marginBottom: "1rem" }}>
                    Our team combines decades of experience in golf, nonprofit management, and technology. We've built relationships with over 150 of the world's most prestigious clubs, from century-old American classics to hidden gems across Scotland and Ireland.
                </p>
                <p style={{ fontSize: "1rem", lineHeight: 1.8, color: "#444" }}>
                    We're a community of people who believe that privilege comes with responsibility, and that the joy of the game is amplified when it's shared and used for good.
                </p>
            </section>

            {/* Impact Stats */}
            <section style={{ background: "#000", color: "#fff", padding: "5rem 4rem", textAlign: "center" }}>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1.8rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "3rem" }}>
                    Our Impact
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", maxWidth: "900px", margin: "0 auto" }}>
                    {[
                        { num: "$12M+", label: "Raised for Charity" },
                        { num: "3,500+", label: "Golfers Served" },
                        { num: "150+", label: "Partner Courses" },
                        { num: "45", label: "Charitable Organizations" },
                    ].map((s) => (
                        <div key={s.label}>
                            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "3rem", fontWeight: 900, marginBottom: "0.5rem" }}>{s.num}</div>
                            <div style={{ fontSize: "0.85rem", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
