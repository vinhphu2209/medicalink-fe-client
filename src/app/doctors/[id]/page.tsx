import Image from 'next/image';
import Link from 'next/link';

import parser from 'html-react-parser';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  MapPin,
  Stethoscope,
} from 'lucide-react';

import { ReviewForm } from '@/components/doctors/review-form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { replaceNbsps } from '@/lib/utils';

interface DoctorDetail {
  id: string;
  fullName: string;
  degree: string;
  position: string[];
  avatarUrl: string;
  portrait: string;
  introduction: string;
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
  memberships: string[];
  awards: string[];
  research: string;
  trainingProcess: string[];
  experience: string[];
  appointmentDuration: number;
}

async function getDoctorById(id: string): Promise<DoctorDetail> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/doctors/profile/public/${id}`, {
    cache: 'no-store', // Dynamic, no caching
  });

  if (!response.ok) {
    throw new Error('Failed to fetch doctor details');
  }

  const json = await response.json();
  if (!json.success || !json.data) {
    throw new Error(json.message || 'Doctor not found');
  }

  return json.data;
}

export default async function DoctorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  try {
    const doctor = await getDoctorById(id);

    return (
      <div className='min-h-screen pb-20'>
        {/* Header / Banner */}
        <div className='relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pb-24 pt-[100px] overflow-hidden'>
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full' />
            <div className='absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full' />
          </div>

          <div className='max-w-7xl mx-auto px-6 relative z-10'>
            <Link
              href='/doctors'
              className='inline-flex items-center text-sm text-blue-100 hover:text-white transition-colors mb-6'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Doctors
            </Link>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-6 -mt-24 relative z-20'>
          {/* Profile Card */}
          <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 mb-6'>
            <div className='flex flex-col md:flex-row gap-8'>
              {/* Portrait */}
              <div className='shrink-0 mx-auto md:mx-0'>
                <Image
                  src={
                    doctor.portrait ||
                    doctor.avatarUrl ||
                    '/placeholder.svg?height=334&width=250'
                  }
                  alt={doctor.fullName}
                  height={334}
                  width={250}
                />
              </div>

              {/* Basic Info */}
              <div className='flex-1 space-y-6 pt-2 text-center md:text-left'>
                <div>
                  <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-2'>
                    {doctor.degree && (
                      <span className='text-blue-600 font-normal text-md md:text-lg block'>
                        {doctor.degree}
                      </span>
                    )}
                    {doctor.fullName}
                  </h1>
                  <div className='flex flex-wrap gap-2 justify-center md:justify-start mb-4'>
                    {doctor.position &&
                      doctor.position.map((pos, i) => (
                        <span
                          key={i}
                          className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100'
                        >
                          {pos}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Quick Stats/Info */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-left'>
                  {doctor.specialties && doctor.specialties.length > 0 && (
                    <div className='p-4 rounded-xl bg-gray-50 border border-gray-100'>
                      <div className='flex items-center gap-2 text-gray-900 font-medium mb-2'>
                        <Stethoscope className='w-4 h-4 text-blue-500' />
                        Specialties
                      </div>
                      <div className='flex flex-wrap gap-1'>
                        {doctor.specialties.map((s) => (
                          <span
                            key={s.id}
                            className='text-sm text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200'
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {doctor.workLocations && doctor.workLocations.length > 0 && (
                    <div className='p-4 rounded-xl bg-gray-50 border border-gray-100'>
                      <div className='flex items-center gap-2 text-gray-900 font-medium mb-2'>
                        <MapPin className='w-4 h-4 text-blue-500' />
                        Work Locations
                      </div>
                      <div className='space-y-1'>
                        {doctor.workLocations.slice(0, 2).map((loc) => (
                          <div
                            key={loc.id}
                            className='text-sm text-gray-600 flex items-center gap-1.5'
                          >
                            <div className='w-1 h-1 rounded-full bg-gray-400' />
                            {loc.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className='pt-2 flex justify-center md:justify-end'>
                  <Link href={`/appointments`}>
                    <Button
                      size='lg'
                      className='bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-lg shadow-blue-600/20'
                    >
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Content Tabs */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'>
            <Tabs defaultValue='about' className='space-y-8'>
              <TabsList className='w-full justify-start border-b border-gray-200 bg-transparent p-0 h-auto rounded-none gap-6 overflow-x-auto'>
                <TabsTrigger
                  value='about'
                  className='rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-0 py-3 text-gray-500 hover:text-gray-900 bg-transparent transition-none'
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value='experience'
                  className='rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-0 py-3 text-gray-500 hover:text-gray-900 bg-transparent transition-none'
                >
                  Experience & Training
                </TabsTrigger>
                <TabsTrigger
                  value='research'
                  className='rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-0 py-3 text-gray-500 hover:text-gray-900 bg-transparent transition-none'
                >
                  Research & Awards
                </TabsTrigger>
                <TabsTrigger
                  value='reviews'
                  className='rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 px-0 py-3 text-gray-500 hover:text-gray-900 bg-transparent transition-none'
                >
                  Patient Reviews
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent
                value='about'
                className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'
              >
                <section className='prose prose-gray max-w-none overflow-hidden'>
                  <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                    <BookOpen className='w-5 h-5 text-blue-500' />
                    Professional Biography
                  </h3>
                  <div className='text-sm *:mb-2 *:wrap-normal leading-6'>
                    {parser(replaceNbsps(doctor.introduction))}
                  </div>
                </section>

                {doctor.memberships && doctor.memberships.length > 0 && (
                  <section>
                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                      <Briefcase className='w-5 h-5 text-blue-500' />
                      Professional Memberships
                    </h3>
                    <ul className='space-y-2'>
                      {doctor.memberships.map((item, i) => (
                        <li
                          key={i}
                          className='text-sm flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg'
                        >
                          <div className='w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0' />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent
                value='experience'
                className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'
              >
                <div className='grid md:grid-cols-2 gap-12'>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center gap-2'>
                      <Briefcase className='w-5 h-5 text-blue-500' />
                      Work Experience
                    </h3>
                    {doctor.experience && doctor.experience.length > 0 ? (
                      <div className='relative border-l-2 border-blue-100 pl-6 space-y-8 ml-3'>
                        {doctor.experience.map((exp, i) => (
                          <div key={i} className='relative'>
                            <span className='absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm' />
                            <p className='text-gray-700 text-sm'>{exp}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-gray-500'>No information available.</p>
                    )}
                  </div>

                  <div>
                    <h3 className='text-lg font-bold text-gray-900 mb-6 flex items-center gap-2'>
                      <GraduationCap className='w-5 h-5 text-blue-500' />
                      Education & Training
                    </h3>
                    {doctor.trainingProcess &&
                    doctor.trainingProcess.length > 0 ? (
                      <div className='relative border-l-2 border-blue-100 pl-6 space-y-8 ml-3'>
                        {doctor.trainingProcess.map((train, i) => (
                          <div key={i} className='relative'>
                            <span className='absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-blue-500 shadow-sm' />
                            <p className='text-gray-700 text-sm'>{train}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-gray-500'>No information available.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Research Tab */}
              <TabsContent
                value='research'
                className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'
              >
                {doctor.awards && doctor.awards.length > 0 && (
                  <section>
                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                      <Award className='w-5 h-5 text-blue-500' />
                      Honors & Awards
                    </h3>
                    <div className='grid md:grid-cols-2 gap-4'>
                      {doctor.awards.map((award, i) => (
                        <div
                          key={i}
                          className='flex items-start gap-4 px-4 py-2 rounded-xl bg-yellow-50/50 border border-yellow-100'
                        >
                          <Award className='w-5 h-5 text-yellow-600 shrink-0 mt-0.5' />
                          <p className='text-gray-800 text-sm font-medium'>
                            {award}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {doctor.research && (
                  <section>
                    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
                      <BookOpen className='w-5 h-5 text-blue-500' />
                      Scientific Research
                    </h3>
                    <div className='bg-gray-50 p-6 rounded-2xl border border-gray-100 prose prose-gray max-w-none text-sm text-gray-700 overflow-hidden'>
                      <div className='text-sm *:mb-2 *:wrap-normal leading-5'>
                        {parser(replaceNbsps(doctor.research))}
                      </div>
                    </div>
                  </section>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent
                value='reviews'
                className='animate-in fade-in slide-in-from-bottom-4 duration-500'
              >
                <div className='max-w-4xl mx-auto'>
                  <h3 className='text-2xl font-semibold text-gray-900 mb-6 text-center'>
                    Write a review for doctor{' '}
                    <span className='text-sky-800'>{doctor.fullName}</span>
                  </h3>
                  <ReviewForm doctorId={doctor.id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('[Doctor Detail] Error:', error);
    return (
      <div className='min-h-screen bg-white flex items-center justify-center p-6 pt-[100px]'>
        <div className='text-center max-w-md'>
          <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
          <h2 className='text-lg font-bold text-gray-900 mb-2'>Unavailable</h2>
          <p className='text-gray-500 mb-6'>
            {error instanceof Error ? error.message : 'Doctor not found'}
          </p>
          <Link href='/doctors'>
            <Button>Return to Doctors</Button>
          </Link>
        </div>
      </div>
    );
  }
}
