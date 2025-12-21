'use client';

import type React from 'react';
import { useState } from 'react';

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Search,
  UserCheck,
  UserPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StepTwoProps {
  onComplete: (patientId: string) => void;
  bookingData: any;
  onBack?: () => void;
}

export default function StepTwo({
  onComplete,
  bookingData,
  onBack,
}: StepTwoProps) {
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundPatient, setFoundPatient] = useState(false);
  const [patientId, setPatientId] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    isMale: true,
    dateOfBirth: '',
    addressLine: '',
    district: '',
    province: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'phone' | 'email'>('phone');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === 'isMale' && type === 'radio') {
      setFormData((prev) => ({
        ...prev,
        isMale: value === 'true',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setError('Please enter a search value');
      return;
    }

    setSearchLoading(true);
    setError('');

    try {
      const queryParam = `${searchType}=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(
        `${baseUrl}/patients/public/search?${queryParam}`
      );
      const data = await res.json();

      if (data.success && data.data) {
        setFormData({
          fullName: data.data.fullName || '',
          email: data.data.email || '',
          phone: data.data.phone || '',
          isMale: data.data.isMale || false,
          dateOfBirth: data.data.dateOfBirth
            ? data.data.dateOfBirth.split('T')[0]
            : '',
          addressLine: data.data.addressLine || '',
          district: data.data.district || '',
          province: data.data.province || '',
        });
        setPatientId(data.data.id || '');
        setFoundPatient(true);
      } else {
        setError('Patient not found');
        setFoundPatient(false);
      }
    } catch (err) {
      setError('Failed to search patient');
      setFoundPatient(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${baseUrl}/patients/public`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setError(
            'This email is already registered. Please use "Returning Patient" to search your record or try a different email.'
          );
        } else {
          throw new Error(data.message || 'Failed to create patient');
        }
        return;
      }

      onComplete(data.data.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patient');
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
            <span className='text-sm text-red-900 font-medium'>{error}</span>
          </div>
        </Card>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as 'new' | 'existing');
          setFoundPatient(false);
        }}
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger
            value='new'
            className='flex items-center gap-1.5 text-sm'
          >
            <UserPlus className='w-4 h-4' />
            New Patient
          </TabsTrigger>
          <TabsTrigger
            value='existing'
            className='flex items-center gap-1.5 text-sm'
          >
            <UserCheck className='w-4 h-4' />
            Returning Patient
          </TabsTrigger>
        </TabsList>

        {/* New Patient Form */}
        <TabsContent value='new' className='mt-3'>
          <form onSubmit={handleSubmit} className='space-y-3'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label className='text-sm'>
                  Full Name <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm'>
                  Email <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='h-8 text-sm'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label className='text-sm'>
                  Phone Number <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm'>
                  Gender <span className='text-red-500'>*</span>
                </Label>
                <div className='flex gap-4 h-8 items-center'>
                  <label className='flex items-center gap-1.5 cursor-pointer'>
                    <input
                      type='radio'
                      name='isMale'
                      value='true'
                      checked={formData.isMale === true}
                      onChange={handleInputChange}
                      className='w-3.5 h-3.5'
                    />
                    <span className='text-sm'>Male</span>
                  </label>
                  <label className='flex items-center gap-1.5 cursor-pointer'>
                    <input
                      type='radio'
                      name='isMale'
                      value='false'
                      checked={formData.isMale === false}
                      onChange={handleInputChange}
                      className='w-3.5 h-3.5'
                    />
                    <span className='text-sm'>Female</span>
                  </label>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-sm'>
                Date of Birth <span className='text-red-500'>*</span>
              </Label>
              <Input
                type='date'
                name='dateOfBirth'
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className='h-8 text-sm'
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-sm'>
                Address <span className='text-red-500'>*</span>
              </Label>
              <Input
                type='text'
                name='addressLine'
                value={formData.addressLine}
                onChange={handleInputChange}
                placeholder='Street address or building name'
                required
                className='h-8 text-sm'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='space-y-2'>
                <Label className='text-sm'>
                  District <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  name='district'
                  value={formData.district}
                  onChange={handleInputChange}
                  required
                  className='h-8 text-sm'
                />
              </div>
              <div className='space-y-2'>
                <Label className='text-sm'>
                  Province <span className='text-red-500'>*</span>
                </Label>
                <Input
                  type='text'
                  name='province'
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  className='h-8 text-sm'
                />
              </div>
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
                  <ArrowLeft className='w-4 h-4 mr-1.5' />
                  Back
                </Button>
              )}
              <Button
                type='submit'
                disabled={loading}
                className='h-10 max-w-48'
                size='sm'
              >
                {loading ? 'Processing...' : 'Continue to Confirmation'}
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Returning Patient Tab */}
        <TabsContent value='existing' className='mt-3 space-y-3'>
          <Card className='p-4 bg-gray-50'>
            <p className='text-base text-gray-700 font-medium'>
              Search for your existing record:
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-2'>
              <div className='space-y-2'>
                <Label className='text-sm'>Search By</Label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value as any)}
                  className='w-full h-8 px-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
                >
                  <option value='phone'>Phone Number</option>
                  <option value='email'>Email Address</option>
                </select>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm'>Enter Value</Label>
                <Input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Your phone or email'
                  className='h-8 text-sm'
                />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              disabled={searchLoading}
              className='w-full h-10 max-w-48 ml-auto'
              size='sm'
              variant='secondary'
            >
              <Search className='w-4 h-4 mr-1.5' />
              {searchLoading ? 'Searching...' : 'Find My Record'}
            </Button>
          </Card>

          {foundPatient && (
            <>
              <Card className='p-4 bg-green-50 border-green-200 gap-4'>
                <div className='flex items-start gap-2 pb-2 border-b border-green-200'>
                  <CheckCircle2 className='w-4 h-4 text-green-600 shrink-0 mt-0.5' />
                  <span className='text-base font-medium text-green-900'>
                    Record found
                  </span>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div>
                    <Label className='text-xs font-medium text-gray-600 uppercase'>
                      Full Name
                    </Label>
                    <p className='text-base text-gray-900'>
                      {formData.fullName}
                    </p>
                  </div>
                  <div>
                    <Label className='text-xs font-medium text-gray-600 uppercase'>
                      Email
                    </Label>
                    <p className='text-base text-gray-900'>{formData.email}</p>
                  </div>
                  <div>
                    <Label className='text-xs font-medium text-gray-600 uppercase'>
                      Phone
                    </Label>
                    <p className='text-base text-gray-900'>{formData.phone}</p>
                  </div>
                  <div>
                    <Label className='text-xs font-medium text-gray-600 uppercase'>
                      Gender
                    </Label>
                    <p className='text-base text-gray-900'>
                      {formData.isMale ? 'Male' : 'Female'}
                    </p>
                  </div>
                  <div>
                    <Label className='text-xs font-medium text-gray-600 uppercase'>
                      Date of Birth
                    </Label>
                    <p className='text-base text-gray-900'>
                      {formData.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <Label className='text-xs font-medium text-gray-600 uppercase'>
                      Address
                    </Label>
                    <p className='text-base text-gray-900'>
                      {formData.addressLine}
                    </p>
                  </div>
                  <div>
                    <Label className='text-xs font-medium text-gray-600 uppercase'>
                      District
                    </Label>
                    <p className='text-base text-gray-900'>
                      {formData.district}
                    </p>
                  </div>
                  <div>
                    <Label className='text-xs font-medium text-gray-600 uppercase'>
                      Province
                    </Label>
                    <p className='text-base text-gray-900'>
                      {formData.province}
                    </p>
                  </div>
                </div>
              </Card>
              <div className='flex gap-2 justify-end'>
                {onBack && (
                  <Button
                    type='button'
                    onClick={onBack}
                    variant='outline'
                    size='sm'
                    className='min-w-24 h-10'
                  >
                    <ArrowLeft className='w-4 h-4 mr-1.5' />
                    Back
                  </Button>
                )}
                <Button
                  type='button'
                  onClick={() => onComplete(patientId)}
                  className='h-10 max-w-48 ml-auto'
                  size='sm'
                >
                  Continue to Confirmation
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
