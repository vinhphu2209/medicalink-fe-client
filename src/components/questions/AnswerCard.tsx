import { Calendar, CheckCircle2, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import type { Answer } from '@/types/question';

interface AnswerCardProps {
  answer: Answer;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  const formattedDate = new Date(answer.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className='p-4 gap-4'>
      {/* Header */}
      <div className='flex items-start justify-between gap-2'>
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <User className='w-4 h-4 text-blue-500' />
          <span className='font-medium'>{answer.authorFullName}</span>
        </div>
        {answer.isAccepted && (
          <Badge className='bg-green-100 text-green-700 hover:bg-green-200 gap-1'>
            <CheckCircle2 className='w-3 h-3' />
            Accepted
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className='text-gray-700 leading-relaxed'>{answer.body}</div>

      {/* Footer */}
      <div className='flex items-center gap-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100'>
        <Calendar className='w-3.5 h-3.5' />
        <span>{formattedDate}</span>
      </div>
    </Card>
  );
}
