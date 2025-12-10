import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function QuestionCardSkeleton() {
  return (
    <Card className='p-4'>
      <div className='space-y-3'>
        {/* Header: Status and Specialty */}
        <div className='flex items-center justify-between gap-2'>
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-5 w-32' />
        </div>

        {/* Title */}
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-3/4' />

        {/* Body Preview */}
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-5/6' />

        {/* Stats Row */}
        <div className='flex items-center gap-4'>
          <Skeleton className='h-4 w-12' />
          <Skeleton className='h-4 w-12' />
          <Skeleton className='h-4 w-12' />
        </div>

        {/* Footer: Author and Date */}
        <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
      </div>
    </Card>
  );
}
