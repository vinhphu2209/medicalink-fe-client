'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import {
  Award,
  Baby,
  Brain,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Search,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react';

import { DoctorCard } from '@/components/doctors/doctor-card';
import { DoctorCardSkeleton } from '@/components/doctors/doctor-card-skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Doctor {
  id: string;
  fullName: string;
  degree: string;
  position: string[];
  avatarUrl: string;
  portrait: string;
  introduction: string;
  workLocations: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  specialties: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface ApiResponse {
  success: boolean;
  data: Doctor[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalPages: number;
  };
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const url = new URL(`${baseUrl}/doctors/profile/public`);
        url.searchParams.append('page', currentPage.toString());
        url.searchParams.append('limit', '10');

        if (searchTerm) {
          url.searchParams.append('search', searchTerm);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const data: ApiResponse = await response.json();
        setDoctors(data.data);
        setMeta(data.meta);
        setError(null);
      } catch (err) {
        console.error('[v0] Error fetching doctors:', err);
        setError(err instanceof Error ? err.message : 'Failed to load doctors');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const stats = [
    { icon: Users, label: 'Expert Doctors', value: '50+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
    { icon: Shield, label: 'Patient Satisfaction', value: '99%' },
    { icon: Clock, label: 'Available 24/7', value: 'Always' },
  ];

  return (
    <div className='min-h-screen bg-white'>
      {/* Hero Section */}
      <section className='pt-[100px] relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pb-10 overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full' />
          <div className='absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full' />
          <div className='absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full' />
          <div className='absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full' />
        </div>

        <div className='max-w-7xl mx-auto px-6 relative'>
          <div className='text-center text-white space-y-6'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4'>
              <Stethoscope className='w-4 h-4' />
              <span className='text-sm font-medium'>World-Class Care</span>
            </div>

            <h1 className='text-5xl md:text-6xl font-bold leading-tight'>
              MEET OUR EXPERT
              <span className='block text-blue-300'>DOCTORS</span>
            </h1>

            <p className='text-blue-100 text-lg max-w-2xl mx-auto'>
              Connect with top-tier medical professionals dedicated to providing
              exceptional care and advanced treatments
            </p>

            <div className='flex flex-wrap items-center justify-center gap-3 mt-8'>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
              >
                <Users className='w-3 h-3 mr-1' />
                Top Specialists
              </Badge>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
              >
                <Shield className='w-3 h-3 mr-1' />
                Verified Profiles
              </Badge>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
              >
                <Clock className='w-3 h-3 mr-1' />
                Fast Booking
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='max-w-5xl mx-auto px-6 py-12'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6 mb-8'>
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>
              All Specialists
            </h2>
            <p className='text-gray-500 mt-1'>
              Found {meta.total} doctors matching your criteria
            </p>
          </div>

          {/* Search Bar */}
          <div className='w-full md:w-80 relative group'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors' />
            </div>
            <Input
              type='text'
              placeholder='Search doctors...'
              className='pl-10 bg-white border-gray-200 shadow-sm focus:border-blue-500'
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {loading ? (
          <div className='space-y-6'>
            {[1, 2, 3].map((i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className='text-center py-20 bg-red-50 rounded-xl'>
            <p className='text-red-600 font-medium mb-2'>
              Unavailable to load data
            </p>
            <p className='text-sm text-red-500 mb-6'>{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant='outline'
              className='border-red-200 text-red-700 hover:bg-red-100 hover:text-red-900'
            >
              Retry
            </Button>
          </div>
        ) : doctors.length === 0 ? (
          <div className='text-center py-24 bg-gray-50 rounded-xl border border-dashed border-gray-200'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <Search className='w-6 h-6 text-gray-400' />
            </div>
            <p className='text-gray-900 font-medium text-lg'>
              No doctors found
            </p>
            <p className='text-gray-500 mt-1'>
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className='space-y-6'>
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                id={doctor.id}
                fullName={doctor.fullName}
                degree={doctor.degree}
                position={doctor.position}
                avatarUrl={doctor.avatarUrl}
                portrait={doctor.portrait}
                workLocations={doctor.workLocations}
                specialties={doctor.specialties}
                introduction={doctor.introduction}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && meta.totalPages > 1 && (
          <div className='flex justify-center mt-12'>
            <div className='flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!meta.hasPrev}
                className='h-9 w-9 text-gray-500 hover:text-gray-900'
              >
                <ChevronLeft className='w-4 h-4' />
              </Button>

              <span className='text-sm font-medium text-gray-700 px-4'>
                Page {currentPage} of {meta.totalPages}
              </span>

              <Button
                variant='ghost'
                size='icon'
                onClick={() =>
                  setCurrentPage((p) => Math.min(meta.totalPages, p + 1))
                }
                disabled={!meta.hasNext}
                className='h-9 w-9 text-gray-500 hover:text-gray-900'
              >
                <ChevronRight className='w-4 h-4' />
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
