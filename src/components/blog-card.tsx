import Image from 'next/image';
import Link from 'next/link';

import { Calendar, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  thumbnailUrl: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  authorName: string;
  publishedAt: string | null;
  createdAt: string;
}

export function BlogCard({
  id,
  title,
  slug,
  thumbnailUrl,
  category,
  authorName,
  publishedAt,
  createdAt,
}: BlogCardProps) {
  const displayDate = publishedAt ? new Date(publishedAt) : new Date(createdAt);
  const formattedDate = displayDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col pt-0 gap-3'>
      {/* Blog Thumbnail */}
      <div className='relative h-48 bg-gradient-to-b from-blue-50 to-white overflow-hidden'>
        <Image
          src={
            thumbnailUrl ||
            '/placeholder.svg?height=192&width=400&query=medical blog'
          }
          alt={title}
          width={400}
          height={192}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* Blog Info */}
      <div className='px-4 py-0 space-y-2 flex-1 flex flex-col'>
        {/* Category Badge */}
        <div>
          <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-200'>
            {category.name}
          </Badge>
        </div>

        {/* Title */}
        <div className='flex-1'>
          <Link href={`/blogs/${slug}`}>
            <h3 className='font-semibold text-md text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors'>
              {title}
            </h3>
          </Link>
        </div>

        {/* Meta Information */}
        <div className='space-y-2 pt-4 border-t border-gray-200'>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <Calendar className='w-4 h-4 text-blue-500' />
            <span>{formattedDate}</span>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <User className='w-4 h-4 text-blue-500' />
            <span>{authorName}</span>
          </div>
        </div>

        {/* Read More Link */}
        <Link
          href={`/blogs/${slug}`}
          className='block w-full text-center py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors mt-4'
        >
          Read More
        </Link>
      </div>
    </Card>
  );
}
