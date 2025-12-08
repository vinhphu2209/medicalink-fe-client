"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface StepThreeProps {
    onComplete: () => void
    bookingData: any
}

export default function StepThree({ onComplete, bookingData }: StepThreeProps) {
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

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Appointment Summary</h2>
                <div className="space-y-3 text-sm text-gray-600">
                    <p>
                        <strong>Doctor:</strong> {bookingData.doctorName}
                    </p>
                    <p>
                        <strong>Date:</strong> {new Date(bookingData.serviceDate).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Time:</strong> {bookingData.timeStart} - {bookingData.timeEnd}
                    </p>
                </div>
            </div>

            {/* Reason Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Reason for Visit</label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Describe the reason for your visit"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                >
                    {loading ? "Processing..." : "Complete Booking"}
                </Button>
            </form>
        </div>
    )
}
