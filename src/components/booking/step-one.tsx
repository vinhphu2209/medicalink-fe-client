import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

import { format } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Clock,
  Info,
  Loader2,
  MapPin,
  RotateCcw,
  Stethoscope,
  Sunrise,
  Sunset,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Location {
  id: string;
  name: string;
  address?: string;
}

interface Specialty {
  id: string;
  name: string;
}

interface Doctor {
  id: string;
  fullName: string;
  isMale: boolean;
  degree: string;
  avatarUrl: string;
  appointmentDuration: number;
  specialties: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  workLocations: Array<{
    id: string;
    name: string;
    address: string;
  }>;
}

interface TimeSlot {
  timeStart: string;
  timeEnd: string;
}

export default function StepOne({ onComplete, onBack, initialDoctorId }: any) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectionMode, setSelectionMode] = useState<
    'filter-first' | 'doctor-first' | null
  >(null);

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDatesInMonth, setAvailableDatesInMonth] = useState<string[]>(
    []
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingInitialDoctors, setLoadingInitialDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingMonthlySlots, setLoadingMonthlySlots] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [error, setError] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const doctorAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchLocations();
    fetchSpecialties();
    fetchAllDoctors();
  }, []);

  // Auto-select doctor when initialDoctorId is provided and doctors list is loaded
  useEffect(() => {
    if (initialDoctorId && allDoctors.length > 0 && !selectedDoctor) {
      const doctorExists = allDoctors.find((d) => d.id === initialDoctorId);
      if (doctorExists) {
        handleDoctorChange(initialDoctorId);
      }
    }
  }, [allDoctors, initialDoctorId, selectedDoctor]);

  // Auto-fetch monthly slots when both doctor and location are selected
  useEffect(() => {
    if (selectedDoctor && selectedLocation) {
      const now = new Date();
      fetchMonthlySlots(
        selectedDoctor,
        selectedLocation,
        now.getMonth() + 1,
        now.getFullYear()
      );
    }
  }, [selectedDoctor, selectedLocation]);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${baseUrl}/work-locations/public?sortOrder=ASC`);
      const data = await res.json();
      setLocations(data.data || []);
    } catch {
      setError('Failed to load locations');
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await fetch(`${baseUrl}/specialties/public`);
      const data = await res.json();
      setSpecialties(data.data || []);
    } catch {
      setError('Failed to load specialties');
    }
  };

  const fetchAllDoctors = async () => {
    setLoadingInitialDoctors(true);
    try {
      const params = new URLSearchParams();
      params.append('limit', '50');
      params.append('sortOrder', 'asc');

      const res = await fetch(
        `${baseUrl}/doctors/profile/public?${params.toString()}`
      );
      const data = await res.json();
      const doctorsList = data.data || [];
      setAllDoctors(doctorsList);
      setDoctors(doctorsList);
    } catch {
      setError('Failed to load doctors');
    } finally {
      setLoadingInitialDoctors(false);
    }
  };

  const fetchMonthlySlots = async (
    doctorId: string,
    locationId: string,
    month: number,
    year: number
  ) => {
    if (!doctorId) return;

    setLoadingMonthlySlots(true);

    try {
      const res = await fetch(
        `${baseUrl}/doctors/profile/${doctorId}/month-slots?month=${month}&year=${year}&locationId=${locationId}`
      );
      const data = await res.json();
      setAvailableDatesInMonth(data.data?.availableDates || []);
    } catch {
      setError('Failed to load available dates');
      setAvailableDatesInMonth([]);
    } finally {
      setLoadingMonthlySlots(false);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      if (selectionMode !== 'filter-first') {
        return;
      }

      if (!selectedLocation || !selectedSpecialty) {
        setDoctors(allDoctors);
        return;
      }

      setLoadingDoctors(true);

      if (doctorAbortRef.current) {
        doctorAbortRef.current.abort();
      }
      const controller = new AbortController();
      doctorAbortRef.current = controller;

      try {
        const params = new URLSearchParams();
        params.append('sortOrder', 'asc');

        if (selectedSpecialty) params.append('specialtyIds', selectedSpecialty);
        if (selectedLocation)
          params.append('workLocationIds', selectedLocation);

        const res = await fetch(
          `${baseUrl}/doctors/profile/public?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setDoctors(data.data || []);
      } catch {
        if (!controller.signal.aborted) {
          setError('Failed to load doctors');
        }
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, [selectedLocation, selectedSpecialty, selectionMode]);

  const resetDoctorData = () => {
    setSelectedDoctor('');
    setSelectedDoctorName('');
    setSelectedDate('');
    setSelectedTime('');
    setTimeSlots([]);
  };

  const handleLocationChange = (locId: string) => {
    setSelectedLocation(locId);

    if (!selectedDoctor) {
      setSelectionMode('filter-first');
    } else {
      // Reset date and time since availability will be refetched by useEffect
      setSelectedDate('');
      setSelectedTime('');
      setTimeSlots([]);
      setSelectionMode('filter-first');
    }
  };

  const handleSpecialtyChange = (specId: string) => {
    setSelectedSpecialty(specId);

    if (!selectedDoctor) {
      setSelectionMode('filter-first');
    } else {
      resetDoctorData();
      setSelectionMode('filter-first');
    }
  };

  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return;

    setSelectedDoctor(doctorId);
    setSelectedDoctorName(doctor.fullName || '');
    setSelectedDate('');
    setSelectedTime('');
    setTimeSlots([]);

    // Monthly slots will be fetched by useEffect when both doctor and location are set

    if (!selectedLocation && !selectedSpecialty) {
      setSelectionMode('doctor-first');

      if (doctor.workLocations && doctor.workLocations.length > 0) {
        const doctorLocations = doctor.workLocations.map((wl) => ({
          id: wl.id,
          name: wl.name,
        }));
        setLocations(doctorLocations);
        setTimeout(() => {
          setSelectedLocation(doctorLocations[0].id);
        }, 0);
      }

      if (doctor.specialties && doctor.specialties.length > 0) {
        const doctorSpecialties = doctor.specialties.map((sp) => ({
          id: sp.id,
          name: sp.name,
        }));
        setSpecialties(doctorSpecialties);
        setTimeout(() => {
          setSelectedSpecialty(doctorSpecialties[0].id);
        }, 0);
      }
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setTimeSlots([]);

    if (!selectedDoctor || !selectedLocation) return;

    setLoadingSlots(true);

    try {
      const params = new URLSearchParams({
        locationId: selectedLocation,
        serviceDate: date,
        allowPast: 'true',
      });

      const res = await fetch(
        `${baseUrl}/doctors/profile/${selectedDoctor}/slots?${params.toString()}`
      );
      const data = await res.json();
      setTimeSlots(data.data || []);
    } catch {
      setError('Failed to load time slots');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !selectedLocation ||
      !selectedSpecialty ||
      !selectedDoctor ||
      !selectedDate ||
      !selectedTime
    ) {
      setError('Please fill all fields');
      return;
    }

    const slot = timeSlots.find((s) => s.timeStart === selectedTime);
    if (!slot) {
      setError('Invalid time slot');
      return;
    }

    setLoadingSubmit(true);

    try {
      const res = await fetch(`${baseUrl}/appointments/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          locationId: selectedLocation,
          serviceDate: selectedDate,
          timeStart: slot.timeStart,
          timeEnd: slot.timeEnd,
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      // Find selected location details
      const selectedLocationData = locations.find(
        (loc) => loc.id === selectedLocation
      );

      onComplete({
        locationId: selectedLocation,
        locationName: selectedLocationData?.name || '',
        locationAddress: selectedLocationData?.address || '',
        specialtyId: selectedSpecialty,
        doctorId: selectedDoctor,
        doctorName: selectedDoctorName,
        serviceDate: selectedDate,
        timeStart: slot.timeStart,
        timeEnd: slot.timeEnd,
        eventId: data.data.id,
      });
    } catch {
      setError('Failed to book slot');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className='space-y-4'>
      {/* Info Banner */}
      <Card className='p-3 bg-blue-50 border-blue-200'>
        <div className='flex gap-2 items-start'>
          <Info className='w-4 h-4 text-blue-600 shrink-0 mt-0.5' />
          <div className='text-xs text-blue-900'>
            <p className='font-medium'>Choose your booking method:</p>
            <p className='text-blue-700 mt-0.5'>
              Select a <strong>doctor first</strong> to auto-fill location &
              specialty, or choose <strong>location & specialty first</strong>{' '}
              to filter doctors.
            </p>
          </div>
        </div>
      </Card>

      {error && (
        <Card className='p-2 bg-red-50 border-red-200'>
          <div className='flex items-start gap-2'>
            <AlertCircle className='w-4 h-4 text-red-600 shrink-0 mt-0.5' />
            <span className='text-xs text-red-900 font-medium'>{error}</span>
          </div>
        </Card>
      )}

      {/* Selection Form */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        {/* Location */}
        <div className='space-y-2'>
          <Label className='flex items-center gap-1.5 text-sm font-medium'>
            <MapPin className='w-3.5 h-3.5 text-gray-500' />
            Location
            <span className='text-red-500'>*</span>
          </Label>
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationChange(e.target.value)}
            className='w-full px-2.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
          >
            <option value=''>Select location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Specialty */}
        <div className='space-y-2'>
          <Label className='flex items-center gap-1.5 text-sm font-medium'>
            <Stethoscope className='w-3.5 h-3.5 text-gray-500' />
            Specialty
            <span className='text-red-500'>*</span>
          </Label>
          <select
            value={selectedSpecialty}
            onChange={(e) => handleSpecialtyChange(e.target.value)}
            className='w-full px-2.5 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500'
          >
            <option value=''>Select specialty</option>
            {specialties.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {spec.name}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div className='space-y-2 md:col-span-2'>
          <Label className='flex items-center gap-1.5 text-sm font-medium'>
            <User className='w-3.5 h-3.5 text-gray-500' />
            Doctor
            <span className='text-red-500'>*</span>
          </Label>
          <Select
            value={selectedDoctor}
            onValueChange={(value) => handleDoctorChange(value)}
            disabled={loadingDoctors || loadingInitialDoctors}
          >
            <SelectTrigger
              className={`w-full h-auto py-2.5 ${selectedDoctor ? 'min-h-[64px]' : ''}`}
            >
              <SelectValue placeholder='Select doctor' />
            </SelectTrigger>
            <SelectContent className='max-h-[400px]'>
              {loadingDoctors || loadingInitialDoctors ? (
                <div className='p-4 text-sm text-gray-600 text-center'>
                  Loading doctors...
                </div>
              ) : doctors.length === 0 ? (
                <div className='p-4 text-sm text-gray-500 text-center'>
                  No doctors available
                </div>
              ) : (
                doctors.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id} className='py-3'>
                    <div className='flex items-center gap-2 w-full'>
                      {/* Avatar */}
                      <div className='shrink-0'>
                        <Image
                          src={
                            doc.avatarUrl ||
                            '/placeholder.svg?height=36&width=36'
                          }
                          alt={doc.fullName}
                          width={36}
                          height={36}
                          className='rounded-full object-cover border border-gray-500/10 p-0.5'
                        />
                      </div>

                      {/* Doctor Info */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-0.5'>
                          <p className='font-semibold text-sm text-gray-900 truncate'>
                            {doc.fullName}
                          </p>
                          <span
                            className={cn(
                              'px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0',
                              doc.isMale
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-pink-100 text-pink-700'
                            )}
                          >
                            {doc.isMale ? 'Male' : 'Female'}
                          </span>
                          <span className='px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0 bg-gray-100 text-gray-700'>
                            {doc.appointmentDuration} mins
                          </span>
                        </div>
                        {doc.degree && (
                          <p className='text-xs text-gray-600 truncate text-left'>
                            {doc.degree}
                          </p>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Selection - Inline Calendar */}
      {selectedDoctor && (
        <div className='space-y-2'>
          <Label className='flex items-center gap-1.5 text-sm font-medium'>
            <Calendar className='w-3.5 h-3.5 text-gray-500' />
            Appointment Date
            <span className='text-red-500'>*</span>
          </Label>
          <div className='p-3 pt-0'>
            {
              <div className='flex flex-col items-center'>
                <div className='relative'>
                  {loadingMonthlySlots && (
                    <div className='absolute top-0 rounded-sm left-0 w-full h-full bg-black/10 z-10 flex items-center justify-center backdrop-blur-xs'>
                      <Loader2 className='size-10 animate-spin text-white' />
                    </div>
                  )}
                  <CalendarComponent
                    mode='single'
                    selected={selectedDate ? new Date(selectedDate) : undefined}
                    month={currentMonth}
                    onMonthChange={(month) => {
                      setCurrentMonth(month);
                      if (selectedDoctor) {
                        fetchMonthlySlots(
                          selectedDoctor,
                          selectedLocation,
                          month.getMonth() + 1,
                          month.getFullYear()
                        );
                      }
                    }}
                    onSelect={(date) => {
                      if (date) {
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        handleDateChange(formattedDate);
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) return true;

                      const dateStr = format(date, 'yyyy-MM-dd');
                      return !availableDatesInMonth.includes(dateStr);
                    }}
                    modifiers={{
                      available: (date) => {
                        const dateStr = format(date, 'yyyy-MM-dd');
                        return availableDatesInMonth.includes(dateStr);
                      },
                    }}
                    modifiersClassNames={{
                      available:
                        "relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-600 after:rounded-full",
                    }}
                    classNames={{
                      day_button: cn(
                        'w-10 h-10 text-sm font-medium rounded-lg',
                        'hover:bg-blue-50 hover:text-blue-700',
                        'disabled:opacity-30 disabled:hover:bg-transparent',
                        'data-[selected]:bg-blue-600 data-[selected]:text-white data-[selected]:font-bold'
                      ),
                      chevron: 'w-5 h-5',
                    }}
                    autoFocus
                  />
                </div>
                <div className='mt-3 pt-3 border-t w-full flex items-center justify-center gap-2 text-xs text-gray-600'>
                  <div className='w-1.5 h-1.5 bg-blue-600 rounded-full'></div>
                  <span>Available dates</span>
                </div>
              </div>
            }
          </div>
        </div>
      )}

      {/* Time Slots */}
      {selectedDate && (
        <div className='space-y-3'>
          <Label className='flex items-center gap-1.5 text-sm font-medium'>
            <Clock className='w-3.5 h-3.5 text-gray-500' />
            Time Slot
            <span className='text-red-500'>*</span>
          </Label>

          {loadingSlots && (
            <Card className='p-2 bg-blue-50 border-blue-200'>
              <p className='text-xs text-blue-900'>Loading time slots...</p>
            </Card>
          )}

          {!loadingSlots && timeSlots.length === 0 && (
            <Card className='p-2 bg-amber-50 border-amber-200'>
              <div className='flex gap-2 items-start'>
                <AlertCircle className='w-4 h-4 text-amber-600 shrink-0 mt-0.5' />
                <p className='text-xs text-amber-900'>
                  No available slots for this date. Please choose another date.
                </p>
              </div>
            </Card>
          )}

          {!loadingSlots &&
            timeSlots.length > 0 &&
            (() => {
              const formatTime = (time24: string) => {
                const [hours, minutes] = time24.split(':').map(Number);
                const period = hours >= 12 ? 'PM' : 'AM';
                const hours12 = hours % 12 || 12;
                return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
              };

              const amSlots = timeSlots.filter((slot) => {
                const hours = parseInt(slot.timeStart.split(':')[0]);
                return hours < 12;
              });

              const pmSlots = timeSlots.filter((slot) => {
                const hours = parseInt(slot.timeStart.split(':')[0]);
                return hours >= 12;
              });

              return (
                <div className='space-y-2'>
                  {/* AM Slots */}
                  {amSlots.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-1.5 text-xs text-gray-600 mb-2'>
                        <Sunrise className='w-3.5 h-3.5' />
                        <span className='font-medium'>Morning</span>
                      </div>
                      <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2'>
                        {amSlots.map((slot) => (
                          <button
                            key={slot.timeStart}
                            onClick={() => setSelectedTime(slot.timeStart)}
                            className={cn(
                              'px-2 py-2 rounded border transition-colors flex flex-col items-center',
                              selectedTime === slot.timeStart
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            )}
                          >
                            <span className='text-sm font-semibold'>
                              {formatTime(slot.timeStart)}
                            </span>
                            <span
                              className={cn(
                                'text-[10px] mt-0.5',
                                selectedTime === slot.timeStart
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              )}
                            >
                              to {formatTime(slot.timeEnd)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PM Slots */}
                  {pmSlots.length > 0 && (
                    <div className='space-y-2'>
                      <div className='flex items-center gap-1.5 text-xs text-gray-600 mb-2'>
                        <Sunset className='w-3.5 h-3.5' />
                        <span className='font-medium'>Afternoon</span>
                      </div>
                      <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2'>
                        {pmSlots.map((slot) => (
                          <button
                            key={slot.timeStart}
                            onClick={() => setSelectedTime(slot.timeStart)}
                            className={cn(
                              'px-2 py-2 rounded border transition-colors flex flex-col items-center',
                              selectedTime === slot.timeStart
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            )}
                          >
                            <span className='text-sm font-semibold'>
                              {formatTime(slot.timeStart)}
                            </span>
                            <span
                              className={cn(
                                'text-[10px] mt-0.5',
                                selectedTime === slot.timeStart
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              )}
                            >
                              to {formatTime(slot.timeEnd)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
        </div>
      )}

      {/* Action Buttons */}
      <div className='flex gap-2'>
        <Button
          onClick={() => {
            // Reset all form state
            setSelectedLocation('');
            setSelectedSpecialty('');
            setSelectedDoctor('');
            setSelectedDoctorName('');
            setSelectedDate('');
            setSelectedTime('');
            setTimeSlots([]);
            setAvailableDatesInMonth([]);
            setSelectionMode(null);
            setError('');
          }}
          variant='outline'
          size='sm'
          className='min-w-24'
        >
          <RotateCcw className='w-3.5 h-3.5 mr-1.5' />
          Clear
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loadingSubmit || !selectedTime}
          className='flex-1'
          size='sm'
        >
          {loadingSubmit ? (
            'Processing...'
          ) : (
            <>
              Continue to Patient Information
              <ChevronRight className='w-4 h-4 ml-1' />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
