"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2 } from "lucide-react"

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
        <div className="space-y-4">
            <div className="flex gap-0 border-b-2 border-gray-200">
                <button
                    onClick={() => {
                        setActiveTab("new")
                        setFoundPatient(false)
                    }}
                    className={`flex-1 py-3 px-4 text-center font-bold text-base border-b-4 transition ${activeTab === "new"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-600 border-transparent hover:text-gray-900"
                        }`}
                >
                    New Patient
                </button>
                <button
                    onClick={() => {
                        setActiveTab("existing")
                        setFoundPatient(false)
                    }}
                    className={`flex-1 py-3 px-4 text-center font-bold text-base border-b-4 transition ${activeTab === "existing"
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-600 border-transparent hover:text-gray-900"
                        }`}
                >
                    Returning Patient
                </button>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* New Patient Form */}
            {activeTab === "new" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Phone Number <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Gender <span className="text-red-500">*</span></label>
                            <div className="flex gap-6 pt-1.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.isMale === true}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-900">Male</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.isMale === false}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-sm font-medium text-gray-900">Female</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Date of Birth <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium placeholder:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Address <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="addressLine"
                            value={formData.addressLine}
                            onChange={handleInputChange}
                            placeholder="Street address or building name"
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium placeholder:text-gray-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">District <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium placeholder:text-gray-400"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Province <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-4 py-2 text-sm rounded-xl font-semibold text-white transition shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
                                }`}
                        >
                            {loading ? "Processing..." : "Continue to Confirmation"}
                        </button>
                    </div>
                </form>
            )}

            {/* Returning Patient Tab */}
            {activeTab === "existing" && (
                <div className="space-y-4">
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl">
                        <p className="text-sm text-gray-700 mb-4 font-medium">Search for your existing patient record:</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Search By</label>
                                <select
                                    value={searchType}
                                    onChange={(e) => setSearchType(e.target.value as any)}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                >
                                    <option value="phone">Phone Number</option>
                                    <option value="email">Email Address</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">Enter Value</label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Your phone or email"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            disabled={searchLoading}
                            className="w-full px-4 py-2 text-sm rounded-xl font-semibold text-white transition shadow-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 hover:shadow-xl"
                        >
                            {searchLoading ? "Searching..." : "Find My Record"}
                        </button>
                    </div>

                    {foundPatient && (
                        <>
                            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-4 space-y-4 border border-green-100">
                                <div className="flex items-start gap-2 pb-2 border-b border-green-200">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                                    <span className="text-sm font-semibold text-green-700">Record found - Displaying your existing information</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block tracking-wide">Full Name</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.fullName}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block tracking-wide">Email</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block tracking-wide">Phone</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.phone}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block tracking-wide">Gender</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.isMale ? "Male" : "Female"}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block tracking-wide">Date of Birth</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.dateOfBirth}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block tracking-wide">Address</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.addressLine}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block tracking-wide">District</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.district}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-600 uppercase mb-1 block tracking-wide">Province</label>
                                        <p className="text-sm font-semibold text-gray-900">{formData.province}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => onComplete(patientId)}
                                    className="w-full px-4 py-2 text-sm rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                                >
                                    Continue to Confirmation
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}
