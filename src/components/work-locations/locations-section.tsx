'use client';

import { useEffect, useState } from 'react';

import type { WorkLocation } from '@/api/work-locations';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { LocationCard } from './location-card';

export function LocationsSection() {
  const [locations, setLocations] = useState<WorkLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'https://api.medicalink.click/api';
        const response = await fetch(`${baseUrl}/work-locations/public`);

        if (!response.ok) {
          throw new Error('Failed to fetch work locations');
        }

        const result = await response.json();
        const data = result.data?.filter(
          (location: WorkLocation) =>
            location.name && location.address && location.phone
        );
        setLocations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching work locations:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load locations'
        );
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <section className='bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] py-20'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-white mb-12'>
            <h2 className='text-4xl font-bold mb-2'>OUR CLINICS</h2>
            <p className='text-blue-200'>
              Visit us at our convenient locations
            </p>
          </div>
          <div className='flex items-center justify-center h-64'>
            <div className='text-white text-lg'>Loading locations...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || locations.length === 0) {
    return (
      <section className='bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] py-20'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-white mb-12'>
            <h2 className='text-4xl font-bold mb-2'>OUR CLINICS</h2>
            <p className='text-blue-200'>
              Visit us at our convenient locations
            </p>
          </div>
          <div className='flex items-center justify-center h-64'>
            <div className='text-white text-lg'>
              {error || 'No locations available'}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] pt-10 pb-14'>
      <div className='px-6'>
        <div className='text-white mb-12 mx-1.5'>
          <h2 className='text-4xl font-bold mb-2'>OUR CLINICS</h2>
          <p className='text-blue-200'>
            Visit us at our convenient locations across the region
          </p>
        </div>

        <div className='relative w-[calc(100%-12px)] mx-auto'>
          <Carousel
            opts={{
              align: 'start',
              loop: false,
              dragFree: true,
            }}
            className='w-full'
          >
            <CarouselContent className='-ml-2 md:-ml-4'>
              {locations.map((location) => (
                <CarouselItem
                  key={location.id}
                  className='pl-2 md:pl-4 basis-[85%] sm:basis-[45%] lg:basis-[380px]'
                >
                  <LocationCard location={location} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='-left-4 bg-white/90 hover:bg-white text-gray-900 border-gray-200 shadow-lg' />
            <CarouselNext className='-right-4 bg-white/90 hover:bg-white text-gray-900 border-gray-200 shadow-lg' />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
