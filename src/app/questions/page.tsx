'use client';

import { useEffect, useState } from 'react';

import { MessageCircleQuestion, Plus } from 'lucide-react';

import { questionApi } from '@/api/questions';
import { CreateQuestionDialog } from '@/components/questions/CreateQuestionDialog';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { QuestionCardSkeleton } from '@/components/questions/QuestionCardSkeleton';
import { QuestionFilters } from '@/components/questions/QuestionFilters';
import { PaginatedNavigation } from '@/components/shared/paginated-navigation';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import type {
  PaginationMeta,
  Question,
  QuestionStatus,
} from '@/types/question';

export default function QuestionsPage() {
  // Data State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<QuestionStatus | 'ALL'>('ALL');
  const [specialtyId, setSpecialtyId] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Meta
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 9,
    total: 0,
    hasNext: false,
    hasPrev: false,
    totalPages: 1,
  });

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {
          page: currentPage,
          limit: 9,
          search: debouncedSearch || undefined,
          status: status === 'ALL' ? undefined : status,
          specialtyId: specialtyId === 'ALL' ? undefined : specialtyId,
        };

        const response = await questionApi.getQuestions(params);

        setQuestions(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Failed to load questions');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage, debouncedSearch, status, specialtyId]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, specialtyId]);

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative pt-[120px] bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pb-8'>
        {/* Background Decorations */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-20 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl' />
          <div className='absolute bottom-10 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl' />
        </div>

        <div className='max-w-7xl mx-auto px-6 relative z-10'>
          <div className='text-center text-white space-y-4'>
            <div className='flex items-center justify-center gap-3 mb-4'>
              <MessageCircleQuestion className='w-12 h-12 text-blue-300' />
            </div>
            <h1 className='text-4xl md:text-5xl font-bold'>
              MEDICAL Q&A
              <span className='flex items-center justify-center gap-2 mt-2'>
                COMMUNITY
                <span className='text-red-500 text-4xl'>+</span>
              </span>
            </h1>
            <p className='text-blue-100 text-lg max-w-2xl mx-auto'>
              Ask questions, get expert answers from healthcare professionals
              and the community
            </p>
          </div>

          {/* Filters */}
          <div className='mt-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl'>
            <QuestionFilters
              search={search}
              status={status}
              specialtyId={specialtyId}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onSpecialtyChange={setSpecialtyId}
            />
          </div>

          {/* Ask Question Button */}
          <div className='mt-6 text-center'>
            <Button
              size='lg'
              className='bg-blue-500 hover:bg-blue-600 text-white gap-2'
              onClick={() => setDialogOpen(true)}
            >
              <Plus className='w-5 h-5' />
              Ask a Question
            </Button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className='max-w-7xl mx-auto px-6 py-10'>
        {/* Questions Grid or Status */}
        {loading ? (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(9)].map((_, i) => (
              <QuestionCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <p className='text-red-600 font-semibold'>
                Error loading questions
              </p>
              <p className='text-gray-600'>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className='bg-blue-500 hover:bg-blue-600 text-white'
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : questions.length === 0 ? (
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <p className='text-gray-600 text-lg'>
                No questions found matching your criteria
              </p>
              <Button
                onClick={() => {
                  setSearch('');
                  setStatus('ALL');
                  setSpecialtyId('ALL');
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
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
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

      {/* Create Question Dialog */}
      <CreateQuestionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          // Refresh questions list
          window.location.reload();
        }}
      />
    </div>
  );
}
