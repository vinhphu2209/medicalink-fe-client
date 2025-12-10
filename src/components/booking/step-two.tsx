"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface StepTwoProps {
    onComplete: (patientId: string) => void
    bookingData: any
    onBack?: () => void
}

export default function StepTwo({ onComplete, bookingData, onBack }: StepTwoProps) {
    const [activeTab, setActiveTab] = useState<"new" | "existing">("new")
    const [loading, setLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [error, setError] = useState("")
    const [foundPatient, setFoundPatient] = useState(false)
    const [patientId, setPatientId] = useState<string>("")

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        isMale: true,
        dateOfBirth: "",
        addressLine: "",
        district: "",
        province: "",
    })

    const [searchQuery, setSearchQuery] = useState("")
    const [searchType, setSearchType] = useState<"phone" | "email">("phone")

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "radio" ? value === "male" : value,
        }))
    }

    const handleSearch = async () => {
        if (!searchQuery) {
            setError("Please enter a search value")
            return
        }

        setSearchLoading(true)
        setError("")

        try {
            const queryParam = `${searchType}=${encodeURIComponent(searchQuery)}`
            const res = await fetch(`${baseUrl}/patients/public/search?${queryParam}`)
            const data = await res.json()

            if (data.success && data.data) {
                setFormData({
                    fullName: data.data.fullName || "",
                    email: data.data.email || "",
                    phone: data.data.phone || "",
                    isMale: data.data.isMale || false,
                    dateOfBirth: data.data.dateOfBirth ? data.data.dateOfBirth.split("T")[0] : "",
                    addressLine: data.data.addressLine || "",
                    district: data.data.district || "",
                    province: data.data.province || "",
                })
                setPatientId(data.data.id || "")
                setFoundPatient(true)
            } else {
                setError("Patient not found")
                setFoundPatient(false)
            }
        } catch (err) {
            setError("Failed to search patient")
            setFoundPatient(false)
        } finally {
            setSearchLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${baseUrl}/patients/public`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to create patient")

            onComplete(data.data.id)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create patient")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-0 border-b-2 border-gray-200">
                <button
                    onClick={() => {
                        setActiveTab("new")
                        setFoundPatient(false)
                    }}
                    className={`flex-1 py-3 px-4 text-center font-bold text-lg border-b-4 transition ${activeTab === "new"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-600 border-transparent hover:text-gray-900"
                        }`}
                >
                    First Time Patient
                </button>
                <button
                    onClick={() => {
                        setActiveTab("existing")
                        setFoundPatient(false)
                    }}
                    className={`flex-1 py-3 px-4 text-center font-bold text-lg border-b-4 transition ${activeTab === "existing"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-600 border-transparent hover:text-gray-900"
                        }`}
                >
                    Returning Patient
                </button>
            </div>

            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}

            {/* New Patient Form */}
            {activeTab === "new" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Gender</label>
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.isMale === true}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Male</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.isMale === false}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Female</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
                        <input
                            type="text"
                            name="addressLine"
                            value={formData.addressLine}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">District</label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Province</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                        {onBack && (
                            <button
                                type="button"
                                onClick={onBack}
                                className="flex-1 px-4 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${onBack ? "flex-1" : "w-full"} px-4 py-3 rounded-lg font-semibold text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Processing..." : "Continue"}
                        </button>
                    </div>
                </form>
            )}

            {/* Returning Patient Tab */}
            {activeTab === "existing" && (
                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                        <p className="text-sm text-gray-700 mb-4 font-medium">Search for your existing record by:</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Search By</label>
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as any)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="phone">Phone Number</option>
                                    <option value="email">Email</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">Enter Value</label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter search value"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={searchLoading}
                            className="w-full px-4 py-3 rounded-lg font-semibold text-white transition bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {searchLoading ? "Searching..." : "Search"}
                        </button>
                    </div>

                    {foundPatient && (
                        <>
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
                                <div className="flex items-center gap-2 text-gray-600 pb-4 border-b border-gray-200">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">View only - Information from your previous visit</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Full Name</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Email</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Phone</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Gender</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.isMale ? "Male" : "Female"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Date of Birth</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.dateOfBirth}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Address</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.addressLine}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">District</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.district}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 uppercase mb-1 block">Province</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.province}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                {onBack && (
                                    <button
                                        type="button"
                                        onClick={onBack}
                                        className="flex-1 px-4 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onComplete(patientId)}
                                    className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                                >
                                    Continue
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
