"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar } from "lucide-react"

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
                // Auto-select first location and trigger update
                setTimeout(() => {
                    setSelectedLocation(doctorLocations[0].id)
                }, 0)
            }

            // Populate specialties from doctor's specialties
            if (doctor.specialties && doctor.specialties.length > 0) {
                const doctorSpecialties = doctor.specialties.map(sp => ({
                    id: sp.id,
                    name: sp.name
                }))
                setSpecialties(doctorSpecialties)
                // Auto-select first specialty and trigger update
                setTimeout(() => {
                    setSelectedSpecialty(doctorSpecialties[0].id)
                }, 0)
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
        <div className="animate-fade-in-up">
            {error && (
                <div className="p-2 md:p-2.5 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 flex items-start gap-2 animate-shake mb-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="font-medium text-xs">{error}</span>
                </div>
            )}

            {/* TOP ROW - 2 Columns: Left (Location, Specialty) | Right (Doctor, Date) */}
            <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-3">
                {/* LEFT COLUMN - Location & Specialty */}
                <div className="space-y-3">
                    {/* LOCATION */}
                    <div className="transform transition-all hover:scale-[1.01]">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">1</span>
                            Select Location
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            key={`location-${selectedLocation}`}
                            value={selectedLocation}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm shadow-sm placeholder:text-gray-400"
                        >
                            <option value="" className="text-gray-400">-- Choose a location --</option>
                            {locations.map((loc) => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* SPECIALTY */}
                    <div className="transform transition-all hover:scale-[1.01]">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                            Select Specialty
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            key={`specialty-${selectedSpecialty}`}
                            value={selectedSpecialty}
                            onChange={(e) => handleSpecialtyChange(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm shadow-sm placeholder:text-gray-400"
                        >
                            <option value="" className="text-gray-400">-- Choose a specialty --</option>
                            {specialties.map((spec) => (
                                <option key={spec.id} value={spec.id}>{spec.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* RIGHT COLUMN - Doctor & Date */}
                <div className="space-y-3">
                    {/* DOCTOR */}
                    <div className="transform transition-all hover:scale-[1.01]">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">3</span>
                            Select Doctor
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedDoctor}
                            onChange={(e) => handleDoctorChange(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-200 placeholder:text-gray-400"
                            disabled={loadingDoctors}
                        >
                            <option value="" className="text-gray-400">-- Choose a doctor --</option>
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
                    <div className="transform transition-all hover:scale-[1.01]">
                        <label className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">4</span>
                            Select Appointment Date
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="date"
                                disabled={!selectedDoctor}
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-xl bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-sm shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* TIME SLOTS SECTION - Full Width Below with Reserved Space */}
            <div className="min-h-0">
                {/* Loading State */}
                {loadingSlots && (
                    <div className="p-2 bg-blue-50 border-2 border-blue-100 rounded-xl text-blue-700 font-medium text-xs animate-pulse">
                        ⏳ Loading available time slots...
                    </div>
                )}

                {/* No Slots Available */}
                {!loadingSlots && selectedDate && timeSlots.length === 0 && (
                    <div className="p-2 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-700 font-medium text-xs">
                        ⚠️ The doctor is not scheduled to work on the selected date. Please choose another date.
                    </div>
                )}

                {/* Time Slots Grid */}
                {!loadingSlots && timeSlots.length > 0 && (() => {
                    // Convert 24h to 12h format and group by AM/PM
                    const formatTime = (time24: string) => {
                        const [hours, minutes] = time24.split(':').map(Number)
                        const period = hours >= 12 ? 'PM' : 'AM'
                        const hours12 = hours % 12 || 12
                        return { formatted: `${hours12}:${minutes.toString().padStart(2, '0')}`, period, hours24: hours }
                    }

                    const amSlots = timeSlots.filter(slot => {
                        const hours = parseInt(slot.timeStart.split(':')[0])
                        return hours < 12
                    })

                    const pmSlots = timeSlots.filter(slot => {
                        const hours = parseInt(slot.timeStart.split(':')[0])
                        return hours >= 12
                    })

                    return (
                        <div className="animate-fade-in-up">
                            <label className="flex items-center gap-2 text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">5</span>
                                Select Time Slot
                                <span className="text-red-500">*</span>
                            </label>

                            {/* AM Slots */}
                            {amSlots.length > 0 && (
                                <div className="mb-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-3 py-1 bg-linear-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-full">
                                            <span className="text-xs font-bold text-orange-600">MORNING</span>
                                        </div>
                                        <div className="flex-1 h-px bg-linear-to-r from-orange-200 to-transparent"></div>
                                    </div>
                                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
                                        {amSlots.map((slot, index) => {
                                            const start = formatTime(slot.timeStart)
                                            const end = formatTime(slot.timeEnd)
                                            return (
                                                <button
                                                    key={slot.timeStart}
                                                    onClick={() => setSelectedTime(slot.timeStart)}
                                                    style={{ animationDelay: `${index * 30}ms` }}
                                                    className={`px-2 py-1.5 rounded-lg font-bold text-[10px] transition-all duration-300 border-2 transform hover:scale-105 animate-fade-in-up ${selectedTime === slot.timeStart
                                                        ? "bg-linear-to-br from-orange-400 to-amber-500 text-white border-orange-400 shadow-lg scale-105"
                                                        : "bg-white text-gray-700 border-orange-200 hover:border-orange-300 hover:bg-orange-50 shadow-sm"
                                                        }`}
                                                >
                                                    {start.formatted} - {end.formatted}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* PM Slots */}
                            {pmSlots.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-3 py-1 bg-linear-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-full">
                                            <span className="text-xs font-bold text-blue-700">AFTERNOON</span>
                                        </div>
                                        <div className="flex-1 h-px bg-linear-to-r from-blue-200 to-transparent"></div>
                                    </div>
                                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1.5">
                                        {pmSlots.map((slot, index) => {
                                            const start = formatTime(slot.timeStart)
                                            const end = formatTime(slot.timeEnd)
                                            return (
                                                <button
                                                    key={slot.timeStart}
                                                    onClick={() => setSelectedTime(slot.timeStart)}
                                                    style={{ animationDelay: `${(amSlots.length + index) * 30}ms` }}
                                                    className={`px-2 py-1.5 rounded-lg font-bold text-[10px] transition-all duration-300 border-2 transform hover:scale-105 animate-fade-in-up ${selectedTime === slot.timeStart
                                                        ? "bg-linear-to-br from-blue-500 to-indigo-600 text-white border-blue-500 shadow-lg scale-105"
                                                        : "bg-white text-gray-700 border-blue-200 hover:border-blue-400 hover:bg-blue-50 shadow-sm"
                                                        }`}
                                                >
                                                    {start.formatted} - {end.formatted}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })()}
            </div>

            {/* SUBMIT - Full Width Below */}
            <div className="flex gap-3 pt-2">
                <button
                    disabled={loadingSubmit || !selectedTime}
                    onClick={handleSubmit}
                    className={`w-full px-4 md:px-6 py-2.5 rounded-xl font-bold text-white transition-all transform text-sm shadow-lg ${loadingSubmit || !selectedTime
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:scale-105"
                        }`}
                >
                    {loadingSubmit ? "⏳ Processing..." : "Continue to Patient Information →"}
                </button>
            </div>
        </div>
    )
}
