import Link from 'next/link';

import parse from 'html-react-parser';
import { Calendar, ChevronRight, Clock, Tag, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { replaceNbsps } from '@/lib/utils';
import type { Blog, BlogCategory } from '@/types/blog';

// Server-side data fetching functions
async function getBlogBySlug(slug: string): Promise<Blog> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/blogs/public/${slug}`, {
    cache: 'no-store', // Dynamic, no caching
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blog');
  }

  const data = await res.json();
  return data.data;
}

async function getCategories(): Promise<BlogCategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/blogs/categories`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const data = await res.json();
  return data.data;
}

async function getRecentBlogs(excludeId: string): Promise<Blog[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(
    `${baseUrl}/blogs/public?limit=4&sortBy=createdAt&sortOrder=DESC`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch recent blogs');
  }

  const data = await res.json();
  return data.data.filter((p: Blog) => p.id !== excludeId).slice(0, 3);
}

// Sidebar Components
const CategoriesWidget = ({ categories }: { categories: BlogCategory[] }) => (
  <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
      <Tag className='w-4 h-4 text-blue-500' />
      Categories
    </h3>
    <div className='flex flex-col space-y-2'>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/blogs?category=${cat.slug}`}
          className='flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group'
        >
          <span className='text-gray-600 group-hover:text-blue-600 transition-colors'>
            {cat.name}
          </span>
          <ChevronRight className='w-4 h-4 text-gray-300 group-hover:text-blue-500' />
        </Link>
      ))}
    </div>
  </div>
);

const RecentPostsWidget = ({ posts }: { posts: Blog[] }) => (
  <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-100'>
    <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-2'>
      <Clock className='w-4 h-4 text-blue-500' />
      Recent Posts
    </h3>
    <div className='space-y-4'>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blogs/${post.slug}`}
          className='flex gap-3 group'
        >
          <div className='w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden'>
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            />
          </div>
          <div>
            <h4 className='text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors'>
              {post.title}
            </h4>
            <p className='text-xs text-gray-500 mt-1'>
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const DoctorPromoWidget = () => (
  <div className='bg-linear-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white text-center'>
    <h3 className='text-xl font-bold mb-2'>Need Expert Advice?</h3>
    <p className='text-blue-100 mb-6 text-sm'>
      Book an appointment with our top specialists today.
    </p>
    <Button variant='secondary' className='w-full font-semibold' asChild>
      <Link href='/doctors'>Find a Doctor</Link>
    </Button>
  </div>
);

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    // Fetch all data in parallel
    const [blog, categories, recentPosts] = await Promise.all([
      getBlogBySlug(slug),
      getCategories(),
      getBlogBySlug(slug).then((blogData) => getRecentBlogs(blogData.id)),
    ]);

    return (
      <div className='min-h-screen pt-[80px] pb-20'>
        <div className='max-w-7xl mx-auto px-6 py-10'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
            {/* Main Content */}
            <article className='lg:col-span-2 bg-white rounded-2xl shadow-sm p-8 border border-gray-100'>
              {/* Meta */}
              <div className='flex items-center gap-4 text-sm text-blue-600 mb-4'>
                <span className='bg-blue-50 px-3 py-1 rounded-full font-medium'>
                  {blog.category.name}
                </span>
                <span className='flex items-center gap-1 text-gray-500'>
                  <Calendar className='w-4 h-4' />
                  {new Date(blog.createdAt).toLocaleDateString()}
                </span>
                <span className='flex items-center gap-1 text-gray-500'>
                  <User className='w-4 h-4' />
                  {blog.authorName}
                </span>
              </div>

              {/* Title */}
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight'>
                {blog.title}
              </h1>

              {/* Thumbnail */}
              <div className='rounded-sm overflow-hidden'>
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  className='w-full h-auto object-cover'
                />
              </div>

              <div className='h-px w-full bg-gray-200 my-6' />

              {/* Content HTML */}
              <div className='blog-content max-w-none prose-blue prose-headings:font-bold prose-img:rounded-xl [&_img]:max-w-[95%] [&_img]:mx-auto [&_img]:my-2'>
                {parse(replaceNbsps(blog?.content || 'No content available'))}
              </div>
            </article>

            {/* Sidebar */}
            <aside className='space-y-8'>
              <DoctorPromoWidget />
              <CategoriesWidget categories={categories} />
              <RecentPostsWidget posts={recentPosts} />
            </aside>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('[Blog Detail] Error:', error);
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 pt-[80px]'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Blog Not Found
          </h1>
          <p className='text-gray-600 mb-6'>
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href='/blogs'>Back to Blogs</Link>
          </Button>
        </div>
      </div>
    );
  }
}
