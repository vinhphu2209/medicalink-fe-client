"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-gradient-to-br from-[#0A2463] to-[#1e3a8a]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full" />
          </div>
          <span className="text-white font-bold text-xl">Medicalink</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <Link href="/" className="hover:text-blue-300 transition-colors">
            Home
          </Link>
          <Link href="/specialities" className="hover:text-blue-300 transition-colors">
            Specialities
          </Link>
          <Link href="/services" className="hover:text-blue-300 transition-colors">
            Services
          </Link>
          <Link href="/doctors" className="hover:text-blue-300 transition-colors">
            Doctors
          </Link>
          <Link href="/blogs" className="hover:text-blue-300 transition-colors">
            Blogs
          </Link>
          <Link href="/contact" className="hover:text-blue-300 transition-colors">
            Contact
          </Link>
        </div>

        {/* Desktop Appointment Button */}
        <div className="hidden md:block">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Appointment</Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
            <Link href="/" className="text-white hover:text-blue-300 transition-colors py-2">
              Home
            </Link>
            <Link href="/about-us" className="text-white hover:text-blue-300 transition-colors py-2">
              Specialities
            </Link>
            <Link href="/services" className="text-white hover:text-blue-300 transition-colors py-2">
              Services
            </Link>
            <Link href="/doctors" className="text-white hover:text-blue-300 transition-colors py-2">
              Doctors
            </Link>
            <Link href="/blogs" className="text-white hover:text-blue-300 transition-colors py-2">
              Blogs
            </Link>
            <Link href="/contact" className="text-white hover:text-blue-300 transition-colors py-2">
              Contact
            </Link>
            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-2">Appointment</Button>
          </div>
        </div>
      )}
    </nav>
  )
}
