import { use } from 'react';

import Link from 'next/link';

import parser from 'html-react-parser';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Info,
  Stethoscope,
  Users,
} from 'lucide-react';

import { DoctorCardSmall } from '@/components/doctors/doctor-card-small';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { replaceNbsps } from '@/lib/utils';

interface SpecialtyDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  infoSections: Array<{
    id: string;
    name: string;
    content: string;
  }>;
}

interface Doctor {
  id: string;
  fullName: string;
  isMale: boolean | null;
  degree: string | null;
  position: string[];
  introduction: string | null;
  avatarUrl: string | null;
  specialties: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  workLocations: Array<{
    id: string;
    name: string;
    address: string;
  }>;
  appointmentDuration: number;
}

async function getSpecialtyDetail(slug: string): Promise<SpecialtyDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/specialties/public/${slug}`, {
    next: { revalidate: 0 },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch specialty');
  }
  return data.data;
}

async function getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/doctors/profile/public?page=1&limit=10&specialtyIds=${specialtyId}`,
    {
      next: { revalidate: 0 },
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch doctors');
  return data.data || [];
}

export default function SpecialtyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  return <SpecialtyContent slug={slug} />;
}

async function SpecialtyContent({ slug }: { slug: string }) {
  try {
    const specialty = await getSpecialtyDetail(slug);
    const doctors = await getDoctorsBySpecialty(specialty.id);

    return (
      <div className='min-h-screen pt-[68px]'>
        {/* Hero Section */}
        <section className='relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] py-10 overflow-hidden'>
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full' />
            <div className='absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full' />
          </div>

          <div className='max-w-7xl mx-auto px-6 relative'>
            <Link href='/specialities'>
              <Button
                variant='ghost'
                className='mb-6 text-white hover:bg-white/10 hover:text-white cursor-pointer'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Specialties
              </Button>
            </Link>

            <div className='text-white space-y-4'>
              <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full'>
                <Stethoscope className='w-4 h-4' />
                <span className='text-sm font-medium'>Medical Specialty</span>
              </div>

              <h1 className='text-2xl md:text-3xl font-bold leading-tight'>
                {specialty.name}
              </h1>

              {specialty.description && (
                <p className='text-blue-100 text-md max-w-3xl leading-relaxed'>
                  {specialty.description}
                </p>
              )}

              <div className='flex flex-wrap items-center gap-2'>
                <Badge
                  variant='secondary'
                  className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
                >
                  <Users className='w-3 h-3 mr-1' />
                  {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'}
                </Badge>
                <Badge
                  variant='secondary'
                  className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
                >
                  <Clock className='w-3 h-3 mr-1' />
                  24/7 Available
                </Badge>
                <Badge
                  variant='secondary'
                  className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
                >
                  <CheckCircle2 className='w-3 h-3 mr-1' />
                  Certified Specialists
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className='max-w-7xl mx-auto px-6 py-12'>
          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Left Column - Info Sections */}
            <div className='lg:col-span-2 space-y-6'>
              {specialty.infoSections && specialty.infoSections.length > 0 ? (
                specialty.infoSections.map((section) => (
                  <Card
                    key={section.id}
                    className='bg-white gap-2 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800'
                  >
                    <CardHeader>
                      <div className='flex items-center gap-3'>
                        <div className='p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                          <Info className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                        </div>
                        <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                          {section.name}
                        </h2>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className='text-sm *:mb-2 *:wrap-normal leading-5'>
                        {parser(replaceNbsps(section.content))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className='bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800'>
                  <CardContent className='pt-6'>
                    <p className='text-gray-500 dark:text-gray-400 text-center py-8'>
                      No additional information available at this time.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Doctors List */}
            <div className='space-y-6'>
              <div className='sticky top-24'>
                <Card className='bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 gap-2'>
                  <CardHeader>
                    <div className='flex items-center gap-2'>
                      <div className='p-1 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                        <Users className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                      </div>
                      <h2 className='text-md font-bold text-gray-900 dark:text-white'>
                        Our Specialists
                      </h2>
                    </div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {doctors.length}{' '}
                      {doctors.length === 1
                        ? 'expert doctor'
                        : 'expert doctors'}{' '}
                      available
                    </p>
                  </CardHeader>
                  <CardContent className='p-2 pb-0'>
                    {doctors.length > 0 ? (
                      <div className='flex flex-col gap-2'>
                        {doctors.map((doctor) => (
                          <DoctorCardSmall
                            key={doctor.id}
                            id={doctor.id}
                            fullName={doctor.fullName}
                            degree={doctor.degree || ''}
                            introduction={doctor.introduction || undefined}
                            avatarUrl={
                              doctor.avatarUrl || '/placeholder-user.jpg'
                            }
                            portrait={doctor.avatarUrl || undefined}
                          />
                        ))}
                        <Link href={`/doctors?specialty=${specialty.id}`}>
                          <Button
                            variant='outline'
                            className='w-full mt-2 -mb-2'
                          >
                            View All Doctors
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className='text-center py-8'>
                        <Users className='w-12 h-12 mx-auto text-gray-400 mb-3' />
                        <p className='text-gray-500 dark:text-gray-400'>
                          No doctors available for this specialty at the moment.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className='min-h-screen pt-[68px] flex items-center justify-center'>
        <Card className='max-w-md mx-auto'>
          <CardContent className='pt-6 text-center'>
            <Stethoscope className='w-16 h-16 mx-auto text-gray-400 mb-4' />
            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
              Specialty Not Found
            </h2>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              {error instanceof Error
                ? error.message
                : "The specialty you're looking for doesn't exist or has been removed."}
            </p>
            <Link href='/specialities'>
              <Button>Back to Specialties</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}
