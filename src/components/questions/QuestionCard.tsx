import Link from 'next/link';

import { Calendar, CheckCircle2, Eye, MessageCircle, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Question } from '@/types/question';

interface QuestionCardProps {
  question: Question;
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

export function QuestionCard({ question }: QuestionCardProps) {
  const formattedDate = new Date(question.createdAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  );

  const statusInfo = statusConfig[question.status];

  return (
    <Card className='p-4 hover:shadow-lg transition-all duration-300 group cursor-pointer h-full'>
      <Link href={`/questions/${question.id}`} className='h-full'>
        <div className='flex flex-col align-center justify-between h-full gap-4 '>
          <div className='space-y-3'>
            {/* Header: Status and Specialty */}
            <div className='flex items-center justify-between gap-2'>
              <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
              {question.specialty && (
                <Badge variant='outline' className='text-xs'>
                  {question.specialty.name}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className='font-semibold text-lg text-gray-900 leading-6 line-clamp-2 group-hover:text-blue-600 transition-colors'>
              {question.title}
            </h3>

            {/* Body Preview */}
            <p className='text-sm text-gray-600 line-clamp-2'>
              {question.body}
            </p>

            {/* Stats Row */}
            <div className='flex items-center gap-4 text-xs text-gray-500'>
              <div className='flex items-center gap-1'>
                <Eye className='w-3.5 h-3.5' />
                <span>{question.viewCount}</span>
              </div>
              <div className='flex items-center gap-1'>
                <MessageCircle className='w-3.5 h-3.5' />
                <span>{question.answersCount}</span>
              </div>
              <div className='flex items-center gap-1'>
                <CheckCircle2 className='w-3.5 h-3.5 text-green-600' />
                <span>{question.acceptedAnswersCount}</span>
              </div>
            </div>
          </div>
          {/* Footer: Author and Date */}
          <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <User className='w-3.5 h-3.5 text-blue-500' />
              <span>{question.authorName}</span>
            </div>
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <Calendar className='w-3.5 h-3.5 text-blue-500' />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}
