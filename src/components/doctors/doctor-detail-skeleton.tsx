import { Skeleton } from '@/components/ui/skeleton';

export function DoctorDetailSkeleton() {
  return (
    <div className='min-h-screen pb-20'>
      {/* Header / Banner Skeleton */}
      <div className='relative bg-gray-100 pb-24 pt-[100px] overflow-hidden'>
        <div className='max-w-7xl mx-auto px-6 relative z-10'>
          <Skeleton className='h-6 w-32 mb-6 bg-gray-200' />
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
            <div className='flex-1 space-y-6 pt-2'>
              <div>
                <Skeleton className='h-8 w-1/4 mb-2' />
                <Skeleton className='h-10 w-3/4 mb-4' />
                <div className='flex flex-wrap gap-2'>
                  <Skeleton className='h-6 w-24 rounded-full' />
                  <Skeleton className='h-6 w-32 rounded-full' />
                </div>
              </div>

              {/* Quick Stats/Info Skeleton */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='p-4 rounded-xl bg-gray-50 border border-gray-100'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Skeleton className='w-4 h-4 rounded-full' />
                    <Skeleton className='h-5 w-24' />
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    <Skeleton className='h-6 w-20' />
                    <Skeleton className='h-6 w-24' />
                    <Skeleton className='h-6 w-16' />
                  </div>
                </div>

                <div className='p-4 rounded-xl bg-gray-50 border border-gray-100'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Skeleton className='w-4 h-4 rounded-full' />
                    <Skeleton className='h-5 w-32' />
                  </div>
                  <div className='space-y-2'>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='h-4 w-3/4' />
                  </div>
                </div>
              </div>

              <div className='pt-2'>
                <Skeleton className='h-12 w-48 rounded-full' />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Content Tabs Skeleton */}
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8'>
          <div className='space-y-8'>
            {/* Tabs List Skeleton */}
            <div className='flex gap-6 border-b border-gray-200 pb-px overflow-x-auto'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className='h-10 w-32' />
              ))}
            </div>

            {/* Content Skeleton */}
            <div className='space-y-4 max-w-3xl'>
              <div className='flex items-center gap-2 mb-4'>
                <Skeleton className='w-5 h-5 rounded-full' />
                <Skeleton className='h-7 w-48' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-5/6' />
                <Skeleton className='h-4 w-4/6' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
