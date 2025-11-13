"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { MapPin, AlertCircle, Loader2, ChevronDown } from "lucide-react"
import { ReviewForm } from "@/components/doctors/review-form"

interface DoctorDetail {
    id: string
    profileId: string
    fullName: string
    degree: string
    position: string[]
    avatarUrl: string
    portrait: string
    introduction: string
    specialties: Array<{
        id: string
        name: string
        slug: string
    }>
    workLocations: Array<{
        id: string
        name: string
        address: string
    }>
    memberships: string[]
    awards: string[]
    research: string
    trainingProcess: string[]
    experience: string[]
}

export default function DoctorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const [doctor, setDoctor] = useState<DoctorDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"introduction" | "awards" | "training" | "reviews">("introduction") // added tab state
    const [expandedMemberships, setExpandedMemberships] = useState(false) // added memberships expansion state

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                setLoading(true)
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
                const response = await fetch(`${baseUrl}/doctors/profile/public?page=1&limit=20`)

                if (!response.ok) {
                    throw new Error("Failed to fetch doctors")
                }

                const data = await response.json()
                const doctorData = data.data.find((d: DoctorDetail) => d.profileId === resolvedParams.id)

                if (!doctorData) {
                    throw new Error("Doctor not found")
                }

                setDoctor(doctorData)
            } catch (err) {
                console.error("[v0] Error fetching doctor:", err)
                setError(err instanceof Error ? err.message : "Failed to load doctor details")
            } finally {
                setLoading(false)
            }
        }

        fetchDoctor()
    }, [resolvedParams.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-white pt-32 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
                    <p className="text-gray-600">Loading doctor details...</p>
                </div>
            </div>
        )
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen bg-white pt-32">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h2 className="font-bold text-red-900">Error</h2>
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Portrait */}
            <div className="bg-white pt-32">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Portrait Image */}
                        <div className="md:col-span-1">
                            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={
                                        doctor.portrait || doctor.avatarUrl || "/placeholder.svg?height=384&width=280&query=doctor portrait"
                                    }
                                    alt={doctor.fullName}
                                    width={280}
                                    height={384}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    {doctor.degree ? `${doctor.degree} ` : ""}
                                    {doctor.fullName}
                                </h1>
                            </div>

                            {/* Position */}
                            {doctor.position && doctor.position.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {doctor.position.map((pos, idx) => (
                                        <Badge key={idx} className="bg-blue-500 text-white text-sm py-2 px-3">
                                            {pos}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Work Locations */}
                            {doctor.workLocations && doctor.workLocations.length > 0 && (
                                <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-blue-500" />
                                        Work Locations
                                    </h3>
                                    <div className="space-y-2">
                                        {doctor.workLocations.map((location) => (
                                            <div key={location.id} className="text-sm text-gray-700">
                                                <p className="font-semibold">{location.name}</p>
                                                <p className="text-gray-600">{location.address}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Specialties */}
                            {doctor.specialties && doctor.specialties.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2">Specialties</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.specialties.map((spec) => (
                                            <Badge key={spec.id} variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                                                {spec.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-b border-gray-200 sticky top-32 z-40">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex gap-0">
                        <button
                            onClick={() => setActiveTab("introduction")}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all border-b-2 ${activeTab === "introduction"
                                ? "text-blue-600 border-blue-600"
                                : "text-gray-600 border-transparent hover:text-gray-900"
                                }`}
                        >
                            Introduction
                        </button>
                        <button
                            onClick={() => setActiveTab("awards")}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all border-b-2 ${activeTab === "awards"
                                ? "text-blue-600 border-blue-600"
                                : "text-gray-600 border-transparent hover:text-gray-900"
                                }`}
                        >
                            Awards
                        </button>
                        <button
                            onClick={() => setActiveTab("training")}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all border-b-2 ${activeTab === "training"
                                ? "text-blue-600 border-blue-600"
                                : "text-gray-600 border-transparent hover:text-gray-900"
                                }`}
                        >
                            Training & Experience
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`flex-1 py-4 px-6 text-center font-semibold transition-all border-b-2 ${activeTab === "reviews"
                                ? "text-blue-600 border-blue-600"
                                : "text-gray-600 border-transparent hover:text-gray-900"
                                }`}
                        >
                            Reviews
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Introduction Tab */}
                {activeTab === "introduction" && (
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Introduction */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                                <div
                                    className="prose prose-sm max-w-none text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: doctor.introduction }}
                                />
                            </div>

                            {/* Memberships with Expansion */}
                            <div>
                                <button
                                    onClick={() => setExpandedMemberships(!expandedMemberships)}
                                    className="w-full flex items-center justify-between mb-4 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Memberships</h2>
                                    <ChevronDown
                                        className={`w-6 h-6 text-gray-600 transition-transform ${expandedMemberships ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {expandedMemberships && (
                                    <div className="space-y-3">
                                        {doctor.memberships && doctor.memberships.length > 0 ? (
                                            <ul className="space-y-3">
                                                {doctor.memberships.map((membership, idx) => (
                                                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                                                        <span className="text-blue-500 font-bold flex-shrink-0">•</span>
                                                        <span>{membership}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No memberships listed</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Awards Tab */}
                {activeTab === "awards" && (
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Awards */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Awards</h2>
                                {doctor.awards && doctor.awards.length > 0 ? (
                                    <ul className="space-y-3">
                                        {doctor.awards.map((award, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                                                <span className="text-blue-500 font-bold flex-shrink-0">★</span>
                                                <span>{award}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No awards listed</p>
                                )}
                            </div>

                            {/* Research */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Research</h2>
                                {doctor.research ? (
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: doctor.research }}
                                    />
                                ) : (
                                    <p className="text-gray-500">No research listed</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Training & Experience Tab */}
                {activeTab === "training" && (
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Training Process */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Training Process</h2>
                                {doctor.trainingProcess && doctor.trainingProcess.length > 0 ? (
                                    <ul className="space-y-3">
                                        {doctor.trainingProcess.map((training, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                                                <span className="text-blue-500 font-bold flex-shrink-0">✓</span>
                                                <span>{training}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No training process listed</p>
                                )}
                            </div>

                            {/* Experience */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience</h2>
                                {doctor.experience && doctor.experience.length > 0 ? (
                                    <ul className="space-y-3">
                                        {doctor.experience.map((exp, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                                                <span className="text-blue-500 font-bold flex-shrink-0">►</span>
                                                <span>{exp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No experience listed</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Reviews</h2>
                        <ReviewForm doctorId={doctor.profileId} />
                    </div>
                )}
            </div>
        </div>
    )
}
