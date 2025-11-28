import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='min-h-screen pt-[68px]'>
      {/* Hero Section Skeleton */}
      <section className='relative bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] py-20 overflow-hidden'>
        <div className='max-w-7xl mx-auto px-6 relative'>
          <div className='text-center space-y-6'>
            <Skeleton className='h-8 w-48 mx-auto bg-white/20' />
            <Skeleton className='h-16 w-96 mx-auto bg-white/20' />
            <Skeleton className='h-6 w-2/3 mx-auto bg-white/20' />
            <div className='flex flex-wrap items-center justify-center gap-3 mt-8'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className='h-8 w-32 bg-white/20 rounded-full'
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section Skeleton */}
      <section className='bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800'>
        <div className='max-w-7xl mx-auto px-6 py-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-neutral-800 dark:to-neutral-700'
              >
                <Skeleton className='h-8 w-8 mx-auto mb-3 bg-blue-200 dark:bg-neutral-600' />
                <Skeleton className='h-8 w-16 mx-auto mb-2 bg-blue-200 dark:bg-neutral-600' />
                <Skeleton className='h-4 w-24 mx-auto bg-blue-200 dark:bg-neutral-600' />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties List Skeleton */}
      <section className='max-w-7xl mx-auto px-6 py-20'>
        <div className='text-center mb-12'>
          <Skeleton className='h-10 w-80 mx-auto mb-4' />
          <Skeleton className='h-6 w-96 mx-auto' />
        </div>
        <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Card
              key={i}
              className='h-full flex flex-col bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden'
            >
              <CardHeader className='relative p-0'>
                <Skeleton className='h-48 w-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-neutral-800 dark:to-neutral-700' />
                <div className='absolute top-4 right-4'>
                  <Skeleton className='h-6 w-24 rounded-full bg-white/90' />
                </div>
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Skeleton className='h-24 w-24 rounded-2xl bg-white dark:bg-neutral-800' />
                </div>
              </CardHeader>
              <CardContent className='flex-1 p-6 space-y-4'>
                <div>
                  <Skeleton className='h-6 w-3/4 mb-2' />
                  <Skeleton className='h-4 w-full mb-1' />
                  <Skeleton className='h-4 w-5/6' />
                </div>
                <div className='space-y-2 pt-2 border-t border-gray-200 dark:border-neutral-700'>
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className='h-4 w-32' />
                  ))}
                </div>
              </CardContent>
              <CardFooter className='p-6 pt-0'>
                <Skeleton className='h-10 w-full rounded-md' />
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
