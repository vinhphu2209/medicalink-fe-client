'use client';

import { useEffect, useState } from 'react';

import { Search } from 'lucide-react';

import { specialtyApi } from '@/api/specialties';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { QuestionStatus, Specialty } from '@/types/question';

interface QuestionFiltersProps {
  search: string;
  status: QuestionStatus | 'ALL';
  specialtyId: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: QuestionStatus | 'ALL') => void;
  onSpecialtyChange: (value: string) => void;
}

export function QuestionFilters({
  search,
  status,
  specialtyId,
  onSearchChange,
  onStatusChange,
  onSpecialtyChange,
}: QuestionFiltersProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await specialtyApi.getSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error('Failed to fetch specialties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  return (
    <div className='space-y-4  **:text-white'>
      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
        <Input
          type='text'
          placeholder='Search questions...'
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-10 placeholder:text-gray-300'
        />
      </div>

      {/* Filters Row */}
      <div className='flex flex-col sm:flex-row gap-3'>
        {/* Status Filter */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>All Status</SelectItem>
            <SelectItem value='PENDING'>Pending</SelectItem>
            <SelectItem value='ANSWERED'>Answered</SelectItem>
            <SelectItem value='CLOSED'>Closed</SelectItem>
          </SelectContent>
        </Select>

        {/* Specialty Filter */}
        <Select
          value={specialtyId}
          onValueChange={onSpecialtyChange}
          disabled={loading}
        >
          <SelectTrigger className='w-full sm:w-[250px]'>
            <SelectValue placeholder='Filter by specialty' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='ALL'>All Specialties</SelectItem>
            {specialties.map((specialty) => (
              <SelectItem key={specialty.id} value={specialty.id}>
                {specialty.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
