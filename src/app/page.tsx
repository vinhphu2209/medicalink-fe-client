import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { CheckCircle2 } from 'lucide-react';

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
    <section className='py-20'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex items-center justify-between mb-12'>
          <div>
            <Skeleton className='h-10 w-80 mb-2' />
            <Skeleton className='h-5 w-96' />
          </div>
          <Skeleton className='h-10 w-40' />
        </div>
        <div className='grid md:grid-cols-2 gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-48' />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogsSectionSkeleton() {
  return (
    <section className='py-20'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex items-center justify-between mb-12'>
          <div>
            <Skeleton className='h-10 w-80 mb-2' />
            <Skeleton className='h-5 w-96' />
          </div>
          <Skeleton className='h-10 w-32' />
        </div>
        <div className='grid md:grid-cols-3 gap-8'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-96' />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialtiesSkeleton() {
  return (
    <div className='w-full bg-linear-to-r from-blue-600 to-blue-700 py-6 overflow-hidden mt-auto'>
      <div className='max-w-7xl mx-auto px-6'>
        <Skeleton className='h-6 w-full' />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className='min-h-screen pt-[68px]'>
      {/* Hero Section */}
      <section className='relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pt-24 pb-16 overflow-hidden h-[calc(100dvh-68px)] '>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full' />
          <div className='absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full' />
          <div className='absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full' />
          <div className='absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full' />
        </div>

        <div className='max-w-7xl mx-auto px-6 relative'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='text-white space-y-6'>
              <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full'>
                <div className='flex -space-x-2'>
                  <div className='w-6 h-6 rounded-full bg-blue-400 border-2 border-white' />
                  <div className='w-6 h-6 rounded-full bg-blue-500 border-2 border-white' />
                  <div className='w-6 h-6 rounded-full bg-blue-600 border-2 border-white' />
                </div>
                <span className='text-sm'>Verified Doctors</span>
              </div>

              <h1 className='text-5xl md:text-6xl font-bold leading-tight'>
                MEDICALINK
                <span className='flex items-center gap-2'>
                  HOSPITAL
                  <span className='text-red-500 text-4xl'>+</span>
                </span>
              </h1>

              <p className='text-blue-100 text-lg'>
                Providing quality healthcare services with experienced doctors
                and modern facilities.
              </p>

              <div className='flex flex-wrap gap-4'>
                <Link href='/appointments'>
                  <Button
                    size='lg'
                    className='bg-blue-500 hover:bg-blue-600 text-white'
                  >
                    Book Appointment Now
                  </Button>
                </Link>
                <Link href='#about'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-white text-white hover:bg-white/10 hover:text-white bg-transparent'
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className='flex gap-8 pt-4'>
                <div>
                  <div className='text-3xl font-bold'>12K+</div>
                  <div className='text-blue-200 text-sm'>Happy Patients</div>
                </div>
                <div>
                  <div className='text-3xl font-bold'>99%</div>
                  <div className='text-blue-200 text-sm'>Satisfaction</div>
                </div>
              </div>
            </div>

            <div className='relative'>
              <div className='relative rounded-3xl overflow-hidden'>
                <Image
                  src='/female-doctor-in-blue-scrubs-with-stethoscope-smil.jpg'
                  alt='Healthcare Doctor'
                  width={500}
                  height={600}
                  className='w-full h-auto'
                />
              </div>

              {/* Floating Card */}
              <Card className='absolute bottom-8 left-8 p-4 bg-white shadow-xl'>
                <div className='flex items-center gap-3'>
                  <Image
                    src='/group-of-diverse-doctors.jpg'
                    alt='Doctors'
                    width={60}
                    height={60}
                    className='rounded-lg'
                  />
                  <div>
                    <div className='font-semibold text-sm'>
                      Medical Achievement
                    </div>
                    <div className='text-xs text-gray-600'>
                      Health Protection
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Best Doctors - With Suspense */}
      <Suspense fallback={<DoctorsSectionSkeleton />}>
        <DoctorsSection />
      </Suspense>

      {/* Our Clinics */}
      <LocationsSection />

      {/* About & Specialist Section */}
      <section
        className='flex flex-col justify-center h-[calc(100dvh-80px)] scroll-mt-20'
        id='about'
      >
        {/* About Medical Section */}
        <div className='max-w-7xl mx-auto px-6 py-20'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='relative'>
              <div className='absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full -z-10' />
              <Image
                src='/male-doctor-in-blue-scrubs-with-tablet-smiling-pro.jpg'
                alt='Doctor'
                width={400}
                height={500}
                className='rounded-2xl w-full h-auto'
              />
              <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white -z-10'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>10+</div>
                  <div className='text-xs'>Years</div>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <div>
                <h2 className='text-4xl font-bold mb-2'>
                  ABOUT MEDICALINK <span className='text-blue-500'>✦</span>
                </h2>
                <div className='flex items-center gap-4 text-blue-500 font-semibold'>
                  <span>10+</span>
                  <span className='text-gray-400'>Years of Experience</span>
                </div>
              </div>

              <p className='text-gray-600 leading-relaxed'>
                Since 2007 We're working Medical group of more than 12000+
                Patients help from our website
              </p>

              <div className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-blue-500 mt-1 shrink-0' />
                  <div>
                    <div className='font-semibold'>We're very specialized</div>
                    <div className='text-sm text-gray-600'>
                      Expert doctors in various medical fields
                    </div>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-blue-500 mt-1 shrink-0' />
                  <div>
                    <div className='font-semibold'>
                      Professional and Experienced
                    </div>
                    <div className='text-sm text-gray-600'>
                      Highly qualified medical professionals
                    </div>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-blue-500 mt-1 shrink-0' />
                  <div>
                    <div className='font-semibold'>24/7 Emergency Support</div>
                    <div className='text-sm text-gray-600'>
                      Round the clock medical assistance
                    </div>
                  </div>
                </div>
              </div>

              <Button className='bg-blue-500 hover:bg-blue-600 text-white'>
                Read More
              </Button>
            </div>
          </div>
        </div>

        {/* Specialties Scroll Loop - With Suspense */}
        <Suspense fallback={<SpecialtiesSkeleton />}>
          <SpecialtiesScrollLoop />
        </Suspense>
      </section>

      {/* Latest Blog - With Suspense */}
      <Suspense fallback={<BlogsSectionSkeleton />}>
        <BlogsSection />
      </Suspense>
    </div>
  );
}
