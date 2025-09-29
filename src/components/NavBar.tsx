"use client";
import Link from "next/link";

export default function NavBar() {
    return (
        <header className="relative flex justify-between items-center px-8 py-4 bg-blue-50">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-700">Mediic</div>
            </div>

            {/* Nav Links (ABSOLUTELY centered) */}
            <nav className="absolute left-1/2 -translate-x-1/2 flex gap-6 text-gray-700 font-medium">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/pages">Pages</Link>
                <Link href="/services">Services</Link>
                <Link href="/blog">Blog</Link>
                <Link href="/contact">Contact</Link>
            </nav>

            {/* Button */}
            <Link
                href="/appointment"
                className="bg-blue-800 text-white px-6 py-2 rounded-full hover:bg-blue-900"
            >
                Get Appointment →
            </Link>
        </header>
    );
}
