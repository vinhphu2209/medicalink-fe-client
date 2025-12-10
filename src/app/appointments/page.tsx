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
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pt-[100px] pb-16 overflow-hidden">
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
            <section className="max-w-4xl mx-auto px-4 md:px-6 py-12">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                        {[1, 2, 3].map((step, index) => (
                            <div key={step} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white transition-all shadow-lg ${step <= currentStep ? "bg-blue-600" : "bg-gray-300"
                                            }`}
                                    >
                                        {step}
                                    </div>
                                    <p className="text-xs font-semibold mt-2 text-gray-600 whitespace-nowrap">
                                        {step === 1 && "Location"}
                                        {step === 2 && "Patient"}
                                        {step === 3 && "Confirm"}
                                    </p>
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`w-24 md:w-32 h-1 mx-4 transition-all rounded-full ${step < currentStep ? "bg-blue-600" : "bg-gray-300"
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
                        <p className="text-gray-500 mt-2 font-medium">Step {Math.min(currentStep, 3)} of 3</p>
                    </div>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
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
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-linear-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Appointment Booked Successfully!</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">We will contact you shortly to confirm your appointment details.</p>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition font-semibold shadow-lg hover:shadow-xl"
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
