"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

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
    workLocations: Array<{
        id: string
        name: string
        address: string
    }>
    specialties: Array<{
        id: string
        name: string
        slug: string
    }>
}

interface TimeSlot {
    timeStart: string
    timeEnd: string
}

export default function StepOne({ onComplete, onBack }: any) {
    const [locations, setLocations] = useState<Location[]>([])
    const [specialties, setSpecialties] = useState<Specialty[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [allDoctors, setAllDoctors] = useState<Doctor[]>([])
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [selectionMode, setSelectionMode] = useState<'filter-first' | 'doctor-first' | null>(null)

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
        fetchAllDoctors()
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

    const fetchAllDoctors = async () => {
        try {
            const params = new URLSearchParams()
            params.append("limit", "50")
            params.append("sortOrder", "asc")

            const res = await fetch(`${baseUrl}/doctors/profile/public?${params.toString()}`)
            const data = await res.json()
            setAllDoctors(data.data || [])
            setDoctors(data.data || [])
        } catch {
            setError("Failed to load doctors")
        }
    }

    // ---------------------------
    // Fetch doctors with filters (filter-first mode)
    // ---------------------------
    useEffect(() => {
        const fetchDoctors = async () => {
            // Only filter if in filter-first mode
            if (selectionMode !== 'filter-first') {
                return
            }

            // Require BOTH location AND specialty to be selected in filter-first mode
            if (!selectedLocation || !selectedSpecialty) {
                setDoctors(allDoctors)
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
    }, [selectedLocation, selectedSpecialty, selectionMode])

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

        // If doctor not selected yet, set mode to filter-first
        if (!selectedDoctor) {
            setSelectionMode('filter-first')
        } else {
            // User is switching filters after selecting doctor - reset doctor
            resetDoctorData()
            setSelectionMode('filter-first')
        }
    }

    const handleSpecialtyChange = (specId: string) => {
        setSelectedSpecialty(specId)

        // If doctor not selected yet, set mode to filter-first
        if (!selectedDoctor) {
            setSelectionMode('filter-first')
        } else {
            // User is switching filters after selecting doctor - reset doctor
            resetDoctorData()
            setSelectionMode('filter-first')
        }
    }

    const handleDoctorChange = (doctorId: string) => {
        const doctor = doctors.find((d) => d.id === doctorId)
        if (!doctor) return

        setSelectedDoctor(doctorId)
        setSelectedDoctorName(doctor.fullName || "")
        setSelectedDate("")
        setSelectedTime("")
        setTimeSlots([])

        // If location and specialty are not selected yet (doctor-first mode)
        if (!selectedLocation && !selectedSpecialty) {
            setSelectionMode('doctor-first')

            // Populate locations from doctor's workLocations
            if (doctor.workLocations && doctor.workLocations.length > 0) {
                const doctorLocations = doctor.workLocations.map(wl => ({
                    id: wl.id,
                    name: wl.name
                }))
                setLocations(doctorLocations)
                // Auto-select first location
                setSelectedLocation(doctorLocations[0].id)
            }

            // Populate specialties from doctor's specialties
            if (doctor.specialties && doctor.specialties.length > 0) {
                const doctorSpecialties = doctor.specialties.map(sp => ({
                    id: sp.id,
                    name: sp.name
                }))
                setSpecialties(doctorSpecialties)
                // Auto-select first specialty
                setSelectedSpecialty(doctorSpecialties[0].id)
            }
        }
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
        <div>
            <div className="space-y-8">

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* LOCATION */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Location</label>
                    <select
                        value={selectedLocation}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                    >
                        <option value="">-- Choose a location --</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                </div>

                {/* SPECIALTY */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Specialty</label>
                    <select
                        value={selectedSpecialty}
                        onChange={(e) => handleSpecialtyChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                    >
                        <option value="">-- Choose a specialty --</option>
                        {specialties.map((spec) => (
                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                        ))}
                    </select>
                </div>

                {/* DOCTOR */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Doctor</label>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => handleDoctorChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={loadingDoctors}
                    >
                        <option value="">-- Choose a doctor --</option>
                        {loadingDoctors && <option>Loading doctors...</option>}
                        {!loadingDoctors &&
                            doctors.map((doc) => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.fullName} • {doc.degree}
                                </option>
                            ))}
                    </select>
                </div>

                {/* DATE */}
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Appointment Date</label>
                    <input
                        type="date"
                        disabled={!selectedDoctor}
                        value={selectedDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                {/* SLOTS */}
                {loadingSlots && (
                    <div className="p-4 bg-blue-50 rounded-xl text-blue-700 font-medium">Loading available time slots...</div>
                )}
                {!loadingSlots && selectedDate && timeSlots.length === 0 && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 font-medium">
                        The doctor is not scheduled to work on the selected date. Please choose another date.
                    </div>
                )}

                {!loadingSlots && timeSlots.length > 0 && (
                    <div>
                        <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Select Time Slot</label>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                            {timeSlots.map((slot) => (
                                <button
                                    key={slot.timeStart}
                                    onClick={() => setSelectedTime(slot.timeStart)}
                                    className={`px-4 py-3 rounded-xl font-semibold transition border-2 ${selectedTime === slot.timeStart
                                        ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                                        : "bg-white text-gray-900 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                                        }`}
                                >
                                    {slot.timeStart}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* SUBMIT */}
                <div className="flex gap-4 pt-6">
                    {onBack && (
                        <button onClick={onBack} className="flex-1 px-6 py-3 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition">
                            Back
                        </button>
                    )}

                    <button
                        disabled={loadingSubmit || !selectedTime}
                        onClick={handleSubmit}
                        className={`${onBack ? "flex-1" : "w-full"} px-6 py-3 rounded-xl font-semibold text-white transition ${loadingSubmit || !selectedTime ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"}`}
                    >
                        {loadingSubmit ? "Processing..." : "Continue to Patient Info"}
                    </button>
                </div>
            </div>
        </div>
    )
}
