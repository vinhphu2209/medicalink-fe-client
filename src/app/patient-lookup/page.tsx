"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { AlertCircle, Loader2, Check, Search } from "lucide-react"

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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className='relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pt-[100px] pb-10 overflow-hidden'>
                <div className='absolute inset-0 opacity-10'>
                    <div className='absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full' />
                    <div className='absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full' />
                    <div className='absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full' />
                    <div className='absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full' />
                </div>

                <div className='max-w-7xl mx-auto px-6 relative'>
                    <div className='text-center text-white space-y-6'>
                        <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4'>
                            <Search className='w-4 h-4' />
                            <span className='text-sm font-medium'>Patient Portal</span>
                        </div>

                        <h1 className='text-5xl md:text-6xl font-bold leading-tight'>
                            FIND YOUR
                            <span className='block text-blue-300'>APPOINTMENT RECORDS</span>
                        </h1>

                        <p className='text-blue-100 text-lg max-w-2xl mx-auto'>
                            Search for your patient information and view your complete appointment history
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className='max-w-5xl mx-auto px-6 py-12'>
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    {/* Search Form Section */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-2 text-gray-900">Search Patient Records</h2>
                        <p className="text-gray-600 mb-8">
                            Enter your information to find your patient records and appointment history
                        </p>

                        <form onSubmit={handleSearch} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
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
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
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
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                                    <Input
                                        type="text"
                                        name="name"
                                        placeholder="Your full name"
                                        value={searchParams.name}
                                        onChange={handleInputChange}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-2">Date of Birth</label>
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
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <p className="text-red-700">{error}</p>
                                </div>
                            )}

                            <div className="flex justify-center pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
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
                    </div>

                    {/* Patient Information */}
                    {patient && (
                        <div className="border-t pt-12">
                            <h2 className="text-3xl font-bold mb-8 text-gray-900">Patient Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl mb-12 border border-blue-100">
                                <div>
                                    <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Full Name</p>
                                    <p className="text-lg font-bold text-gray-900">{patient.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-lg font-bold text-gray-900">{patient.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-lg font-bold text-gray-900">{patient.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Gender</p>
                                    <p className="text-lg font-bold text-gray-900">{patient.isMale ? "Male" : "Female"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Date of Birth</p>
                                    <p className="text-lg font-bold text-gray-900">{formatDate(patient.dateOfBirth)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">Address</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {patient.addressLine}, {patient.district}, {patient.province}
                                    </p>
                                </div>
                            </div>

                            {/* Appointments List */}
                            <h3 className="text-2xl font-bold mb-8 text-gray-900">Appointment History</h3>

                            {appointments.length > 0 ? (
                                <>
                                    <div className="space-y-4 mb-8">
                                        {appointments.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <img
                                                                src={appointment.doctor.avatarUrl || "/placeholder.svg"}
                                                                alt={appointment.doctor.fullName}
                                                                className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
                                                            />
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">{appointment.doctor.fullName}</h4>
                                                                <p className="text-sm text-gray-500">Doctor</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Date</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formatDate(appointment.event.serviceDate)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Time</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {formatTime(appointment.event.timeStart)} - {formatTime(appointment.event.timeEnd)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Status</p>
                                                                <span
                                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}
                                                                >
                                                                    {appointment.status}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Price</p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {appointment.priceAmount
                                                                        ? `${appointment.priceAmount} ${appointment.currency}`
                                                                        : "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Reason for Visit</p>
                                                            <p className="text-gray-900">{appointment.reason}</p>
                                                        </div>

                                                        {appointment.notes && (
                                                            <div className="mt-3">
                                                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Notes</p>
                                                                <p className="text-gray-900">{appointment.notes}</p>
                                                            </div>
                                                        )}

                                                        {appointment.completedAt && (
                                                            <div className="mt-3 flex items-center gap-2 text-green-700">
                                                                <Check className="w-4 h-4" />
                                                                <p className="text-sm font-semibold">Completed on {formatDate(appointment.completedAt)}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 pt-8">
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
                                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-600 text-lg">No appointments found for this patient.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
