import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  Shield,
  Stethoscope,
  Users
} from 'lucide-react';

import { BlogsSection } from '@/components/home/blogs-section';
import { DoctorsSection } from '@/components/home/doctors-section';
import { SpecialtiesScrollLoop } from '@/components/home/specialties-scroll-loop';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LocationsSection } from '@/components/work-locations/locations-section';

// Fallback loading components
function DoctorsSectionSkeleton() {
  return (
    <section className='py-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <Skeleton className='h-12 w-96 mx-auto mb-4' />
          <Skeleton className='h-6 w-[500px] mx-auto' />
        </div>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-80 rounded-2xl' />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogsSectionSkeleton() {
  return (
    <section className='py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-12'>
          <Skeleton className='h-12 w-80 mx-auto mb-4' />
          <Skeleton className='h-6 w-96 mx-auto' />
        </div>
        <div className='grid md:grid-cols-3 gap-8'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-96 rounded-2xl' />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialtiesSkeleton() {
  return (
    <div className='w-full bg-linear-to-r from-blue-600 to-blue-700 py-8 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6'>
        <Skeleton className='h-8 w-full' />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className='min-h-screen pt-[68px]'>
      {/* Hero Section - Modern & Clean */}
      <section className='relative bg-linear-to-br from-blue-50 via-white to-blue-50 pt-20 pb-32 overflow-hidden'>
        {/* Subtle background decorations */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30' />
          <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20' />
        </div>

        <div className='max-w-7xl mx-auto px-6 relative'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Left Content */}
            <div className='space-y-8 text-center lg:text-left'>
              {/* Trust Badge */}
              <div className='inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium'>
                <Shield className='w-4 h-4' />
                <span>Trusted Healthcare Provider</span>
              </div>

              {/* Main Headline */}
              <div className='space-y-4'>
                <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight'>
                  Your Health,
                  <span className='block text-blue-600'>Our Priority</span>
                </h1>
                <p className='text-lg md:text-xl text-gray-600 max-w-2xl'>
                  Connect with certified doctors, book appointments instantly, and receive
                  quality healthcare from the comfort of your home.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <Link href='/appointments'>
                  <Button
                    size='lg'
                    className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all'
                  >
                    <Calendar className='w-5 h-5 mr-2' />
                    Book Appointment
                  </Button>
                </Link>
                <Link href='/doctors'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-2 border-gray-300 hover:border-blue-600 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-8 py-6 text-lg rounded-xl transition-all'
                  >
                    <Stethoscope className='w-5 h-5 mr-2' />
                    Find Doctors
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className='grid grid-cols-3 gap-6 pt-8 border-t border-gray-200'>
                <div className='text-center lg:text-left'>
                  <div className='flex items-center justify-center lg:justify-start gap-2 text-blue-600 mb-2'>
                    <Users className='w-5 h-5' />
                  </div>
                  <div className='font-semibold text-gray-900'>Expert Doctors</div>
                  <div className='text-sm text-gray-500'>Certified & Verified</div>
                </div>
                <div className='text-center lg:text-left'>
                  <div className='flex items-center justify-center lg:justify-start gap-2 text-blue-600 mb-2'>
                    <Clock className='w-5 h-5' />
                  </div>
                  <div className='font-semibold text-gray-900'>24/7 Support</div>
                  <div className='text-sm text-gray-500'>Always Available</div>
                </div>
                <div className='text-center lg:text-left'>
                  <div className='flex items-center justify-center lg:justify-start gap-2 text-blue-600 mb-2'>
                    <Heart className='w-5 h-5' />
                  </div>
                  <div className='font-semibold text-gray-900'>Patient Care</div>
                  <div className='text-sm text-gray-500'>Quality Service</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className='relative'>
              <div className='relative rounded-3xl overflow-hidden shadow-2xl'>
                <Image
                  src='/female-doctor-in-blue-scrubs-with-stethoscope-smil.jpg'
                  alt='Professional Healthcare Doctor'
                  width={600}
                  height={700}
                  className='w-full h-auto object-cover'
                  priority
                />

                {/* Floating Info Card */}
                <Card className='absolute bottom-6 left-6 right-6 p-5 bg-white/95 backdrop-blur-sm shadow-xl border-0'>
                  <div className='flex items-center gap-4'>
                    <div className='relative w-16 h-16 rounded-xl overflow-hidden shrink-0'>
                      <Image
                        src='/group-of-diverse-doctors.jpg'
                        alt='Medical Team'
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='font-semibold text-gray-900 mb-1'>
                        Professional Medical Team
                      </div>
                      <div className='text-sm text-gray-600'>
                        Dedicated to your health and wellbeing
                      </div>
                    </div>
                    <CheckCircle2 className='w-8 h-8 text-green-500 shrink-0' />
                  </div>
                </Card>
              </div>

              {/* Decorative Elements */}
              <div className='absolute -top-6 -right-6 w-32 h-32 bg-blue-500 rounded-3xl -z-10 rotate-12' />
              <div className='absolute -bottom-6 -left-6 w-32 h-32 bg-blue-300 rounded-3xl -z-10 -rotate-12' />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Quick Access */}
      <section className='py-16 bg-white border-y border-gray-100'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid md:grid-cols-3 gap-8'>
            <Card className='p-8 border-0 bg-linear-to-br from-blue-50 to-white hover:shadow-lg transition-shadow'>
              <div className='w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6'>
                <Calendar className='w-7 h-7 text-blue-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Easy Appointment Booking
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Schedule your visit with just a few clicks. Choose your preferred doctor,
                date, and time slot that works best for you.
              </p>
            </Card>

            <Card className='p-8 border-0 bg-linear-to-br from-green-50 to-white hover:shadow-lg transition-shadow'>
              <div className='w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6'>
                <Stethoscope className='w-7 h-7 text-green-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Specialist Care
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Access a wide range of medical specialists across various departments.
                Expert care for every health concern.
              </p>
            </Card>

            <Card className='p-8 border-0 bg-linear-to-br from-purple-50 to-white hover:shadow-lg transition-shadow'>
              <div className='w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6'>
                <Shield className='w-7 h-7 text-purple-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-3'>
                Safe & Secure
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Your health data is protected with the highest security standards.
                Privacy and confidentiality guaranteed.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet Our Best Doctors - With Suspense */}
      <Suspense fallback={<DoctorsSectionSkeleton />}>
        <DoctorsSection />
      </Suspense>

      {/* Our Clinics */}
      <LocationsSection />

      {/* About Section - Redesigned */}
      <section className='py-24 bg-linear-to-br from-gray-50 to-white scroll-mt-20' id='about'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            {/* Image Side */}
            <div className='relative order-2 lg:order-1'>
              <div className='relative rounded-3xl overflow-hidden shadow-2xl'>
                <Image
                  src='/male-doctor-in-blue-scrubs-with-tablet-smiling-pro.jpg'
                  alt='Medical Professional'
                  width={600}
                  height={700}
                  className='w-full h-auto object-cover'
                />
              </div>

              {/* Decorative Elements */}
              <div className='absolute -top-8 -left-8 w-40 h-40 bg-blue-100 rounded-full -z-10' />
              <div className='absolute -bottom-8 -right-8 w-48 h-48 bg-blue-500/10 rounded-full -z-10' />

              {/* Experience Badge */}
              <div className='absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-2xl shadow-xl'>
                <div className='text-center'>
                  <div className='text-4xl font-bold mb-1'>10+</div>
                  <div className='text-sm font-medium'>Years Experience</div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className='space-y-8 order-1 lg:order-2'>
              <div className='space-y-4'>
                <div className='inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold'>
                  About MedicaLink
                </div>
                <h2 className='text-4xl md:text-5xl font-bold text-gray-900 leading-tight'>
                  Committed to Excellence in Healthcare
                </h2>
                <p className='text-lg text-gray-600 leading-relaxed'>
                  MedicaLink has been providing exceptional healthcare services with a focus
                  on patient-centered care, cutting-edge medical technology, and a team of
                  highly qualified healthcare professionals.
                </p>
              </div>

              {/* Features Grid */}
              <div className='grid sm:grid-cols-2 gap-6'>
                <div className='space-y-3'>
                  <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                    <CheckCircle2 className='w-6 h-6 text-blue-600' />
                  </div>
                  <h3 className='font-bold text-gray-900 text-lg'>
                    Specialized Care
                  </h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    Expert doctors across multiple specialties providing comprehensive care
                  </p>
                </div>

                <div className='space-y-3'>
                  <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                    <CheckCircle2 className='w-6 h-6 text-green-600' />
                  </div>
                  <h3 className='font-bold text-gray-900 text-lg'>
                    Modern Facilities
                  </h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    State-of-the-art medical equipment and comfortable environments
                  </p>
                </div>

                <div className='space-y-3'>
                  <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                    <CheckCircle2 className='w-6 h-6 text-purple-600' />
                  </div>
                  <h3 className='font-bold text-gray-900 text-lg'>
                    24/7 Emergency
                  </h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    Round-the-clock emergency services and medical support
                  </p>
                </div>

                <div className='space-y-3'>
                  <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
                    <CheckCircle2 className='w-6 h-6 text-orange-600' />
                  </div>
                  <h3 className='font-bold text-gray-900 text-lg'>
                    Affordable Care
                  </h3>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    Quality healthcare services at competitive and transparent pricing
                  </p>
                </div>
              </div>

              <div className='pt-4'>
                <Link href='/about'>
                  <Button
                    size='lg'
                    className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all'
                  >
                    Learn More About Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Scroll */}
      <Suspense fallback={<SpecialtiesSkeleton />}>
        <SpecialtiesScrollLoop />
      </Suspense>

      {/* Latest Blog */}
      <Suspense fallback={<BlogsSectionSkeleton />}>
        <BlogsSection />
      </Suspense>

      {/* CTA Section - Final Call to Action */}
      <section className='py-20 bg-linear-to-br from-blue-600 to-blue-700'>
        <div className='max-w-5xl mx-auto px-6 text-center'>
          <div className='space-y-6'>
            <h2 className='text-4xl md:text-5xl font-bold text-white'>
              Ready to Take Care of Your Health?
            </h2>
            <p className='text-xl text-blue-100 max-w-2xl mx-auto'>
              Book an appointment with our experienced doctors today and take the first
              step towards better health.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
              <Link href='/appointments'>
                <Button
                  size='lg'
                  className='bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all'
                >
                  <Calendar className='w-5 h-5 mr-2' />
                  Book Appointment Now
                </Button>
              </Link>
              <Link href='/doctors'>
                <Button
                  size='lg'
                  variant='outline'
                  className='border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl transition-all'
                >
                  Browse All Doctors
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
