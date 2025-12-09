import Image from 'next/image';
import Link from 'next/link';

import parser from 'html-react-parser';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

import { removeHtmlElements } from '@/lib/utils';

interface DoctorCardProps {
  id: string;
  fullName: string;
  degree: string;
  position: string[];
  introduction?: string;
  avatarUrl: string;
  portrait?: string;
  specialties?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  workLocations: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  email?: string;
  phone?: string;
}

export function DoctorCard({
  id,
  fullName,
  degree,
  position,
  introduction,
  avatarUrl,
  portrait,
  specialties,
  workLocations,
  email,
}: DoctorCardProps) {
  return (
    <Link href={`/doctors/${id}`} className='block group'>
      <div className='flex flex-col px-4 md:x-6 py-3 md:py-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 overflow-hidden'>
        <div className='w-full'>
          <div className='flex items-start justify-between gap-4'>
            <Image
              src={
                portrait ||
                avatarUrl ||
                '/placeholder.svg?height=300&width=300&query=doctor'
              }
              alt={fullName}
              width={120}
              height={120}
              className='object-cover object-center size-26 rounded-sm'
            />
            <div className='flex-1'>
              <div className='flex flex-wrap gap-2 mb-1'>
                {position &&
                  position.slice(0, 1).map((pos, idx) => (
                    <span
                      key={idx}
                      className='text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-md'
                    >
                      {pos}
                    </span>
                  ))}
              </div>
              <p className='text-xs text-gray-700'>{degree}</p>
              <h3 className='text-lg md:text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors'>
                {fullName}
              </h3>
              {workLocations && workLocations.length > 0 && (
                <div className='flex flex-col gap-1 mt-1 mb-2'>
                  {workLocations.slice(0, 1).map((location) => (
                    <div
                      key={location.id}
                      className='flex items-start gap-2 text-sm text-gray-500'
                    >
                      <MapPin className='w-4 h-4 mt-0.5 text-gray-400' />
                      <span>{location.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Optional: Add a short truncated intro if available, or list top specialties */}
          {specialties && specialties.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {specialties.slice(0, 2).map((spec) => (
                <span
                  key={spec.id}
                  className='text-xs text-sky-700 bg-sky-50 px-2 py-1 rounded'
                >
                  {spec.name}
                </span>
              ))}
              {specialties.length > 2 && (
                <span className='text-xs text-sky-700 bg-sky-50 px-2 py-1 rounded'>
                  ... +{specialties.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        <div className='flex items-center justify-end mt-2'>
          <span className='text-sm font-medium text-blue-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform'>
            View Profile <ArrowRight className='w-4 h-4' />
          </span>
        </div>
      </div>
    </Link>
  );
}
