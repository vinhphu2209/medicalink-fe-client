import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { removeHtmlElements } from '@/lib/utils';

interface DoctorCardSmallProps {
  id: string;
  fullName: string;
  degree: string;
  introduction?: string;
  avatarUrl: string;
  portrait?: string;
}

export function DoctorCardSmall({
  id,
  fullName,
  degree,
  introduction,
  avatarUrl,
  portrait,
}: DoctorCardSmallProps) {
  return (
    <Link href={`/doctors/${id}`} className='block group'>
      <div className='bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 overflow-hidden'>
        <div className='flex gap-2 p-2'>
          {/* Image */}
          <div className='shrink-0 w-20 h-26 relative bg-gray-50 rounded-lg overflow-hidden'>
            <Image
              src={
                portrait ||
                avatarUrl ||
                '/placeholder.svg?height=80&width=80&query=doctor'
              }
              alt={fullName}
              fill
              className='object-cover object-top'
            />
          </div>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <p className='text-xs text-blue-600 font-medium mb-1 line-clamp-1'>
              {degree}
            </p>
            <h3 className='text-base font-bold text-gray-900 mb-0.5 group-hover:text-blue-600 transition-colors line-clamp-2'>
              {fullName}
            </h3>
            {introduction && (
              <p className='text-xs text-gray-500 line-clamp-2'>
                {removeHtmlElements(introduction)}
              </p>
            )}

            <div className='mt-2 flex items-center justify-end text-xs font-medium text-blue-600'>
              View Profile <ArrowRight className='w-3 h-3 ml-1' />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
