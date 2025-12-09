'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { Award, Clock, Search, Shield, Stethoscope, Users } from 'lucide-react';

import { doctorApi } from '@/api/doctors';
import { specialtyApi } from '@/api/specialties';
import { WorkLocation, getWorkLocations } from '@/api/work-locations';
import { DoctorCard } from '@/components/doctors/doctor-card';
import { DoctorCardSkeleton } from '@/components/doctors/doctor-card-skeleton';
import { DoctorFilter } from '@/components/doctors/doctors-filter';
import { PaginatedNavigation } from '@/components/shared/paginated-navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import type { Doctor, Specialty } from '@/types/doctor';

export default function DoctorsPage() {
  // Data State
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [workLocations, setWorkLocations] = useState<WorkLocation[]>([]);

  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [currentPage, setCurrentPage] = useState(1);

  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasNext: false,
    hasPrev: false,
    totalPages: 1,
  });

  // Fetch Filters on Mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [specialtiesData, locationsData] = await Promise.all([
          specialtyApi.getSpecialties(),
          getWorkLocations(),
        ]);
        setSpecialties(specialtiesData);
        setWorkLocations(locationsData);
      } catch (err) {
        console.error('Failed to fetch filter data:', err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch Doctors when params change
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          limit: 10,
          search: debouncedSearch || undefined,
          sortBy,
          sortOrder,
          specialtyIds:
            selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
          workLocationIds:
            selectedLocations.length > 0 ? selectedLocations : undefined,
        };

        const response = await doctorApi.getDoctors(params);
        setDoctors(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        console.error('Error fetching doctors:', err);
        setError(err.message || 'Failed to load doctors');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [
    currentPage,
    debouncedSearch,
    selectedSpecialties,
    selectedLocations,
    sortBy,
    sortOrder,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    debouncedSearch,
    selectedSpecialties,
    selectedLocations,
    sortBy,
    sortOrder,
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialties([]);
    setSelectedLocations([]);
    setCurrentPage(1);
  };

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='pt-[100px] relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pb-10 overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          {/* Shapes */}
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
      <section className='max-w-7xl mx-auto px-6 py-12'>
        <div className='flex flex-col gap-6 mb-8'>
          {/* Header & Result Count */}
          <div>
            <h2 className='text-3xl font-bold text-gray-900'>
              All Specialists
            </h2>
            {!loading && (
              <p className='text-gray-500 mt-1'>
                Found {meta.total} doctors matching your criteria
              </p>
            )}
          </div>

          {/* Filters Bar */}
          <div className='flex flex-col lg:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm'>
            <div className='flex flex-col md:flex-row gap-3 w-full lg:w-auto'>
              {/* Search */}
              <div className='relative w-full md:w-80'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search className='h-4 w-4 text-gray-400' />
                </div>
                <Input
                  type='text'
                  placeholder='Search doctors by name...'
                  className='pl-10'
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              {/* Filters */}
              <DoctorFilter
                title='Specialty'
                options={specialties}
                selectedIds={selectedSpecialties}
                onChange={setSelectedSpecialties}
              />
              <DoctorFilter
                title='Location'
                options={workLocations}
                selectedIds={selectedLocations}
                onChange={setSelectedLocations}
              />
            </div>

            {/* Sort */}
            <div className='w-full lg:w-auto'>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(val) => {
                  const [field, order] = val.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'ASC' | 'DESC');
                }}
              >
                <SelectTrigger className='w-full md:w-[200px]'>
                  <SelectValue placeholder='Sort By' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='createdAt-DESC'>Newest First</SelectItem>
                  <SelectItem value='createdAt-ASC'>Oldest First</SelectItem>
                  <SelectItem value='fullName-ASC'>Name A-Z</SelectItem>
                  <SelectItem value='fullName-DESC'>Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='grid md:grid-cols-2 gap-6'>
            {[1, 2, 3, 4].map((i) => (
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
            <p className='text-gray-500 mt-1 mb-6'>
              Try adjusting your search terms or filters
            </p>
            <Button onClick={handleClearFilters} variant='outline'>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 gap-6'>
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
          <div className='mt-12'>
            <PaginatedNavigation
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
              hasNext={meta.hasNext}
              hasPrev={meta.hasPrev}
            />
          </div>
        )}
      </section>
    </div>
  );
}
