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
        <div className="bg-white min-h-screen">
            {/* Hero Section - Ultra Compact */}
            <section className="relative bg-linear-to-br from-[#0A2463] via-[#1e3a8a] to-[#2563eb] pt-[88px] pb-3 md:pb-4 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-400/30 rounded-full blur-2xl animate-pulse delay-1000" />
                </div>

                <div className="max-w-4xl mx-auto px-4 md:px-6 relative text-center text-white space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-lg animate-fade-in-up">
                        <Stethoscope className="w-3 h-3" />
                        <span className="text-xs font-semibold">Appointment Booking</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold leading-tight animate-fade-in-up animation-delay-200">
                        BOOK YOUR
                        <span className="block text-cyan-300 mt-0.5">APPOINTMENT</span>
                    </h1>
                    <p className="text-blue-100 text-xs md:text-sm max-w-xl mx-auto animate-fade-in-up animation-delay-300">
                        Choose your doctor, pick a time, and confirm your visit
                    </p>
                    <div className="flex items-center justify-center gap-2 flex-wrap animate-fade-in-up animation-delay-400">
                        <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] border border-white/20">
                            <Shield className="w-3 h-3" /> Secure
                        </div>
                        <div className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] border border-white/20">
                            <Clock className="w-3 h-3" /> Fast
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section - Allow natural scrolling */}
            <section className="py-6">
                <div className="max-w-6xl mx-auto px-4 md:px-6 w-full">
                    {/* Progress Indicator - Ultra Compact */}
                    <div className="mb-3 md:mb-4 shrink-0">
                        <div className="flex items-center justify-center mb-2 md:mb-3">
                            {[1, 2, 3].map((step, index) => (
                                <div key={step} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 shadow-lg transform text-lg md:text-xl ${step <= currentStep
                                                ? "bg-linear-to-br from-blue-600 to-blue-700 scale-110"
                                                : "bg-gray-300 scale-100"
                                                } ${step === currentStep ? 'ring-3 ring-blue-200 animate-pulse' : ''}`}
                                        >
                                            {step}
                                        </div>
                                        <p className={`text-xs md:text-sm font-semibold mt-1.5 whitespace-nowrap transition-colors ${step <= currentStep ? 'text-blue-600' : 'text-gray-500'
                                            }`}>
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
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                {currentStep === 1 && "Select Location & Doctor"}
                                {currentStep === 2 && "Patient Information"}
                                {currentStep === 3 && "Review & Confirm"}
                                {currentStep === 4 && "Booking Complete"}
                            </h2>
                            <p className="text-gray-500 mt-1 text-xs font-medium">Step {Math.min(currentStep, 3)} of 3</p>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-3 md:p-4 lg:p-5">
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
                </div>
            </section>
        </div>
    )
}
