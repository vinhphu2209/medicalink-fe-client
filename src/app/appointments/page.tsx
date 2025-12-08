"use client"

import { useState } from "react"
import StepOne from "@/components/booking/step-one"
import StepTwo from "@/components/booking/step-two"
import StepThree from "@/components/booking/step-three"

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

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-32 pb-16">
            <div className="max-w-4xl mx-auto px-4">
                {/* Step Indicator */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all ${step <= currentStep ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`flex-1 h-1 mx-4 transition-all ${step < currentStep ? "bg-blue-600" : "bg-gray-300"}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {currentStep === 1 && "Select Location & Doctor"}
                            {currentStep === 2 && "Patient Information"}
                            {currentStep === 3 && "Review & Confirm"}
                        </h1>
                    </div>
                </div>

                {/* Steps */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {currentStep === 1 && <StepOne onComplete={handleStepOneComplete} />}
                    {currentStep === 2 && <StepTwo onComplete={handleStepTwoComplete} bookingData={bookingData} />}
                    {currentStep === 3 && <StepThree onComplete={handleStepThreeComplete} bookingData={bookingData} />}
                    {currentStep === 4 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked Successfully!</h2>
                            <p className="text-gray-600 mb-6">We will contact you shortly to confirm your appointment.</p>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Return to Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
