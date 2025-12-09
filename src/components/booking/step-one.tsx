"use client"

import { useState, useEffect, useRef } from "react"
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

export default function StepOne({ onComplete, onBack }: any) {
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

    const [loadingDoctors, setLoadingDoctors] = useState(false)
    const [loadingSlots, setLoadingSlots] = useState(false)
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    const [error, setError] = useState("")

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    // Abort controller để tránh race condition khi filter doctor
    const doctorAbortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        fetchLocations()
        fetchSpecialties()
    }, [])

    // --------------------------
    // Fetch location & specialty
    // --------------------------
    const fetchLocations = async () => {
        try {
            const res = await fetch(`${baseUrl}/work-locations/public?sortOrder=ASC`)
            const data = await res.json()
            setLocations(data.data || [])
        } catch {
            setError("Failed to load locations")
        }
    }

    const fetchSpecialties = async () => {
        try {
            const res = await fetch(`${baseUrl}/specialties/public`)
            const data = await res.json()
            setSpecialties(data.data || [])
        } catch {
            setError("Failed to load specialties")
        }
    }

    // ---------------------------
    // Fetch doctors with filters
    // ---------------------------
    useEffect(() => {
        const fetchDoctors = async () => {
            if (!selectedLocation && !selectedSpecialty) {
                setDoctors([])
                return
            }

            setLoadingDoctors(true)

            // Cancel previous request
            if (doctorAbortRef.current) {
                doctorAbortRef.current.abort()
            }
            const controller = new AbortController()
            doctorAbortRef.current = controller

            try {
                const params = new URLSearchParams()
                params.append("sortOrder", "asc")

                if (selectedSpecialty) params.append("specialtyIds", selectedSpecialty)
                if (selectedLocation) params.append("workLocationIds", selectedLocation)

                const res = await fetch(
                    `${baseUrl}/doctors/profile/public?${params.toString()}`,
                    { signal: controller.signal }
                )

                if (!res.ok) throw new Error()

                const data = await res.json()
                setDoctors(data.data || [])
            } catch {
                if (!controller.signal.aborted) {
                    setError("Failed to load doctors")
                }
            } finally {
                setLoadingDoctors(false)
            }
        }

        fetchDoctors()
    }, [selectedLocation, selectedSpecialty])

    // --------------------------
    // Handle selections
    // --------------------------
    const resetDoctorData = () => {
        setSelectedDoctor("")
        setSelectedDoctorName("")
        setSelectedDate("")
        setSelectedTime("")
        setTimeSlots([])
    }

    const handleLocationChange = (locId: string) => {
        setSelectedLocation(locId)
        resetDoctorData()
    }

    const handleSpecialtyChange = (specId: string) => {
        setSelectedSpecialty(specId)
        resetDoctorData()
    }

    const handleDoctorChange = (doctorId: string) => {
        const doctor = doctors.find((d) => d.id === doctorId)
        setSelectedDoctor(doctorId)
        setSelectedDoctorName(doctor?.fullName || "")
        setSelectedDate("")
        setSelectedTime("")
        setTimeSlots([])
    }

    const handleDateChange = async (date: string) => {
        setSelectedDate(date)
        setSelectedTime("")
        setTimeSlots([])

        if (!selectedDoctor || !selectedLocation) return

        setLoadingSlots(true)

        try {
            const params = new URLSearchParams({
                locationId: selectedLocation,
                serviceDate: date,
            })

            const res = await fetch(
                `${baseUrl}/doctors/profile/${selectedDoctor}/slots?${params.toString()}`
            )
            const data = await res.json()
            setTimeSlots(data.data || [])
        } catch {
            setError("Failed to load time slots")
        } finally {
            setLoadingSlots(false)
        }
    }

    // --------------------------
    // Submit
    // --------------------------
    const handleSubmit = async () => {
        if (!selectedLocation || !selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime) {
            setError("Please fill all fields")
            return
        }

        const slot = timeSlots.find((s) => s.timeStart === selectedTime)
        if (!slot) {
            setError("Invalid time slot")
            return
        }

        setLoadingSubmit(true)

        try {
            const res = await fetch(`${baseUrl}/appointments/hold`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorId: selectedDoctor,
                    locationId: selectedLocation,
                    serviceDate: selectedDate,
                    timeStart: slot.timeStart,
                    timeEnd: slot.timeEnd,
                }),
            })

            if (!res.ok) throw new Error()

            const data = await res.json()

            onComplete({
                locationId: selectedLocation,
                specialtyId: selectedSpecialty,
                doctorId: selectedDoctor,
                doctorName: selectedDoctorName,
                serviceDate: selectedDate,
                timeStart: slot.timeStart,
                timeEnd: slot.timeEnd,
                eventId: data.data.id,
            })
        } catch {
            setError("Failed to book slot")
        } finally {
            setLoadingSubmit(false)
        }
    }

    // --------------------------
    // Render
    // --------------------------
    return (
        <div className="max-w-2xl mx-auto">
            <div className="space-y-6">

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                {/* LOCATION */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Select Location</label>
                    <select
                        value={selectedLocation}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">-- Select Location --</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                </div>

                {/* SPECIALTY */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Select Specialty</label>
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => handleSpecialtyChange(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="">-- Select Specialty --</option>
                        {specialties.map((spec) => (
                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                        ))}
                    </select>
                </div>

                {/* DOCTOR */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Select Doctor</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => handleDoctorChange(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        disabled={loadingDoctors || doctors.length === 0}
                    >
                        <option value="">-- Select Doctor --</option>
                        {loadingDoctors && <option>Loading...</option>}
                        {!loadingDoctors &&
                            doctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.fullName} - {doc.degree}
                                </option>
                            ))}
                    </select>
                </div>

                {/* DATE */}
                <div>
                    <label className="block text-sm font-semibold mb-2">Select Appointment Date</label>
                    <input
                        type="date"
                        disabled={!selectedDoctor}
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* SLOTS */}
                {loadingSlots && <div>Loading slots...</div>}
                {!loadingSlots && selectedDate && timeSlots.length === 0 && (
                    <div className="text-sm text-gray-600">
                        The doctor is not scheduled to work on the date you selected. Please choose another date.
                    </div>
                )}

                {!loadingSlots && timeSlots.length > 0 && (
                    <div>
                        <label className="block text-sm font-semibold mb-2">Select Time</label>
                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot.timeStart}
                                    onClick={() => setSelectedTime(slot.timeStart)}
                                    className={`px-3 py-2 rounded-lg border transition ${selectedTime === slot.timeStart
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 hover:border-blue-400"
                                        }`}
                                >
                                    {slot.timeStart}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* SUBMIT */}
                <div className="flex gap-4">
                    {onBack && (
                        <Button onClick={onBack} className="flex-1 border">
                            Back
                        </Button>
                    )}

                    <Button
                        disabled={loadingSubmit || !selectedTime}
                        onClick={handleSubmit}
                        className={`${onBack ? "flex-1" : "w-full"} bg-blue-600 text-white`}
                    >
                        {loadingSubmit ? "Processing..." : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
