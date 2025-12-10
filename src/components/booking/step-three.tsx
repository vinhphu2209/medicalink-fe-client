"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

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
        <div className="space-y-6">
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}

            <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Appointment Summary</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                        <span className="text-sm font-semibold text-gray-600 uppercase">Doctor</span>
                        <p className="font-bold text-gray-900">{bookingData.doctorName}</p>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-blue-200">
                        <span className="text-sm font-semibold text-gray-600 uppercase">Date</span>
                        <p className="font-bold text-gray-900">{formatDate(bookingData.serviceDate)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600 uppercase">Time</span>
                        <p className="font-bold text-gray-900">
                            {formatToAmPm(bookingData.timeStart)} - {formatToAmPm(bookingData.timeEnd)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reason Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Reason for Visit</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Describe the reason for your visit (optional)"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                        {loading ? "Processing..." : "Complete Booking"}
                    </button>
                </div>
            </form>
        </div>
    )
}
