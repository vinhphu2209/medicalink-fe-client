import Image from 'next/image';
import Link from 'next/link';

import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LocationsSection } from '@/components/work-locations/locations-section';

export default function Home() {
  return (
    <div className='min-h-screen pt-[68px]'>
      {/* Hero Section */}
      <section className='relative bg-linear-to-br from-[#0A2463] to-[#1e3a8a] pt-24 pb-16 overflow-hidden h-[calc(100dvh-68px)] '>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full' />
          <div className='absolute bottom-20 right-20 w-24 h-24 border-2 border-white rounded-full' />
          <div className='absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full' />
          <div className='absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full' />
        </div>

        <div className='max-w-7xl mx-auto px-6 relative'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='text-white space-y-6'>
              <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full'>
                <div className='flex -space-x-2'>
                  <div className='w-6 h-6 rounded-full bg-blue-400 border-2 border-white' />
                  <div className='w-6 h-6 rounded-full bg-blue-500 border-2 border-white' />
                  <div className='w-6 h-6 rounded-full bg-blue-600 border-2 border-white' />
                </div>
                <span className='text-sm'>Verified Doctors</span>
              </div>

              <h1 className='text-5xl md:text-6xl font-bold leading-tight'>
                MEDICALINK
                <span className='flex items-center gap-2'>
                  HOSPITAL
                  <span className='text-red-500 text-4xl'>+</span>
                </span>
              </h1>

              <p className='text-blue-100 text-lg'>
                Providing quality healthcare services with experienced doctors
                and modern facilities.
              </p>

              <div className='flex flex-wrap gap-4'>
                <Link href='/book-appointment'>
                  <Button
                    size='lg'
                    className='bg-blue-500 hover:bg-blue-600 text-white'
                  >
                    Book Appointment Now
                  </Button>
                </Link>
                <Link href='#about'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='border-white text-white hover:bg-white/10 hover:text-white bg-transparent'
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className='flex gap-8 pt-4'>
                <div>
                  <div className='text-3xl font-bold'>12K+</div>
                  <div className='text-blue-200 text-sm'>Happy Patients</div>
                </div>
                <div>
                  <div className='text-3xl font-bold'>99%</div>
                  <div className='text-blue-200 text-sm'>Satisfaction</div>
                </div>
              </div>
            </div>

            <div className='relative'>
              <div className='relative rounded-3xl overflow-hidden'>
                <Image
                  src='/female-doctor-in-blue-scrubs-with-stethoscope-smil.jpg'
                  alt='Healthcare Doctor'
                  width={500}
                  height={600}
                  className='w-full h-auto'
                />
              </div>

              {/* Floating Card */}
              <Card className='absolute bottom-8 left-8 p-4 bg-white shadow-xl'>
                <div className='flex items-center gap-3'>
                  <Image
                    src='/group-of-diverse-doctors.jpg'
                    alt='Doctors'
                    width={60}
                    height={60}
                    className='rounded-lg'
                  />
                  <div>
                    <div className='font-semibold text-sm'>
                      Medical Achievement
                    </div>
                    <div className='text-xs text-gray-600'>
                      Health Protection
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Best Doctors */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='flex items-center justify-between mb-12'>
            <div>
              <h2 className='text-4xl font-bold mb-2'>MEET OUR BEST DOCTORS</h2>
              <p className='text-gray-600'>
                Experienced professionals dedicated to your health
              </p>
            </div>
            <div className='flex items-center gap-4 text-blue-500 font-semibold'>
              <span>58+</span>
              <span className='text-gray-400'>Our Expert Doctors</span>
            </div>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              { name: 'Beverly Little', role: 'General Surgeon', rating: 4.9 },
              { name: 'Anas El-Masry', role: 'Cardiologist', rating: 5.0 },
              { name: 'Free Doe', role: 'Neurologist', rating: 4.8 },
            ].map((doctor, index) => (
              <Card
                key={index}
                className='overflow-hidden hover:shadow-xl transition-shadow'
              >
                <div className='relative h-80 bg-linear-to-b from-blue-50 to-white'>
                  <Image
                    unoptimized
                    src={`https://placehold.co/600x400?text=Doctor-Image`}
                    alt={doctor.name}
                    width={300}
                    height={320}
                    className='w-full h-full object-cover'
                  />
                </div>
                <div className='p-6 text-center'>
                  <h3 className='font-bold text-lg mb-1'>{doctor.name}</h3>
                  <p className='text-gray-600 text-sm mb-3'>{doctor.role}</p>
                  <div className='flex items-center justify-center gap-1 text-yellow-500'>
                    <Star className='w-4 h-4 fill-current' />
                    <span className='text-sm font-semibold text-gray-700'>
                      {doctor.rating}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className='flex justify-center gap-2 mt-8'>
            <Button
              variant='outline'
              size='icon'
              className='rounded-full bg-transparent'
            >
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='rounded-full bg-transparent'
            >
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        </div>
      </section>

      {/* Our Clinics */}
      <LocationsSection />

      {/* About & Specialist Section */}
      <section
        className='flex flex-col justify-center h-[calc(100dvh-80px)] scroll-mt-20'
        id='about'
      >
        {/* About Medical Section */}
        <div className='max-w-7xl mx-auto px-6 py-20'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='relative'>
              <div className='absolute -top-4 -left-4 w-24 h-24 bg-blue-100 rounded-full -z-10' />
              <Image
                src='/male-doctor-in-blue-scrubs-with-tablet-smiling-pro.jpg'
                alt='Doctor'
                width={400}
                height={500}
                className='rounded-2xl w-full h-auto'
              />
              <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white -z-10'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>10+</div>
                  <div className='text-xs'>Years</div>
                </div>
              </div>
            </div>

            <div className='space-y-6'>
              <div>
                <h2 className='text-4xl font-bold mb-2'>
                  ABOUT MEDICALINK <span className='text-blue-500'>✦</span>
                </h2>
                <div className='flex items-center gap-4 text-blue-500 font-semibold'>
                  <span>10+</span>
                  <span className='text-gray-400'>Years of Experience</span>
                </div>
              </div>

              <p className='text-gray-600 leading-relaxed'>
                Since 2007 We're working Medical group of more than 12000+
                Patients help from our website
              </p>

              <div className='space-y-3'>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-blue-500 mt-1 shrink-0' />
                  <div>
                    <div className='font-semibold'>We're very specialized</div>
                    <div className='text-sm text-gray-600'>
                      Expert doctors in various medical fields
                    </div>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-blue-500 mt-1 shrink-0' />
                  <div>
                    <div className='font-semibold'>
                      Professional and Experienced
                    </div>
                    <div className='text-sm text-gray-600'>
                      Highly qualified medical professionals
                    </div>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='w-5 h-5 text-blue-500 mt-1 shrink-0' />
                  <div>
                    <div className='font-semibold'>24/7 Emergency Support</div>
                    <div className='text-sm text-gray-600'>
                      Round the clock medical assistance
                    </div>
                  </div>
                </div>
              </div>

              <Button className='bg-blue-500 hover:bg-blue-600 text-white'>
                Read More
              </Button>
            </div>
          </div>
        </div>

        <div className='w-full bg-linear-to-r from-blue-600 to-blue-700 py-6 overflow-hidden mt-auto'>
          <div className='max-w-7xl mx-auto px-6'>
            <div className='flex items-center gap-8 text-white animate-scroll-loop'>
              {[
                'CARDIOLOGIST',
                'NEUROLOGIST',
                'GYNECOLOGIST',
                'PEDIATRICIAN',
                'DERMATOLOGIST',
                'ORTHOPEDIST',
                'PSYCHIATRIST',
                'UROLOGIST',
                'ENDOCRINOLOGIST',
                'PULMONOLOGIST',
                'GASTROENTEROLOGIST',
                'OPHTHALMOLOGIST',
                'DENTIST',
                'ONCOLOGIST',
                'NEPHROLOGIST',
                'RHEUMATOLOGIST',
                'RADIOLOGIST',
                'PATHOLOGIST',
                'HEMATOLOGIST',
                'IMMUNOLOGIST',
                'ANESTHESIOLOGIST',
                'OTOLARYNGOLOGIST',
                'PLASTIC SURGEON',
                'VASCULAR SURGEON',
              ].map((spec, i) => (
                <div
                  key={i}
                  className='flex items-center gap-2 whitespace-nowrap'
                >
                  <span className='text-xl'>✦</span>
                  <span className='font-semibold'>{spec}</span>
                </div>
              ))}

              {[
                'CARDIOLOGIST',
                'NEUROLOGIST',
                'GYNECOLOGIST',
                'PEDIATRICIAN',
                'DERMATOLOGIST',
                'ORTHOPEDIST',
                'PSYCHIATRIST',
                'UROLOGIST',
                'ENDOCRINOLOGIST',
                'PULMONOLOGIST',
                'GASTROENTEROLOGIST',
                'OPHTHALMOLOGIST',
                'DENTIST',
                'ONCOLOGIST',
                'NEPHROLOGIST',
                'RHEUMATOLOGIST',
                'RADIOLOGIST',
                'PATHOLOGIST',
                'HEMATOLOGIST',
                'IMMUNOLOGIST',
                'ANESTHESIOLOGIST',
                'OTOLARYNGOLOGIST',
                'PLASTIC SURGEON',
                'VASCULAR SURGEON',
              ].map((spec, i) => (
                <div
                  key={i + 100}
                  className='flex items-center gap-2 whitespace-nowrap'
                >
                  <span className='text-xl'>✦</span>
                  <span className='font-semibold'>{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Make Appointment */}
      <section className='py-20 bg-linear-to-br from-[#0A2463] to-[#1e3a8a]'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div className='relative'>
              <Image
                src='/images/general-service.png'
                alt='Patient Care'
                width={500}
                height={500}
                className='rounded-2xl w-full h-auto'
              />
            </div>

            <div className='space-y-6'>
              <div>
                <h2 className='text-4xl font-bold mb-2 text-white'>
                  MAKE APPOINTMENT
                </h2>
                <p className='text-gray-200'>
                  Make an Online Appointment Booking For Treatment Patients
                </p>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <Input placeholder='First Name' className='bg-white' />
                <Input placeholder='Last Name' className='bg-white' />
                <Input
                  placeholder='Email Address'
                  type='email'
                  className='bg-white'
                />
                <Input
                  placeholder='Phone Number'
                  type='tel'
                  className='bg-white'
                />
                <Input placeholder='Date' type='date' className='bg-white' />
                <Input placeholder='Time' type='time' className='bg-white' />
              </div>

              <Input placeholder='Your Message' className='bg-white' />

              <Button
                className='w-full bg-blue-500 hover:bg-blue-600 text-white'
                size='lg'
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blog */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='flex items-center justify-between mb-12'>
            <div>
              <h2 className='text-4xl font-bold mb-2'>READ OUR LATEST BLOG</h2>
              <p className='text-gray-600'>
                Stay updated with healthcare news and tips
              </p>
            </div>
            <Button className='bg-blue-500 hover:bg-blue-600 text-white'>
              View All
            </Button>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                title: 'How to maintain healthy lifestyle',
                date: 'Dec 15, 2024',
              },
              {
                title: 'Understanding heart health basics',
                date: 'Dec 12, 2024',
              },
              {
                title: 'Tips for better mental wellness',
                date: 'Dec 10, 2024',
              },
            ].map((post, index) => (
              <Card
                key={index}
                className='overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group'
              >
                <div className='relative h-48'>
                  <Image
                    unoptimized
                    src={`https://placehold.co/600x400?text=Hello+World`}
                    alt={post.title}
                    width={400}
                    height={200}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                  />
                </div>
                <div className='p-6'>
                  <div className='text-sm text-gray-500 mb-2'>{post.date}</div>
                  <h3 className='font-semibold text-lg mb-3'>{post.title}</h3>
                  <Button variant='link' className='text-blue-500 p-0'>
                    Read More <ArrowRight className='w-4 h-4 ml-1' />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-linear-to-br from-[#0A2463] to-[#1e3a8a] text-white py-16'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='grid md:grid-cols-5 gap-8 mb-12'>
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-8 h-8 bg-white rounded-full flex items-center justify-center'>
                  <div className='w-4 h-4 bg-blue-600 rounded-full' />
                </div>
                <span className='font-bold text-xl'>Medic</span>
              </div>
              <p className='text-blue-200 mb-4'>
                Providing quality healthcare services with experienced doctors
                and modern facilities since 2007.
              </p>
              <div className='flex gap-3'>
                <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer'>
                  f
                </div>
                <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer'>
                  t
                </div>
                <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer'>
                  in
                </div>
                <div className='w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer'>
                  ig
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Company</h4>
              <ul className='space-y-2 text-blue-200'>
                <li>
                  <Link href='/about-us' className='hover:text-white'>
                    About
                  </Link>
                </li>
                <li>
                  <Link href='/doctors' className='hover:text-white'>
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link href='/news' className='hover:text-white'>
                    News
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Useful Links</h4>
              <ul className='space-y-2 text-blue-200'>
                <li>
                  <Link href='#' className='hover:text-white'>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href='#' className='hover:text-white'>
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className='font-semibold mb-4'>Contact</h4>
              <ul className='space-y-3 text-blue-200'>
                <li className='flex items-start gap-2'>
                  <Phone className='w-4 h-4 mt-1 shrink-0' />
                  <span>+1 234 567 890</span>
                </li>
                <li className='flex items-start gap-2'>
                  <Mail className='w-4 h-4 mt-1 shrink-0' />
                  <span>info@medic.com</span>
                </li>
                <li className='flex items-start gap-2'>
                  <MapPin className='w-4 h-4 mt-1 shrink-0' />
                  <span>123 Medical St, Health City</span>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-white/10 pt-8 flex items-center justify-between'>
            <p className='text-blue-200 text-sm'>
              © 2025 Medic. All rights reserved.
            </p>
            <Button variant='ghost' className='text-blue-200 hover:text-white'>
              Appointment Now
            </Button>
          </div>
        </div>

        {/* Doctor Image in Footer */}
      </footer>
    </div>
  );
}
