import {
  Award,
  Baby,
  Brain,
  Clock,
  Heart,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react';

import SpecialtiesList from '@/components/specialties/specialties-list';
import { Badge } from '@/components/ui/badge';

async function getSpecialties() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/specialties/public`,
    {
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch specialties');
  return res.json();
}

export default async function SpecialtiesPage() {
  const data = await getSpecialties();
  const specialties = data.data || [];

  const stats = [
    { icon: Users, label: 'Expert Doctors', value: '50+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
    { icon: Shield, label: 'Patient Satisfaction', value: '99%' },
    { icon: Clock, label: 'Available 24/7', value: 'Always' },
  ];

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pt-[100px] pb-10 overflow-hidden'>
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
              <span className='text-sm font-medium'>Medical Specialties</span>
            </div>

            <h1 className='text-5xl md:text-6xl font-bold leading-tight'>
              OUR MEDICAL
              <span className='block text-blue-300'>SPECIALTIES</span>
            </h1>

            <p className='text-blue-100 text-lg max-w-2xl mx-auto'>
              Comprehensive healthcare services delivered by experienced
              specialists dedicated to your well-being
            </p>

            <div className='flex flex-wrap items-center justify-center gap-3 mt-8'>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
              >
                <Heart className='w-3 h-3 mr-1' />
                Cardiology
              </Badge>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
              >
                <Brain className='w-3 h-3 mr-1' />
                Neurology
              </Badge>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
              >
                <Baby className='w-3 h-3 mr-1' />
                Pediatrics
              </Badge>
              <Badge
                variant='secondary'
                className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
              >
                <Shield className='w-3 h-3 mr-1' />
                Emergency Care
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties List Section */}
      <section className='max-w-7xl mx-auto px-6 py-12'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold mb-4 text-gray-900 dark:text-white'>
            Explore Our Specialties
          </h2>
          <p className='text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
            Choose from our wide range of medical specialties, each staffed by
            board-certified physicians committed to providing exceptional care
          </p>
        </div>
        <SpecialtiesList specialties={specialties} />
      </section>
    </div>
  );
}
