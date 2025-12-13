'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { AlertCircle, Check, Loader2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { maskSensitiveInfo } from '@/lib/utils/privacy';

interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isMale: boolean;
  dateOfBirth: string;
  addressLine: string;
  district: string;
  province: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  locationId: string;
  eventId: string;
  specialtyId: string;
  status: string;
  reason: string;
  notes: string | null;
  priceAmount: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  completedAt: string | null;
  patient: {
    fullName: string;
    dateOfBirth: string;
  };
  event: {
    id: string;
    serviceDate: string;
    timeStart: string;
    timeEnd: string;
    nonBlocking: boolean;
    eventType: string;
  };
  doctor: {
    id: string;
    staffAccountId: string;
    fullName: string;
    isActive: boolean;
    avatarUrl: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
    address: string;
  };
  specialty: {
    id: string;
    name: string;
    slug: string;
  };
}

interface AppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment[];
  meta: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    totalPages: number;
  };
}

export default function PatientLookup() {
  const [searchParams, setSearchParams] = useState({
    email: '',
    phone: '',
  });

  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoSearching, setAutoSearching] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const urlSearchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const patientId = urlSearchParams.get('patientId');
    if (patientId) {
      setAutoSearching(true);
      handleSearch(undefined, patientId).finally(() => {
        setAutoSearching(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSearchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const formatPrice = (amount: string | null) => {
    if (!amount || amount === '0') return 'N/A';
    return Number(amount).toLocaleString();
  };

  const handleSearch = async (e?: React.FormEvent, searchById?: string) => {
    e?.preventDefault();

    if (!searchById && !searchParams.email && !searchParams.phone) {
      setError('Please enter email or phone');
      return;
    }

    setLoading(true);
    setError('');
    setPatient(null);
    setAppointments([]);

    try {
      const params = new URLSearchParams();
      if (searchById) {
        params.append('id', searchById);
      } else {
        if (searchParams.email) params.append('email', searchParams.email);
        if (searchParams.phone) params.append('phone', searchParams.phone);
      }

      const response = await fetch(
        `${apiUrl}/patients/public/search?${params}`
      );
      const data = await response.json();

      if (!data.success || !data.data) {
        setError(
          'Patient not found. Please check your information and try again.'
        );
        return;
      }

      setPatient(data.data);
      setCurrentPage(1);

      // Fetch appointments
      const appointmentsResponse = await fetch(
        `${apiUrl}/appointments/public/patient/${data.data.id}?page=1&limit=10`
      );
      const appointmentsData: AppointmentResponse =
        await appointmentsResponse.json();

      if (appointmentsData.success) {
        setAppointments(appointmentsData.data);
        setTotalPages(appointmentsData.meta.totalPages);
      }

      // Scroll to results after successful search
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } catch (err) {
      setError(
        'An error occurred while searching for the patient. Please try again.'
      );
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (!patient) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/appointments/public/patient/${patient.id}?page=${newPage}&limit=10`
      );
      const data: AppointmentResponse = await response.json();

      if (data.success) {
        setAppointments(data.data);
        setCurrentPage(newPage);
        setTotalPages(data.meta.totalPages);
      }
    } catch (err) {
      setError('Failed to load appointments. Please try again.');
      console.error('Page change error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'RESCHEDULED':
        return 'bg-amber-100 text-amber-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pt-[100px] pb-10 overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full' />
          <div className='absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full' />
          <div className='absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full' />
          <div className='absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full' />
        </div>

        <div className='max-w-7xl mx-auto px-6 relative'>
          <div className='text-center text-white space-y-6'>
            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4'>
              <Search className='w-4 h-4' />
              <span className='text-sm font-medium'>Patient Portal</span>
            </div>

            <h1 className='text-5xl md:text-6xl font-bold leading-tight'>
              FIND YOUR
              <span className='block text-blue-300'>APPOINTMENT RECORDS</span>
            </h1>

            <p className='text-blue-100 text-lg max-w-2xl mx-auto'>
              Search for your patient information and view your complete
              appointment history
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='max-w-5xl mx-auto px-6 py-12'>
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-8 relative'>
          {/* Auto-search Loading Overlay */}
          {autoSearching && (
            <div className='absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-50 flex items-center justify-center'>
              <div className='text-center space-y-4'>
                <div className='inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full'>
                  <Loader2 className='w-8 h-8 text-blue-600 animate-spin' />
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-1'>
                    Đang tìm kiếm bệnh nhân...
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Vui lòng đợi trong giây lát
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Search Form Section */}
          <div className='mb-12'>
            <h2 className='text-xl font-bold mb-2 text-gray-900'>
              Search Patient Records
            </h2>
            <p className='text-gray-600 mb-8'>
              Enter your information to find your patient records and
              appointment history
            </p>

            <form onSubmit={handleSearch} className='space-y-6'>
              <div className='bg-linear-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm text-sm font-semibold text-gray-900 mb-3'>
                      Email Address
                    </label>
                    <Input
                      type='email'
                      name='email'
                      placeholder='your.email@example.com'
                      value={searchParams.email}
                      onChange={handleInputChange}
                      className='w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>
                  <div>
                    <label className='block text-sm text-sm font-semibold text-gray-900 mb-3'>
                      Phone Number
                    </label>
                    <Input
                      type='tel'
                      name='phone'
                      placeholder='+1 (555) 000-0000'
                      value={searchParams.phone}
                      onChange={handleInputChange}
                      className='w-full bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500'
                    />
                  </div>
                </div>
                <p className='text-sm text-gray-600 mt-4'>
                  Please provide at least one of the above to search for your
                  records.
                </p>
              </div>

              {error && (
                <div className='p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3'>
                  <AlertCircle className='w-5 h-5 text-red-600 shrink-0 mt-0.5' />
                  <p className='text-red-700'>{error}</p>
                </div>
              )}

              <div className='flex justify-center pt-2'>
                <Button
                  type='submit'
                  disabled={loading}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all'
                >
                  {loading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Searching...
                    </>
                  ) : (
                    'Search Patient'
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Patient Information */}
          {patient && (
            <div ref={resultsRef} className='border-t pt-12'>
              <h2 className='text-xl font-bold mb-8 text-gray-900'>
                Patient Information
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 bg-linear-to-br from-blue-50 to-blue-100/50 p-8 rounded-2xl mb-12 border border-blue-100'>
                <div>
                  <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                    Full Name
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {patient.fullName}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                    Email
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {maskSensitiveInfo(patient.email)}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                    Phone
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {maskSensitiveInfo(patient.phone)}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                    Date of Birth
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {formatDate(patient.dateOfBirth)}
                  </p>
                </div>
              </div>

              {/* Appointments List */}
              <h2 className='text-xl font-bold mb-8 text-gray-900'>
                Appointment History
              </h2>

              {appointments.length > 0 ? (
                <>
                  <div className='space-y-4 mb-8'>
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className='border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white'
                      >
                        <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                          <div className='flex-1'>
                            <div className='flex items-center gap-4 mb-4'>
                              <img
                                src={
                                  appointment.doctor?.avatarUrl ||
                                  '/placeholder.svg'
                                }
                                alt={appointment.doctor?.fullName || 'Doctor'}
                                className='w-14 h-14 rounded-full object-cover border-2 border-blue-200'
                              />
                              <div>
                                <h4 className='font-bold text-gray-900'>
                                  {appointment.doctor?.fullName ||
                                    'To Be Determined'}
                                </h4>
                                <p className='text-sm text-gray-500'>Doctor</p>
                              </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                              <div>
                                <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                                  Date
                                </p>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {formatDate(appointment.event.serviceDate)}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                                  Time
                                </p>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {formatTime(appointment.event.timeStart)} -{' '}
                                  {formatTime(appointment.event.timeEnd)}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                                  Status
                                </p>
                                <span
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}
                                >
                                  {appointment.status}
                                </span>
                              </div>
                              <div>
                                <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                                  Price
                                </p>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {formatPrice(appointment.priceAmount)}{' '}
                                  {appointment.currency}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                                  Location
                                </p>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {appointment.location?.name || '-'}
                                </p>
                                <p className='text-sm text-gray-600'>
                                  {appointment.location?.address || '-'}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                                  Specialty
                                </p>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {appointment.specialty?.name || '-'}
                                </p>
                              </div>
                              <div>
                                <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                                  Created / Updated
                                </p>
                                <p className='text-sm font-semibold text-gray-900'>
                                  {formatDate(appointment.createdAt)}
                                  {' - '}
                                  {formatDate(appointment.updatedAt)}
                                </p>
                              </div>
                            </div>

                            {appointment.cancelledAt && (
                              <div className='mt-3'>
                                <p className='text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1'>
                                  Cancelled At
                                </p>
                                <p className='font-semibold text-red-600'>
                                  {formatDate(appointment.cancelledAt)}
                                </p>
                              </div>
                            )}

                            <div className='mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200'>
                              <p className='text-xs text-blue-700 font-bold uppercase tracking-wider mb-2'>
                                Reason for Visit
                              </p>
                              <p className='text-blue-900 font-semibold'>
                                {appointment.reason}
                              </p>
                            </div>

                            {appointment.notes && (
                              <div className='mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200'>
                                <p className='text-xs text-amber-700 font-bold uppercase tracking-wider mb-2'>
                                  Notes
                                </p>
                                <p className='text-amber-900 font-semibold'>
                                  {appointment.notes}
                                </p>
                              </div>
                            )}

                            {appointment.completedAt && (
                              <div className='mt-3 flex items-center gap-2 text-green-700'>
                                <Check className='w-4 h-4' />
                                <p className='text-sm font-semibold'>
                                  Completed on{' '}
                                  {formatDate(appointment.completedAt)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className='flex justify-center items-center gap-2 pt-8'>
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        variant='outline'
                      >
                        Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            disabled={loading}
                            variant={
                              page === currentPage ? 'default' : 'outline'
                            }
                            className={
                              page === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700'
                            }
                          >
                            {page}
                          </Button>
                        )
                      )}

                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        variant='outline'
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className='text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200'>
                  <p className='text-gray-600 text-lg'>
                    No appointments found for this patient.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
