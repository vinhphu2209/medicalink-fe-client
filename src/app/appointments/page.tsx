'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Shield,
  Stethoscope,
  User,
} from 'lucide-react';

import StepOne from '@/components/booking/step-one';
import StepThree from '@/components/booking/step-three';
import StepTwo from '@/components/booking/step-two';
import { Card } from '@/components/ui/card';

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const doctorIdFromUrl = searchParams.get('doctorId') || undefined;
  const [currentStep, setCurrentStep] = useState(1);

  // Auto scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);
  const [bookingData, setBookingData] = useState({
    locationId: '',
    locationName: '',
    locationAddress: '',
    specialtyId: '',
    doctorId: '',
    doctorName: '',
    timeStart: '',
    timeEnd: '',
    serviceDate: '',
    patientId: '',
    reason: '',
    eventId: '',
  });

  const handleStepOneComplete = (data: any) => {
    setBookingData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(2);
  };

  const handleStepTwoComplete = (patientId: string) => {
    setBookingData((prev) => ({
      ...prev,
      patientId,
    }));
    setCurrentStep(3);
  };

  const handleStepThreeComplete = () => {
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Location & Doctor',
      icon: Stethoscope,
      description: 'Choose your preferred doctor and location',
    },
    {
      number: 2,
      title: 'Your Information',
      icon: User,
      description: 'Enter your information or retrieve old data',
    },
    {
      number: 3,
      title: 'Confirmation',
      icon: Calendar,
      description: 'Review and confirm booking',
    },
  ];

  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Main Content */}
      <section className='pb-6 pt-[100px]'>
        <div className='max-w-4xl mx-auto px-4'>
          {/* Progress Steps */}
          <Card className='p-3 mb-4 bg-white'>
            <div className='flex items-center justify-between'>
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = step.number === currentStep;
                const isCompleted = step.number < currentStep;

                return (
                  <div key={step.number} className='flex items-center flex-1'>
                    <div className='flex items-center gap-2 flex-1'>
                      {/* Icon & Number */}
                      <div className='flex flex-col items-center'>
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-green-100 text-green-600'
                              : isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className='w-4 h-4' />
                          ) : (
                            <Icon className='w-4 h-4' />
                          )}
                        </div>
                      </div>

                      {/* Step Info - Hidden on mobile for non-active steps */}
                      <div
                        className={`flex-1 ${!isActive && 'hidden md:block'}`}
                      >
                        <p
                          className={`text-xs font-semibold ${
                            isActive
                              ? 'text-blue-600'
                              : isCompleted
                                ? 'text-green-600'
                                : 'text-gray-400'
                          }`}
                        >
                          Step {step.number}
                        </p>
                        <p
                          className={`text-sm font-bold ${
                            isActive ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className='text-xs text-gray-500 mt-0.5'>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className='hidden md:flex items-center px-3'>
                        <div
                          className={`h-0.5 w-12 rounded transition-all ${
                            isCompleted ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile: Current Step Title */}
            <div className='md:hidden mt-3 pt-3 border-t'>
              <p className='text-xs text-gray-500'>Current Step</p>
              <p className='text-lg font-bold text-gray-900'>
                {steps[currentStep - 1]?.title}
              </p>
              <p className='text-xs text-gray-600 mt-0.5'>
                {steps[currentStep - 1]?.description}
              </p>
            </div>
          </Card>

          {/* Step Content */}
          <Card className='p-4'>
            {currentStep === 1 && (
              <StepOne
                onComplete={handleStepOneComplete}
                onBack={currentStep > 1 ? handleBack : undefined}
                initialDoctorId={doctorIdFromUrl}
              />
            )}
            {currentStep === 2 && (
              <StepTwo
                onComplete={handleStepTwoComplete}
                bookingData={bookingData}
                onBack={handleBack}
              />
            )}
            {currentStep === 3 && (
              <StepThree
                onComplete={handleStepThreeComplete}
                bookingData={bookingData}
                onBack={handleBack}
              />
            )}
            {currentStep === 4 && (
              <div className='text-center py-12'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <CheckCircle2 className='w-8 h-8 text-green-600' />
                </div>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  Appointment Booked!
                </h2>
                <p className='text-sm text-gray-600 mb-6 max-w-md mx-auto'>
                  We will contact you shortly to confirm your appointment
                  details.
                </p>
                <button
                  onClick={() => (window.location.href = '/')}
                  className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium'
                >
                  Return to Home
                </button>
              </div>
            )}
          </Card>

          {/* Info Footer */}
          <div className='mt-4 flex items-center justify-center gap-4 text-xs text-gray-500'>
            <div className='flex items-center gap-1'>
              <Shield className='w-3.5 h-3.5' />
              <span>Secure Booking</span>
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='w-3.5 h-3.5' />
              <span>Quick Process</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className='bg-gray-50 min-h-screen'>
          <section className='pb-6 pt-[100px]'>
            <div className='max-w-4xl mx-auto px-4'>
              <Card className='p-8 text-center min-h-[calc(100vh-200px)] flex items-center justify-center'>
                <Loader2 className='size-12 text-blue-600 animate-spin' />
                <p className='text-sm text-gray-600'>Loading...</p>
              </Card>
            </div>
          </section>
        </div>
      }
    >
      <AppointmentsContent />
    </Suspense>
  );
}
