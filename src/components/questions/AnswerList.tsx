'use client';

import { useEffect, useState } from 'react';

import { MessageCircle } from 'lucide-react';

import { questionApi } from '@/api/questions';
import { AnswerCard } from '@/components/questions/AnswerCard';
import { PaginatedNavigation } from '@/components/shared/paginated-navigation';
import type { Answer, PaginationMeta } from '@/types/question';

interface AnswerListProps {
  questionId: string;
  title?: string;
}

export function AnswerList({ questionId, title }: AnswerListProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 5,
    total: 0,
    hasNext: false,
    hasPrev: false,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await questionApi.getQuestionAnswers(questionId, {
          page: currentPage,
          limit: 5,
        });

        setAnswers(response.data);
        setMeta(response.meta);
      } catch (err: any) {
        console.error('Error fetching answers:', err);
        setError(err.message || 'Failed to load answers');
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [questionId, currentPage]);

  if (loading) {
    return (
      <div className='space-y-4'>
        {title && (
          <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
        )}
        <div className='flex items-center justify-center py-8'>
          <div className='w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4'>
        {title && (
          <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
        )}
        <div className='text-center py-8'>
          <p className='text-red-600'>{error}</p>
        </div>
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className='space-y-4'>
        {title && (
          <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
        )}
        <div className='text-center py-8 text-gray-500'>
          <MessageCircle className='w-12 h-12 mx-auto mb-2 text-gray-300' />
          <p>No answers yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {title && (
        <h2 className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
          {title}
          <span className='text-sm font-normal text-gray-500'>
            ({meta.total})
          </span>
        </h2>
      )}

      <div className='space-y-3'>
        {answers.map((answer) => (
          <AnswerCard key={answer.id} answer={answer} />
        ))}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className='mt-6'>
          <PaginatedNavigation
            currentPage={currentPage}
            totalPages={meta.totalPages}
            onPageChange={setCurrentPage}
            hasNext={meta.hasNext}
            hasPrev={meta.hasPrev}
          />
        </div>
      )}
    </div>
  );
}
