'use client';

import { Suspense, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { ChevronRight, Search, Sparkles, X } from 'lucide-react';

import { blogApi } from '@/api/blogs';
import { BlogCard } from '@/components/blog-card';
import { PaginatedNavigation } from '@/components/shared/paginated-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import type { Blog, BlogCategory, PaginationMeta } from '@/types/blog';

function BlogsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  // Data State
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & Sort State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Meta
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 6,
    total: 0,
    hasNext: false,
    hasPrev: false,
    totalPages: 1,
  });

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await blogApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Initialize category filter from URL
  useEffect(() => {
    if (categoryFromUrl && categories.length > 0) {
      // Check if the category from URL exists
      const categoryExists = categories.some(
        (cat) => cat.slug === categoryFromUrl
      );
      if (categoryExists) {
        setSelectedCategory(categoryFromUrl);
      }
    }
  }, [categoryFromUrl, categories]);

  // Fetch Blogs when params change
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          limit: 6, // Fixed limit or make it dynamic if needed
          sortBy,
          sortOrder,
          categorySlug:
            selectedCategory === 'all' ? undefined : selectedCategory,
          search: debouncedSearch || undefined,
        };

        const response = await blogApi.getPublicBlogs(params);

        setBlogs(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        // eslint-disable-next-line no-console
        console.error('Error fetching blogs:', err);
        setError(err.message || 'Failed to load blogs');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, debouncedSearch, selectedCategory, sortBy, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, sortBy, sortOrder]);

  // Handlers
  const handleClearSearch = () => setSearch('');

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative pt-[80px] bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pt-[120px] pb-6'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='text-center text-white space-y-4'>
            <h1 className='text-4xl md:text-5xl font-bold'>
              LATEST MEDICAL
              <span className='flex items-center justify-center gap-2 mt-2'>
                NEWS & BLOGS
                <span className='text-red-500 text-4xl'>+</span>
              </span>
            </h1>
            <p className='text-blue-100 text-lg max-w-2xl mx-auto'>
              Stay informed with the latest medical news, health tips, and
              expert insights from our healthcare professionals
            </p>
          </div>
          {/* Filters */}
          <div className='flex flex-col md:flex-row gap-4 mt-6 items-center justify-between **:text-white bg-white/10 p-4 rounded-xl shadow-sm'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
              <Input
                placeholder='Search articles...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9 pr-8 placeholder:text-gray-50 focus-visible:border-sky-500 focus-visible:ring-sky-500/20 '
              />
              {search && (
                <button
                  onClick={handleClearSearch}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>

            <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='All Categories' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(val) => {
                  const [field, order] = val.split('-');
                  setSortBy(field);
                  setSortOrder(order as 'ASC' | 'DESC');
                }}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Sort By' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='createdAt-DESC'>Newest First</SelectItem>
                  <SelectItem value='createdAt-ASC'>Oldest First</SelectItem>
                  <SelectItem value='title-ASC'>A-Z</SelectItem>
                  <SelectItem value='title-DESC'>Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className='max-w-7xl mx-auto px-6 py-10'>
        {/* Blogs Grid or Status */}
        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto' />
              <p className='text-gray-600'>Loading blogs...</p>
            </div>
          </div>
        ) : error ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <p className='text-red-600 font-semibold'>Error loading blogs</p>
              <p className='text-gray-600'>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className='bg-blue-500 hover:bg-blue-600 text-white'
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <p className='text-gray-600 text-lg'>
                No blogs found matching your criteria
              </p>
              <Button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className='bg-blue-500 hover:bg-blue-600 text-white'
              >
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {blogs.map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className='mt-12'>
                <PaginatedNavigation
                  currentPage={currentPage}
                  totalPages={meta.totalPages}
                  onPageChange={setCurrentPage}
                  hasNext={meta.hasNext}
                  hasPrev={meta.hasPrev}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen pt-[80px]'>
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto' />
              <p className='text-gray-600'>Loading blogs...</p>
            </div>
          </div>
        </div>
      }
    >
      <BlogsContent />
    </Suspense>
  );
}
