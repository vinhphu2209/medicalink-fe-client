import {
  Calendar,
  CheckCircle2,
  Eye,
  Mail,
  MessageCircle,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { maskEmail, maskSensitiveInfo } from '@/lib/utils/privacy';
import type { QuestionDetail as QuestionDetailType } from '@/types/question';

interface QuestionDetailProps {
  question: QuestionDetailType;
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

export function QuestionDetail({ question }: QuestionDetailProps) {
  const formattedDate = new Date(question.createdAt).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  const statusInfo = statusConfig[question.status];
  const maskedEmail = maskEmail(question.authorEmail);
  const maskedBody = maskSensitiveInfo(question.body);

  return (
    <Card className='p-6 gap-4'>
      {/* Header: Status */}
      <div className='flex items-center gap-2'>
        <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
        {question.specialty && (
          <Badge className='bg-gray-100 text-gray-700 hover:bg-gray-200 gap-1'>
            {question.specialty?.name}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className='text-3xl font-bold text-gray-900'>{question.title}</h1>

      {/* Stats Row */}
      <div className='flex items-center gap-6 text-sm text-gray-600 pb-4 border-b border-gray-200'>
        <div className='flex items-center gap-1.5'>
          <Eye className='w-4 h-4 text-blue-500' />
          <span>{question.viewCount} views</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <MessageCircle className='w-4 h-4 text-blue-500' />
          <span>{question.answersCount} answers</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <CheckCircle2 className='w-4 h-4 text-green-600' />
          <span>{question.acceptedAnswersCount} accepted</span>
        </div>
      </div>

      {/* Body */}
      <div className='prose prose-gray max-w-none'>
        <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>
          {maskedBody}
        </p>
      </div>

      {/* Footer: Author Info */}
      <div className='pt-4 border-t border-gray-200'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <User className='w-4 h-4 text-blue-500' />
              <span className='font-medium'>{question.authorName}</span>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Mail className='w-4 h-4 text-blue-500' />
              <span className='font-mono text-xs'>{maskedEmail}</span>
            </div>
          </div>
          <div className='flex items-center gap-2 text-sm text-gray-500'>
            <Calendar className='w-4 h-4' />
            <span>Asked on {formattedDate}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
