'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  CheckCircle2,
  ChevronRight,
  Home,
  MessageCircleQuestion,
} from 'lucide-react';

import { questionApi } from '@/api/questions';
import { AnswerList } from '@/components/questions/AnswerList';
import { CreateQuestionDialog } from '@/components/questions/CreateQuestionDialog';
import { QuestionDetail } from '@/components/questions/QuestionDetail';
import { RelatedQuestions } from '@/components/questions/RelatedQuestions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { QuestionDetail as QuestionDetailType } from '@/types/question';

export default function QuestionDetailPage() {
  const params = useParams();
  const questionId = params.id as string;

  const router = useRouter();

  const [question, setQuestion] = useState<QuestionDetailType | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await questionApi.getQuestionById(questionId, true);
        setQuestion(data);
      } catch (err: any) {
        console.error('Error fetching question:', err);
        setError(err.message || 'Failed to load question');
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId]);

  if (loading) {
    return (
      <div className='min-h-screen pt-[80px]'>
        <div className='max-w-7xl mx-auto px-6 py-10'>
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <div className='w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto' />
              <p className='text-gray-600'>Loading question...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className='min-h-screen pt-[80px]'>
        <div className='max-w-7xl mx-auto px-6 py-10'>
          <div className='flex items-center justify-center py-20'>
            <div className='text-center space-y-4'>
              <p className='text-red-600 font-semibold'>
                Error loading question
              </p>
              <p className='text-gray-600'>{error || 'Question not found'}</p>
              <div className='flex gap-3 justify-center'>
                <Button
                  onClick={() => window.location.reload()}
                  className='bg-blue-500 hover:bg-blue-600 text-white'
                >
                  Try Again
                </Button>
                <Button asChild variant='outline'>
                  <Link href='/questions'>Back to Questions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-[80px]'>
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Breadcrumb */}
        <nav className='flex items-center gap-2 text-sm text-gray-600 mb-6'>
          <Link
            href='/'
            className='hover:text-blue-600 transition-colors flex items-center gap-1'
          >
            <Home className='w-4 h-4' />
            Home
          </Link>
          <ChevronRight className='w-4 h-4' />
          <Link
            href='/questions'
            className='hover:text-blue-600 transition-colors'
          >
            Questions
          </Link>
          <ChevronRight className='w-4 h-4' />
          <span className='text-gray-900 font-medium truncate max-w-md'>
            {question.title}
          </span>
        </nav>

        {/* 2-Column Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main Content - Left Column */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Question Detail */}
            <QuestionDetail question={question} />

            <Separator />

            {/* Accepted Answers Section */}
            {question.acceptedAnswersCount > 0 ? (
              <>
                <div>
                  <AnswerList
                    questionId={questionId}
                    title='✓ Accepted Answers'
                  />
                </div>
              </>
            ) : (
              <Card className='p-8 text-center bg-linear-to-br from-gray-50 to-blue-50/30 border-dashed'>
                <div className='max-w-md mx-auto space-y-3'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto'>
                    <MessageCircleQuestion className='w-8 h-8 text-blue-500' />
                  </div>
                  <h3 className='font-semibold text-gray-900 text-lg'>
                    No Accepted Answers Yet
                  </h3>
                  <p className='text-sm text-gray-600'>
                    This question is waiting for expert answers from our
                    healthcare community. Please be patient!
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className='lg:col-span-1 space-y-4 md:space-y-6'>
            {/* Ask Question CTA */}
            <div className='p-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100'>
              <div className='flex flex-col sm:flex-row items-center justify-between gap-2'>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Have a question?
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Ask our community of healthcare professionals
                  </p>
                </div>
                <Button
                  className='bg-blue-500 hover:bg-blue-600 text-white'
                  onClick={() => setDialogOpen(true)}
                >
                  Ask a Question
                </Button>
              </div>
            </div>
            <RelatedQuestions
              currentQuestionId={questionId}
              specialtyId={question.specialtyId}
            />
          </div>
        </div>
      </div>

      {/* Create Question Dialog */}
      <CreateQuestionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          router.push('/questions');
        }}
      />
    </div>
  );
}
