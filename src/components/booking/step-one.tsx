"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface Location {
    id: string
    name: string
}

interface Specialty {
    id: string
    name: string
}

interface Doctor {
    id: string
    fullName: string
    degree: string
}

interface TimeSlot {
    timeStart: string
    timeEnd: string
}

interface StepOneProps {
    onComplete: (data: any) => void
}

export default function StepOne({ onComplete }: StepOneProps) {
    const [locations, setLocations] = useState<Location[]>([])
    const [specialties, setSpecialties] = useState<Specialty[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

    const [selectedLocation, setSelectedLocation] = useState("")
    const [selectedSpecialty, setSelectedSpecialty] = useState("")
    const [selectedDoctor, setSelectedDoctor] = useState("")
    const [selectedDoctorName, setSelectedDoctorName] = useState("")
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    useEffect(() => {
        fetchLocations()
        fetchSpecialties()
    }, [])

    const fetchLocations = async () => {
        try {
            const res = await fetch(`${baseUrl}/work-locations/public?sortOrder=ASC`)
            const data = await res.json()
            setLocations(data.data || [])
        } catch (err) {
            setError("Failed to load locations")
        }
    }

    const fetchSpecialties = async () => {
        try {
            const res = await fetch(`${baseUrl}/specialties/public`)
            const data = await res.json()
            setSpecialties(data.data || [])
        } catch (err) {
            setError("Failed to load specialties")
        }
    }

    const handleSpecialtyChange = async (specialtyId: string) => {
        setSelectedSpecialty(specialtyId)
        setSelectedDoctor("")
        setSelectedDoctorName("")
        setDoctors([])

        try {
            const res = await fetch(`${baseUrl}/doctors/profile/public?sortOrder=asc&specialtyIds=${specialtyId}`)
            const data = await res.json()
            setDoctors(data.data || [])
        } catch (err) {
            setError("Failed to load doctors")
        }
    }

    const handleDoctorChange = async (doctorId: string) => {
        const doctor = doctors.find((d) => d.id === doctorId)
        setSelectedDoctor(doctorId)
        setSelectedDoctorName(doctor?.fullName || "")
        setTimeSlots([])
        setSelectedTime("")
    }

    const handleDateChange = async (date: string) => {
        setSelectedDate(date)
        setTimeSlots([])
        setSelectedTime("")

        if (!selectedDoctor) return

        try {
            const res = await fetch(`${baseUrl}/doctors/profile/${selectedDoctor}/slots?serviceDate=${date}`)
            const data = await res.json()
            setTimeSlots(data.data || [])
        } catch (err) {
            setError("Failed to load time slots")
        }
    }

    const handleTimeSelect = (timeStart: string) => {
        setSelectedTime(timeStart)
    }

    const handleSubmit = async () => {
        if (!selectedLocation || !selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime) {
            setError("Please fill all fields")
            return
        }

        setLoading(true)
        try {
            const timeSlot = timeSlots.find((slot) => slot.timeStart === selectedTime)
            const holdRes = await fetch(`${baseUrl}/appointments/hold`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: selectedDoctor,
                    locationId: selectedLocation,
                    serviceDate: selectedDate,
                    timeStart: selectedTime,
                    timeEnd: timeSlot?.timeEnd,
                }),
            })

            if (!holdRes.ok) throw new Error("Failed to hold slot")

            const holdData = await holdRes.json()

            onComplete({
                locationId: selectedLocation,
                specialtyId: selectedSpecialty,
                doctorId: selectedDoctor,
                doctorName: selectedDoctorName,
                timeStart: selectedTime,
                timeEnd: timeSlot?.timeEnd,
                serviceDate: selectedDate,
                eventId: holdData.data.id,
            })
        } catch (err) {
            setError("Failed to book slot")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">{error}</div>}

            {/* Location Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select Location</label>
                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select Location --</option>
                    {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                            {loc.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Specialty Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select Specialty</label>
                <select
                    value={selectedSpecialty}
                    onChange={(e) => handleSpecialtyChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">-- Select Specialty --</option>
                    {specialties.map((spec) => (
                        <option key={spec.id} value={spec.id}>
                            {spec.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Doctor Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select Doctor</label>
                <select
                    value={selectedDoctor}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={doctors.length === 0}
                >
                    <option value="">-- Select Doctor --</option>
                    {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                            {doc.fullName} - {doc.degree}
                        </option>
                    ))}
                </select>
            </div>

            {/* Date Selection */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Select Appointment Date</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Time Slot Selection */}
            {timeSlots.length > 0 && (
                <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Select Time</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.timeStart}
                                onClick={() => handleTimeSelect(slot.timeStart)}
                                className={`px-3 py-2 rounded-lg border transition ${selectedTime === slot.timeStart
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 text-gray-700 hover:border-blue-500"
                                    }`}
                            >
                                {slot.timeStart}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Button
                onClick={handleSubmit}
                disabled={loading || !selectedTime}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
            >
                {loading ? "Processing..." : "Continue"}
            </Button>
        </div>
    )
}
