import { Suspense } from 'react';

import Image from 'next/image';

import { CheckCircle2 } from 'lucide-react';

import { BlogsSection } from '@/components/home/blogs-section';
import { DoctorsSection } from '@/components/home/doctors-section';
import { HeroSection } from '@/components/home/hero-section';
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
    <div className='min-h-screen'>
      {/* Hero Section */}
      <HeroSection />

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
      </section>
      {/* Specialties Scroll Loop - With Suspense */}
      <Suspense fallback={<SpecialtiesSkeleton />}>
        <SpecialtiesScrollLoop />
      </Suspense>

      {/* Latest Blog - With Suspense */}
      <Suspense fallback={<BlogsSectionSkeleton />}>
        <BlogsSection />
      </Suspense>
    </div>
  );
}
