import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='min-h-screen pt-[68px]'>
      {/* Hero Section Skeleton */}
      <section className='relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] py-10 overflow-hidden'>
        <div className='max-w-7xl mx-auto px-6 relative'>
          <Skeleton className='h-10 w-32 mb-6 bg-white/20' />
          <div className='space-y-4'>
            <Skeleton className='h-8 w-48 bg-white/20' />
            <Skeleton className='h-12 w-3/4 bg-white/20' />
            <Skeleton className='h-6 w-full max-w-2xl bg-white/20' />
            <Skeleton className='h-6 w-5/6 max-w-2xl bg-white/20' />
            <div className='flex flex-wrap gap-3 pt-4'>
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className='h-8 w-32 bg-white/20 rounded-full'
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className='max-w-7xl mx-auto px-6 py-12'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Left Column */}
          <div className='lg:col-span-2 space-y-6'>
            {[1, 2].map((i) => (
              <Card
                key={i}
                className='bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800'
              >
                <CardHeader className='pb-4'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-9 w-9 rounded-lg' />
                    <Skeleton className='h-7 w-48' />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-5/6' />
                    <Skeleton className='h-4 w-4/5' />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Column */}
          <div className='space-y-6'>
            <Card className='bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 sticky top-24'>
              <CardHeader>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-9 w-9 rounded-lg' />
                  <Skeleton className='h-6 w-32' />
                </div>
                <Skeleton className='h-4 w-40 mt-2' />
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {[1, 2, 3].map((i) => (
                    <Card
                      key={i}
                      className='bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700'
                    >
                      <Skeleton className='h-48 w-full' />
                      <div className='p-4 space-y-3'>
                        <Skeleton className='h-5 w-3/4' />
                        <Skeleton className='h-4 w-1/2' />
                        <Skeleton className='h-4 w-full' />
                      </div>
                    </Card>
                  ))}
                  <Skeleton className='h-10 w-full rounded-md' />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
