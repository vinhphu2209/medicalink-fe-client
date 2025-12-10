'use client';

import { useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';

import { questionApi } from '@/api/questions';
import { specialtyApi } from '@/api/specialties';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { CreateQuestionData, Specialty } from '@/types/question';

interface CreateQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateQuestionDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateQuestionDialogProps) {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CreateQuestionData>({
    title: '',
    body: '',
    authorName: '',
    authorEmail: '',
    specialtyId: '',
  });

  const [errors, setErrors] = useState<Partial<CreateQuestionData>>({});

  // Fetch specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(true);
        const data = await specialtyApi.getSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error('Failed to fetch specialties:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchSpecialties();
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateQuestionData> = {};

    if (!formData.title || formData.title.length < 10) {
      newErrors.title = 'Title must be at least 10 characters';
    }

    if (!formData.body || formData.body.length < 50) {
      newErrors.body = 'Question body must be at least 50 characters';
    }

    if (!formData.authorName) {
      newErrors.authorName = 'Name is required';
    }

    if (!formData.authorEmail) {
      newErrors.authorEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.authorEmail)) {
      newErrors.authorEmail = 'Invalid email format';
    }

    if (!formData.specialtyId) {
      newErrors.specialtyId = 'Please select a specialty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await questionApi.createQuestion(formData);

      // Reset form
      setFormData({
        title: '',
        body: '',
        authorName: '',
        authorEmail: '',
        specialtyId: '',
      });
      setErrors({});

      // Close dialog and trigger success callback
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Failed to create question:', error);
      alert(error.message || 'Failed to create question. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
          <DialogDescription>
            Get answers from healthcare professionals and the community
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Title */}
          <div className='space-y-2'>
            <Label htmlFor='title'>
              Question Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='title'
              placeholder='What is your question?'
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className='text-xs text-red-500'>{errors.title}</p>
            )}
          </div>

          {/* Body */}
          <div className='space-y-2'>
            <Label htmlFor='body'>
              Question Details <span className='text-red-500'>*</span>
            </Label>
            <Textarea
              id='body'
              placeholder='Provide more details about your question...'
              rows={6}
              value={formData.body}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
              className={errors.body ? 'border-red-500' : ''}
            />
            <p className='text-xs text-gray-500'>
              {formData.body.length} / 50 characters minimum
            </p>
            {errors.body && (
              <p className='text-xs text-red-500'>{errors.body}</p>
            )}
          </div>

          {/* Specialty */}
          <div className='space-y-2'>
            <Label htmlFor='specialty'>
              Specialty <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={formData.specialtyId}
              onValueChange={(value) =>
                setFormData({ ...formData, specialtyId: value })
              }
              disabled={loading}
            >
              <SelectTrigger
                className={errors.specialtyId ? 'border-red-500' : ''}
              >
                <SelectValue placeholder='Select a specialty' />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.specialtyId && (
              <p className='text-xs text-red-500'>{errors.specialtyId}</p>
            )}
          </div>

          {/* Author Name */}
          <div className='space-y-2'>
            <Label htmlFor='authorName'>
              Your Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='authorName'
              placeholder='Enter your name'
              value={formData.authorName}
              onChange={(e) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
              className={errors.authorName ? 'border-red-500' : ''}
            />
            {errors.authorName && (
              <p className='text-xs text-red-500'>{errors.authorName}</p>
            )}
          </div>

          {/* Author Email */}
          <div className='space-y-2'>
            <Label htmlFor='authorEmail'>
              Your Email <span className='text-red-500'>*</span>
            </Label>
            <Input
              id='authorEmail'
              type='email'
              placeholder='your.email@example.com'
              value={formData.authorEmail}
              onChange={(e) =>
                setFormData({ ...formData, authorEmail: e.target.value })
              }
              className={errors.authorEmail ? 'border-red-500' : ''}
            />
            {errors.authorEmail && (
              <p className='text-xs text-red-500'>{errors.authorEmail}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='bg-blue-500 hover:bg-blue-600'
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Submitting...
                </>
              ) : (
                'Submit Question'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
