'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { MessageCircleQuestion } from 'lucide-react';

import { questionApi } from '@/api/questions';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Question } from '@/types/question';

interface RelatedQuestionsProps {
  currentQuestionId: string;
  specialtyId?: string;
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  },
  ANSWERED: {
    label: 'Answered',
    className: 'bg-green-100 text-green-700 hover:bg-green-200',
  },
  CLOSED: {
    label: 'Closed',
    className: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
};

export function RelatedQuestions({
  currentQuestionId,
  specialtyId,
}: RelatedQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedQuestions = async () => {
      try {
        setLoading(true);

        let response = await questionApi.getQuestions({
          page: 1,
          limit: 6,
          specialtyId: specialtyId || undefined,
        });

        let filteredQuestions = response.data.filter(
          (q) => q.id !== currentQuestionId
        );

        setQuestions(filteredQuestions.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch related questions:', error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedQuestions();
  }, [currentQuestionId, specialtyId]);

  if (loading) {
    return (
      <Card className='p-4 gap-4'>
        <h3 className='font-semibold text-gray-900 mb-1 flex items-center gap-2'>
          <MessageCircleQuestion className='w-5 h-5 text-blue-500' />
          Related Questions
        </h3>
        <div className='space-y-3'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-3 w-20' />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  return (
    <Card className='p-4 sticky top-24 gap-4'>
      <h3 className='font-semibold text-gray-900 flex items-center gap-2'>
        <MessageCircleQuestion className='w-5 h-5 text-blue-500' />
        Related Questions
      </h3>
      <div className='space-y-4'>
        {questions.map((question) => {
          const statusInfo = statusConfig[question.status];
          return (
            <Link
              key={question.id}
              href={`/questions/${question.id}`}
              className='block group'
            >
              <div className='space-y-2'>
                <h4 className='text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug'>
                  {question.title}
                </h4>
                <div className='flex items-center gap-2'>
                  <Badge className={`${statusInfo.className} text-xs py-0`}>
                    {statusInfo.label}
                  </Badge>
                  {question.specialty && (
                    <Badge className='text-xs bg-gray-100 text-gray-700 hover:bg-gray-200'>
                      {question.specialty.name}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
