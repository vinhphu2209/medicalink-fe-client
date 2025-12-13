import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

import { DoctorCard } from '@/components/doctors/doctor-card';
import type { Doctor } from '@/types/doctor';

async function getTopDoctors(): Promise<Doctor[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(
      `${baseUrl}/doctors/profile/public?limit=4&sortBy=createdAt&sortOrder=DESC`,
      {
        next: { revalidate: 0 }, // Revalidate every hour
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch doctors');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function DoctorsSection() {
  const doctors = await getTopDoctors();

  if (doctors.length === 0) {
    return null;
  }

  return (
    <section className='py-20'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex items-center justify-between mb-12'>
          <div>
            <h2 className='text-4xl font-bold mb-2'>MEET OUR BEST DOCTORS</h2>
            <p className='text-gray-600'>
              Experienced professionals dedicated to your health
            </p>
          </div>
          <Link
            href='/doctors'
            className='flex items-center gap-4 text-blue-500 font-semibold hover:text-blue-600 transition-colors'
          >
            <span>View All Doctors</span>
            <ChevronRight className='w-5 h-5' />
          </Link>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              id={doctor.id}
              fullName={doctor.fullName}
              degree={doctor.degree}
              position={doctor.position}
              introduction={doctor.introduction}
              avatarUrl={doctor.avatarUrl}
              portrait={doctor.portrait}
              specialties={doctor.specialties}
              workLocations={doctor.workLocations}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
