import { Skeleton } from '@/components/ui/skeleton';

export function DoctorCardSkeleton() {
  return (
    <div className='flex flex-col px-4 md:x-6 py-3 md:py-4 bg-white rounded-xl border border-gray-100 overflow-hidden'>
      <div className='w-full'>
        <div className='flex items-start justify-between gap-4'>
          {/* Image Skeleton */}
          <Skeleton className='size-24 rounded-sm shrink-0' />

          {/* Content Skeleton */}
          <div className='flex-1'>
            <div className='flex flex-wrap gap-2 mb-1'>
              <Skeleton className='h-5 w-40 rounded-md' />
            </div>
            <Skeleton className='h-3 w-32 mb-1 mt-1' />
            <Skeleton className='h-6 w-48 mb-2' />

            <div className='flex flex-col gap-1 mt-1 mb-2'>
              <div className='flex items-center gap-2'>
                <Skeleton className='w-3 h-3 rounded-full' />
                <Skeleton className='h-3 w-32' />
              </div>
            </div>
          </div>
        </div>

        {/* Specialties Skeleton */}
        <div className='flex flex-wrap gap-2 mt-2'>
          <Skeleton className='h-5 w-32 rounded' />
          <Skeleton className='h-5 w-40 rounded' />
        </div>
      </div>

      {/* Footer Link Skeleton */}
      <div className='flex items-center justify-end mt-2'>
        <Skeleton className='h-6 w-24 rounded-full' />
      </div>
    </div>
  );
}
