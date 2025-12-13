import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { BlogCard } from '@/components/blog-card';
import { Button } from '@/components/ui/button';
import type { Blog } from '@/types/blog';

async function getLatestBlogs(): Promise<Blog[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(
      `${baseUrl}/blogs/public?limit=3&sortBy=createdAt&sortOrder=DESC`,
      {
        next: { revalidate: 0 }, // Revalidate every hour
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch blogs');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function BlogsSection() {
  const blogs = await getLatestBlogs();

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className='py-20'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex items-center justify-between mb-12'>
          <div>
            <h2 className='text-4xl font-bold mb-2'>READ OUR LATEST BLOG</h2>
            <p className='text-gray-600'>
              Stay updated with healthcare news and tips
            </p>
          </div>
          <Link href='/blogs'>
            <Button className='bg-blue-500 hover:bg-blue-600 text-white'>
              View All
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          </Link>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {blogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      </div>
    </section>
  );
}
