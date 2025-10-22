"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DoctorCard } from "@/components/doctor-card"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

interface Doctor {
  id: string
  fullName: string
  email: string
  phone: string
  degree: string
  position: string[]
  introduction: string
  avatarUrl: string
  portrait: string
  specialties: Array<{
    id: string
    name: string
    slug: string
  }>
  workLocations: Array<{
    id: string
    name: string
    address: string
    phone: string
  }>
}

interface ApiResponse {
  success: boolean
  data: Doctor[]
  meta: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
    totalPages: number
  }
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [meta, setMeta] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasNext: false,
    hasPrev: false,
    totalPages: 1,
  })

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.medicalink.click/api"
        const url = new URL(`${baseUrl}/doctors/profile/public`)
        url.searchParams.append("page", currentPage.toString())
        url.searchParams.append("limit", "20")

        if (searchTerm) {
          url.searchParams.append("search", searchTerm)
        }

        const response = await fetch(url.toString())
        if (!response.ok) {
          throw new Error("Failed to fetch doctors")
        }

        const data: ApiResponse = await response.json()
        setDoctors(data.data)
        setMeta(data.meta)
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching doctors:", err)
        setError(err instanceof Error ? err.message : "Failed to load doctors")
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [currentPage, searchTerm])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
            <span className="text-blue-600 font-bold text-xl">Medic</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-700">
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
            <a href="#" className="hover:text-blue-600">
              About us
            </a>
            <a href="#" className="hover:text-blue-600">
              Services
            </a>
            <a href="/doctors" className="text-blue-600 font-semibold">
              Doctors
            </a>
            <a href="#" className="hover:text-blue-600">
              News
            </a>
            <a href="#" className="hover:text-blue-600">
              Contact
            </a>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Appointment</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-white space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              MEET OUR EXPERT
              <span className="flex items-center justify-center gap-2 mt-2">
                DOCTORS
                <span className="text-red-500 text-4xl">+</span>
              </span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Our team of highly qualified and experienced doctors are dedicated to providing you with the best medical
              care
            </p>
            <div className="flex items-center gap-4 text-blue-200 font-semibold justify-center">
              <span>{meta.total}+</span>
              <span>Expert Doctors Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search doctors by name, specialty..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm">
              Showing {doctors.length} of {meta.total} doctors
            </span>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-600">Loading doctors...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <p className="text-red-600 font-semibold">Error loading doctors</p>
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white">
                Try Again
              </Button>
            </div>
          </div>
        ) : doctors.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-lg">No doctors found</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setCurrentPage(1)
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Clear Search
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor.id} {...doctor} />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!meta.hasPrev}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={currentPage === page ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={!meta.hasNext}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-3xl font-bold mb-2">Need an Appointment?</h3>
              <p className="text-blue-100">Book a consultation with any of our expert doctors today</p>
            </div>
            <Button size="lg" className="bg-white text-blue-500 hover:bg-gray-100">
              Book Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full" />
              </div>
              <span className="font-bold text-xl">Medic</span>
            </div>
            <p className="text-blue-200 text-sm">© 2025 Medic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
