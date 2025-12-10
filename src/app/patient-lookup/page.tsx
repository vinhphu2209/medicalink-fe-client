"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { AlertCircle, Loader2, Check } from "lucide-react"

interface Patient {
    id: string
    fullName: string
    email: string
    phone: string
    isMale: boolean
    dateOfBirth: string
    addressLine: string
    district: string
    province: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

interface Appointment {
    id: string
    patientId: string
    doctorId: string
    locationId: string
    eventId: string
    specialtyId: string
    status: string
    reason: string
    notes: string | null
    priceAmount: string | null
    currency: string
    createdAt: string
    updatedAt: string
    cancelledAt: string | null
    completedAt: string | null
    patient: {
        fullName: string
        dateOfBirth: string
    }
    event: {
        id: string
        serviceDate: string
        timeStart: string
        timeEnd: string
        nonBlocking: boolean
        eventType: string
    }
    doctor: {
        id: string
        staffAccountId: string
        fullName: string
        isActive: boolean
        avatarUrl: string
        name: string
    }
}

interface AppointmentResponse {
    success: boolean
    message: string
    data: Appointment[]
    meta: {
        page: number
        limit: number
        total: number
        hasNext: boolean
        hasPrev: boolean
        totalPages: number
    }
}

export default function PatientLookup() {
    const [searchParams, setSearchParams] = useState({
        email: "",
        phone: "",
        name: "",
        dob: "",
    })

    const [patient, setPatient] = useState<Patient | null>(null)
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }))
        setError("")
    }

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!searchParams.email && !searchParams.phone && !searchParams.name) {
            setError("Please enter at least one search field")
            return
        }

        setLoading(true)
        setError("")
        setPatient(null)
        setAppointments([])

        try {
            const params = new URLSearchParams()
            if (searchParams.email) params.append("email", searchParams.email)
            if (searchParams.phone) params.append("phone", searchParams.phone)
            if (searchParams.name) params.append("name", searchParams.name)
            if (searchParams.dob) params.append("dob", searchParams.dob)

            const response = await fetch(`${apiUrl}/patients/public/search?${params}`)
            const data = await response.json()

            if (!data.success || !data.data) {
                setError("Patient not found. Please check your information and try again.")
                return
            }

            setPatient(data.data)
            setCurrentPage(1)

            // Fetch appointments
            const appointmentsResponse = await fetch(`${apiUrl}/appointments/public/patient/${data.data.id}?page=1&limit=10`)
            const appointmentsData: AppointmentResponse = await appointmentsResponse.json()

            if (appointmentsData.success) {
                setAppointments(appointmentsData.data)
                setTotalPages(appointmentsData.meta.totalPages)
            }
        } catch (err) {
            setError("An error occurred while searching for the patient. Please try again.")
            console.error("Search error:", err)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = async (newPage: number) => {
        if (!patient) return

        setLoading(true)
        try {
            const response = await fetch(`${apiUrl}/appointments/public/patient/${patient.id}?page=${newPage}&limit=10`)
            const data: AppointmentResponse = await response.json()

            if (data.success) {
                setAppointments(data.data)
                setCurrentPage(newPage)
                setTotalPages(data.meta.totalPages)
            }
        } catch (err) {
            setError("Failed to load appointments. Please try again.")
            console.error("Page change error:", err)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatTime = (timeString: string) => {
        // Extract time from ISO string like "1970-01-01T08:00:00.000Z"
        const date = new Date(timeString)
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "BOOKED":
                return "bg-blue-100 text-blue-800"
            case "CONFIRMED":
                return "bg-green-100 text-green-800"
            case "COMPLETED":
                return "bg-gray-100 text-gray-800"
            case "CANCELLED":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 pt-32 pb-12">
            <div className="max-w-5xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-center mb-2 text-[#0A2463]">Patient Lookup</h1>
                    <p className="text-center text-gray-600 mb-8">
                        Search for patient information and view their appointment history
                    </p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="example@email.com"
                                    value={searchParams.email}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <Input
                                    type="tel"
                                    name="phone"
                                    placeholder="0123456789"
                                    value={searchParams.phone}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Phu Le"
                                    value={searchParams.name}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                <Input
                                    type="date"
                                    name="dob"
                                    value={searchParams.dob}
                                    onChange={handleInputChange}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    "Search Patient"
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Patient Information */}
                    {patient && (
                        <div className="mb-8 border-t pt-8">
                            <h2 className="text-2xl font-bold mb-6 text-[#0A2463]">Patient Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg mb-8">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Full Name</p>
                                    <p className="text-lg font-semibold text-gray-900">{patient.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Email</p>
                                    <p className="text-lg font-semibold text-gray-900">{patient.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                                    <p className="text-lg font-semibold text-gray-900">{patient.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Gender</p>
                                    <p className="text-lg font-semibold text-gray-900">{patient.isMale ? "Male" : "Female"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Date of Birth</p>
                                    <p className="text-lg font-semibold text-gray-900">{formatDate(patient.dateOfBirth)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Address</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {patient.addressLine}, {patient.district}, {patient.province}
                                    </p>
                                </div>
                            </div>

                            {/* Appointments List */}
                            <h3 className="text-xl font-bold mb-6 text-[#0A2463]">Appointment History</h3>

                            {appointments.length > 0 ? (
                                <>
                                    <div className="space-y-4 mb-6">
                                        {appointments.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <img
                                                                src={appointment.doctor.avatarUrl || "/placeholder.svg"}
                                                                alt={appointment.doctor.fullName}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">{appointment.doctor.fullName}</h4>
                                                                <p className="text-sm text-gray-600">Doctor</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Date</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formatDate(appointment.event.serviceDate)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Time</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formatTime(appointment.event.timeStart)} - {formatTime(appointment.event.timeEnd)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Status</p>
                                                                <span
                                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusColor(appointment.status)}`}
                                                                >
                                                                    {appointment.status}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-medium">Price</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {appointment.priceAmount
                                                                        ? `${appointment.priceAmount} ${appointment.currency}`
                                                                        : "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <p className="text-xs text-gray-600 font-medium mb-1">Reason for Visit</p>
                                                            <p className="text-gray-900">{appointment.reason}</p>
                                                        </div>

                                                        {appointment.notes && (
                                                            <div className="mt-3">
                                                                <p className="text-xs text-gray-600 font-medium mb-1">Notes</p>
                                                                <p className="text-gray-900">{appointment.notes}</p>
                                                            </div>
                                                        )}

                                                        {appointment.completedAt && (
                                                            <div className="mt-3 flex items-center gap-2 text-green-700">
                                                                <Check className="w-4 h-4" />
                                                                <p className="text-sm">Completed on {formatDate(appointment.completedAt)}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2">
                                            <Button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1 || loading}
                                                variant="outline"
                                            >
                                                Previous
                                            </Button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    disabled={loading}
                                                    variant={page === currentPage ? "default" : "outline"}
                                                    className={page === currentPage ? "bg-blue-600 text-white" : "text-gray-700"}
                                                >
                                                    {page}
                                                </Button>
                                            ))}

                                            <Button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages || loading}
                                                variant="outline"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-600">No appointments found for this patient.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
