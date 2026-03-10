export const dynamic = 'force-dynamic';
import { db } from "@/app/lib/db";
import { revalidatePath } from "next/cache";

async function createEvent(formData: FormData) {
    "use server";
    await db.event.create({
        data: {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            location: formData.get("location") as string,
            date: new Date(formData.get("date") as string),
            image: formData.get("imageUrl") as string || null,
        }
    });
    revalidatePath('/travel-events');
}

async function createBlog(formData: FormData) {
    "use server";
    await db.blog.create({
        data: {
            title: formData.get("title") as string,
            content: formData.get("content") as string,
            image: formData.get("imageUrl") as string || null,
            authorId: "admin",
        }
    });
    revalidatePath('/');
}

const sectionHeader = (title: string, count: number) => (
    <div style={{ marginBottom: "16px" }}>
        <h2 style={{ color: "#000", fontSize: "18px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 3px 0" }}>
            {title}
        </h2>
        <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{count} entries</p>
    </div>
);

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
    padding: "13px 16px",
    fontSize: "14px",
    color: "#222",
    borderBottom: "1px solid #f0f0f0",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#000",
    background: "#fff",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
};

const submitBtnStyle: React.CSSProperties = {
    background: "#000",
    color: "#fff",
    border: "2px solid #000",
    padding: "10px 24px",
    borderRadius: "25px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
};

export default async function ManageContent() {
    const events = await db.event.findMany({ orderBy: { date: "desc" } });
    const blogs = await db.blog.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div style={{ padding: "40px 48px" }}>
            <div style={{ marginBottom: "36px" }}>
                <h1 style={{ color: "#000", fontSize: "28px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>
                    Manage Content
                </h1>
                <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Create and manage events and blog posts.</p>
            </div>

            {/* EVENTS */}
            <div style={{ marginBottom: "40px" }}>
                {sectionHeader("Events", events.length)}
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Title</th>
                                <th style={tableHeaderStyle}>Location</th>
                                <th style={tableHeaderStyle}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((e: any) => (
                                <tr key={e.id}>
                                    <td style={{ ...tableCellStyle, fontWeight: "600" }}>{e.title}</td>
                                    <td style={{ ...tableCellStyle, color: "#555" }}>{e.location}</td>
                                    <td style={{ ...tableCellStyle, color: "#888" }}>{e.date.toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr><td colSpan={3} style={{ padding: "36px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>No events yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <details style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "20px 24px" }}>
                    <summary style={{ fontWeight: "700", cursor: "pointer", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>+ Add New Event</summary>
                    <form action={createEvent} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input name="title" required placeholder="Event Title" style={inputStyle} />
                        <input name="location" required placeholder="Location" style={inputStyle} />
                        <input name="date" type="datetime-local" required style={inputStyle} />
                        <textarea name="description" required placeholder="Description" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                        <input name="imageUrl" placeholder="Image URL (optional)" style={inputStyle} />
                        <div><button type="submit" style={submitBtnStyle}>Create Event</button></div>
                    </form>
                </details>
            </div>

            {/* BLOGS */}
            <div>
                {sectionHeader("Blog Posts", blogs.length)}
                <div style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", overflow: "hidden", marginBottom: "12px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Title</th>
                                <th style={tableHeaderStyle}>Published</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((b: any) => (
                                <tr key={b.id}>
                                    <td style={{ ...tableCellStyle, fontWeight: "600" }}>{b.title}</td>
                                    <td style={{ ...tableCellStyle, color: "#888" }}>{b.createdAt.toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {blogs.length === 0 && (
                                <tr><td colSpan={2} style={{ padding: "36px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>No blog posts yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <details style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "12px", padding: "20px 24px" }}>
                    <summary style={{ fontWeight: "700", cursor: "pointer", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>+ Add New Blog Post</summary>
                    <form action={createBlog} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input name="title" required placeholder="Post Title" style={inputStyle} />
                        <textarea name="content" required placeholder="Content (markdown supported)" rows={6} style={{ ...inputStyle, resize: "vertical" }} />
                        <input name="imageUrl" placeholder="Cover Image URL (optional)" style={inputStyle} />
                        <div><button type="submit" style={submitBtnStyle}>Publish Post</button></div>
                    </form>
                </details>
            </div>
        </div>
    );
}
