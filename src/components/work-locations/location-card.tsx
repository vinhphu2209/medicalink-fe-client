'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ExternalLink, MapPin, Phone } from 'lucide-react';

import { Button } from '../ui/button';

interface LocationCardProps {
  location: {
    id: string;
    name: string;
    address: string;
    phone: string;
    timezone: string;
    googleMapUrl: string | null;
  };
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className='w-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full'>
      <div className='p-4 space-y-4 h-full flex flex-col'>
        <div className='space-y-2'>
          <h3 className='text-xl font-bold text-gray-900'>{location.name}</h3>
          <div className='h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full' />
        </div>

        <div className='space-y-3'>
          <div className='flex items-start gap-3'>
            <MapPin className='w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0' />
            <p className='text-gray-600 text-sm leading-relaxed'>
              {location.address}
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <Phone className='w-5 h-5 text-blue-500 flex-shrink-0' />
            <a
              href={`tel:${location.phone}`}
              className=' hover:text-blue-600 transition-colors text-sm font-medium text-gray-600'
            >
              {location.phone}
            </a>
          </div>
        </div>
        {location.googleMapUrl && (
          <div className='flex items-end justify-end mt-auto flex-1'>
            <Link
              href={location.googleMapUrl}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                variant='ghost'
                size='sm'
                className='bg-sky-100 hover:bg-sky-200 cursor-pointer text-sky-900'
              >
                <Image
                  src='/icons/google-maps.png'
                  alt='Google Maps'
                  width={12}
                  height={12}
                />
                View on Google Maps
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
