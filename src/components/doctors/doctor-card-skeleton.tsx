import { Skeleton } from '@/components/ui/skeleton';

export function DoctorCardSkeleton() {
  return (
    <div className='flex flex-col md:flex-row bg-white rounded-xl border border-gray-100 overflow-hidden'>
      {/* Doctor Image - Left Side */}
      <div className='w-48 md:w-52 h-52 md:h-64 relative shrink-0 bg-gray-50'>
        <Skeleton className='w-full h-full' />
      </div>

      {/* Content - Right Side */}
      <div className='flex-1 p-4 md:p-6 flex flex-col justify-between'>
        <div>
          <div className='flex flex-wrap gap-2 mb-2'>
            <Skeleton className='h-6 w-32 rounded-md' />
          </div>

          <Skeleton className='h-4 w-40 mb-2' />
          <Skeleton className='h-8 w-64 mb-3' />

          <div className='flex flex-col gap-2 mt-2 mb-3'>
            <div className='flex items-center gap-2'>
              <Skeleton className='w-4 h-4 rounded-full shrink-0' />
              <Skeleton className='h-4 w-48' />
            </div>
          </div>

          <div className='mt-2 space-y-1.5'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </div>

          <div className='flex flex-wrap gap-2 mt-4'>
            <Skeleton className='h-6 w-24 rounded' />
            <Skeleton className='h-6 w-28 rounded' />
            <Skeleton className='h-6 w-20 rounded' />
          </div>
        </div>

        <div className='flex items-center justify-end mt-4'>
          <Skeleton className='h-5 w-24' />
        </div>
      </div>
    </div>
  );
}
