'use client';

import type React from 'react';
import { useState } from 'react';

import { AlertCircle, Calendar, Clock, MapPin, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface StepThreeProps {
  onComplete: () => void;
  bookingData: any;
  onBack?: () => void;
}

function formatToAmPm(time: string) {
  const [hour, minute] = time.split(':');
  let h = parseInt(hour, 10);
  const suffix = h >= 12 ? 'PM' : 'AM';

  if (h === 0) h = 12;
  else if (h > 12) h -= 12;

  return `${h}:${minute} ${suffix}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function StepThree({
  onComplete,
  bookingData,
  onBack,
}: StepThreeProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${baseUrl}/appointments/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: bookingData.eventId,
          patientId: bookingData.patientId,
          specialtyId: bookingData.specialtyId,
          reason: reason || 'Regular checkup',
        }),
      });

      if (!res.ok) throw new Error('Failed to book appointment');

      onComplete();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to book appointment'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-3'>
      {error && (
        <Card className='p-2 bg-red-50 border-red-200'>
          <div className='flex items-start gap-2'>
            <AlertCircle className='w-4 h-4 text-red-600 shrink-0 mt-0.5' />
            <span className='text-xs text-red-900 font-medium'>{error}</span>
          </div>
        </Card>
      )}

      <Card className='p-3'>
        <h2 className='text-base font-semibold text-gray-900 mb-2'>
          Appointment Summary
        </h2>
        <div className='space-y-3'>
          {bookingData.locationName && (
            <div className='flex items-start justify-between pb-2 border-b'>
              <div className='flex items-center gap-1.5 text-sm text-gray-600'>
                <MapPin className='w-3.5 h-3.5' />
                <span className='font-medium'>Location</span>
              </div>
              <div className='text-right'>
                <p className='text-sm font-medium text-gray-900'>
                  {bookingData.locationName}
                </p>
                {bookingData.locationAddress && (
                  <p className='text-xs text-gray-600 mt-0.5'>
                    {bookingData.locationAddress}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className='flex items-center justify-between pb-2 border-b'>
            <div className='flex items-center gap-1.5 text-sm text-gray-600'>
              <User className='w-3.5 h-3.5' />
              <span className='font-medium'>Doctor</span>
            </div>
            <p className='text-sm font-medium text-gray-900'>
              {bookingData.doctorName}
            </p>
          </div>
          <div className='flex items-center justify-between pb-2 border-b'>
            <div className='flex items-center gap-1.5 text-sm text-gray-600'>
              <Calendar className='w-3.5 h-3.5' />
              <span className='font-medium'>Date</span>
            </div>
            <p className='text-sm font-medium text-gray-900'>
              {formatDate(bookingData.serviceDate)}
            </p>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1.5 text-sm text-gray-600'>
              <Clock className='w-3.5 h-3.5' />
              <span className='font-medium'>Time</span>
            </div>
            <p className='text-sm font-medium text-gray-900'>
              {formatToAmPm(bookingData.timeStart)} -{' '}
              {formatToAmPm(bookingData.timeEnd)}
            </p>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className='space-y-3'>
        <div className='space-y-2'>
          <Label className='text-sm'>Reason for Visit</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='Describe the reason for your visit or any concerns...'
            rows={6}
            className='text-sm resize-none h-40'
          />
        </div>

        <div className='flex gap-2 justify-between'>
          {onBack && (
            <Button
              type='button'
              onClick={onBack}
              variant='outline'
              size='sm'
              className='min-w-24 h-10'
            >
              Back
            </Button>
          )}
          <Button
            type='submit'
            disabled={loading}
            className='flex-1 h-10 max-w-48'
            size='sm'
          >
            {loading ? 'Processing...' : 'Complete Booking'}
          </Button>
        </div>
      </form>
    </div>
  );
}
