"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface StepThreeProps {
    onComplete: () => void
    bookingData: any
    onBack?: () => void
}

// Format time: "14:00" → "2:00 PM"
function formatToAmPm(time: string) {
    const [hour, minute] = time.split(":")
    let h = parseInt(hour, 10)
    const suffix = h >= 12 ? "PM" : "AM"

    if (h === 0) h = 12
    else if (h > 12) h -= 12

    return `${h}:${minute} ${suffix}`
}

// Format date: convert to "Jan 10, 2025"
function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export default function StepThree({ onComplete, bookingData, onBack }: StepThreeProps) {
    const [reason, setReason] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${baseUrl}/appointments/public`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: bookingData.eventId,
                    patientId: bookingData.patientId,
                    specialtyId: bookingData.specialtyId,
                    reason: reason || "Regular checkup",
                }),
            })

            if (!res.ok) throw new Error("Failed to book appointment")

            onComplete()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to book appointment")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Appointment Summary</h2>
                <div className="space-y-5">
                    <div className="flex items-center justify-between pb-4 border-b border-blue-200">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Doctor</span>
                        <p className="font-bold text-lg text-gray-900">{bookingData.doctorName}</p>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-blue-200">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Date</span>
                        <p className="font-bold text-lg text-gray-900">{formatDate(bookingData.serviceDate)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Time</span>
                        <p className="font-bold text-lg text-gray-900">
                            {formatToAmPm(bookingData.timeStart)} - {formatToAmPm(bookingData.timeEnd)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reason Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Reason for Visit</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Describe the reason for your visit or any concerns..."
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none font-medium"
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex-1 px-6 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition"
                        >
                            Back
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`${onBack ? "flex-1" : "w-full"} px-6 py-3 rounded-xl font-semibold text-white transition shadow-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl"
                            }`}
                    >
                        {loading ? "Processing..." : "Complete Booking"}
                    </button>
                </div>
            </form>
        </div>
    )
}
