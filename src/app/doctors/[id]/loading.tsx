import Link from 'next/link';

import { ArrowLeft } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DoctorDetailLoading() {
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
        {/* Profile Card Skeleton */}
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 mb-6'>
          <div className='flex flex-col md:flex-row gap-8'>
            {/* Portrait Skeleton */}
            <div className='shrink-0 mx-auto md:mx-0'>
              <Skeleton className='h-[334px] w-[250px] rounded-lg' />
            </div>

            {/* Basic Info Skeleton */}
            <div className='flex-1 space-y-6 pt-2 text-center md:text-left'>
              <div>
                {/* Degree */}
                <Skeleton className='h-5 w-32 mb-2 mx-auto md:mx-0' />
                {/* Name */}
                <Skeleton className='h-10 w-64 mb-4 mx-auto md:mx-0' />
                {/* Position badges */}
                <div className='flex flex-wrap gap-2 justify-center md:justify-start mb-4'>
                  <Skeleton className='h-7 w-24 rounded-full' />
                  <Skeleton className='h-7 w-32 rounded-full' />
                </div>
              </div>

              {/* Quick Stats/Info Skeleton */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-left'>
                {/* Specialties */}
                <div className='p-4 rounded-xl bg-gray-50 border border-gray-100'>
                  <Skeleton className='h-5 w-24 mb-2' />
                  <div className='flex flex-wrap gap-1'>
                    <Skeleton className='h-6 w-20 rounded' />
                    <Skeleton className='h-6 w-24 rounded' />
                  </div>
                </div>

                {/* Work Locations */}
                <div className='p-4 rounded-xl bg-gray-50 border border-gray-100'>
                  <Skeleton className='h-5 w-28 mb-2' />
                  <div className='space-y-1'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                  </div>
                </div>
              </div>

              {/* Button Skeleton */}
              <div className='pt-2 flex justify-center md:justify-end'>
                <Skeleton className='h-11 w-48 rounded-full' />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Content Tabs Skeleton */}
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

            {/* About Tab Skeleton */}
            <TabsContent
              value='about'
              className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'
            >
              <section className='space-y-4'>
                <Skeleton className='h-6 w-48 mb-4' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-4/5' />
              </section>

              <section className='space-y-4'>
                <Skeleton className='h-6 w-56 mb-4' />
                <div className='space-y-2'>
                  <Skeleton className='h-12 w-full rounded-lg' />
                  <Skeleton className='h-12 w-full rounded-lg' />
                  <Skeleton className='h-12 w-full rounded-lg' />
                </div>
              </section>
            </TabsContent>

            {/* Experience Tab Skeleton */}
            <TabsContent
              value='experience'
              className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'
            >
              <div className='grid md:grid-cols-2 gap-12'>
                <div>
                  <Skeleton className='h-6 w-40 mb-6' />
                  <div className='space-y-8'>
                    <Skeleton className='h-16 w-full' />
                    <Skeleton className='h-16 w-full' />
                    <Skeleton className='h-16 w-full' />
                  </div>
                </div>

                <div>
                  <Skeleton className='h-6 w-48 mb-6' />
                  <div className='space-y-8'>
                    <Skeleton className='h-16 w-full' />
                    <Skeleton className='h-16 w-full' />
                    <Skeleton className='h-16 w-full' />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Research Tab Skeleton */}
            <TabsContent
              value='research'
              className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'
            >
              <section className='space-y-4'>
                <Skeleton className='h-6 w-44 mb-4' />
                <div className='grid md:grid-cols-2 gap-4'>
                  <Skeleton className='h-16 w-full rounded-xl' />
                  <Skeleton className='h-16 w-full rounded-xl' />
                  <Skeleton className='h-16 w-full rounded-xl' />
                  <Skeleton className='h-16 w-full rounded-xl' />
                </div>
              </section>

              <section className='space-y-4'>
                <Skeleton className='h-6 w-48 mb-4' />
                <div className='bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-4/5' />
                </div>
              </section>
            </TabsContent>

            {/* Reviews Tab Skeleton */}
            <TabsContent
              value='reviews'
              className='animate-in fade-in slide-in-from-bottom-4 duration-500'
            >
              <div className='max-w-4xl mx-auto'>
                <Skeleton className='h-8 w-96 mb-6 mx-auto' />
                <div className='space-y-4'>
                  <Skeleton className='h-32 w-full rounded-lg' />
                  <Skeleton className='h-12 w-full rounded-lg' />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
