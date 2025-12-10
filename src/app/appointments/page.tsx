"use client"

import { useState } from "react"
import StepOne from "@/components/booking/step-one"
import StepTwo from "@/components/booking/step-two"
import StepThree from "@/components/booking/step-three"
import { Stethoscope, Shield, Clock } from "lucide-react"

export default function AppointmentsPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [bookingData, setBookingData] = useState({
        locationId: "",
        specialtyId: "",
        doctorId: "",
        doctorName: "",
        timeStart: "",
        timeEnd: "",
        serviceDate: "",
        patientId: "",
        reason: "",
        eventId: "",
    })

    const handleStepOneComplete = (data: any) => {
        setBookingData((prev) => ({
            ...prev,
            ...data,
        }))
        setCurrentStep(2)
    }

    const handleStepTwoComplete = (patientId: string) => {
        setBookingData((prev) => ({
            ...prev,
            patientId,
        }))
        setCurrentStep(3)
    }

    const handleStepThreeComplete = () => {
        setCurrentStep(4)
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pt-[100px] pb-10 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
                    <div className="absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full" />
                    <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full" />
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative text-center text-white space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                        <Stethoscope className="w-4 h-4" />
                        <span className="text-sm font-medium">Appointment Booking</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                        BOOK YOUR
                        <span className="block text-blue-300">APPOINTMENT</span>
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        Choose your doctor, pick a time, and confirm your visit in a few simple steps
                    </p>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                            <Shield className="w-4 h-4" /> Secure booking
                        </div>
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                            <Clock className="w-4 h-4" /> Fast confirmation
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="max-w-5xl mx-auto px-4 md:px-6 py-12">
                {/* Step Indicator */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6">
                    <div className="flex items-center justify-center mb-6">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all ${step <= currentStep ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`w-10 h-1 mx-2 transition-all ${step < currentStep ? "bg-blue-600" : "bg-gray-300"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {currentStep === 1 && "Select Location & Doctor"}
                            {currentStep === 2 && "Patient Information"}
                            {currentStep === 3 && "Review & Confirm"}
                            {currentStep === 4 && "Booking Complete"}
                        </h2>
                        <p className="text-gray-500 mt-2">Step {Math.min(currentStep, 3)} of 3</p>
                    </div>
                </div>

                {/* Steps */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
                    {currentStep === 1 && (
                        <StepOne onComplete={handleStepOneComplete} onBack={currentStep > 1 ? handleBack : undefined} />
                    )}
                    {currentStep === 2 && (
                        <StepTwo onComplete={handleStepTwoComplete} bookingData={bookingData} onBack={handleBack} />
                    )}
                    {currentStep === 3 && (
                        <StepThree onComplete={handleStepThreeComplete} bookingData={bookingData} onBack={handleBack} />
                    )}
                    {currentStep === 4 && (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked Successfully!</h2>
                            <p className="text-gray-600 mb-6">We will contact you shortly to confirm your appointment.</p>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                            >
                                Return to Home
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
