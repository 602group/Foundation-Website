"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminFooterLink() {
    const { data: session } = useSession();
    if (session?.user?.role !== "ADMIN") return null;
    return (
        <li>
            <Link href="/admin">Admin Portal</Link>
        </li>
    );
}
