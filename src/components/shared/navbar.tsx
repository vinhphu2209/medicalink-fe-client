'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

const BookAppointmentButton = () => {
  return (
    <Link href='/appointments'>
      <Button className='group rounded-sm bg-transparent bg-linear-to-r from-sky-500 via-sky-500/60 to-sky-500 bg-size-[200%_auto] text-white hover:bg-transparent hover:bg-position-[99%_center] focus-visible:ring-sky-500/20 dark:from-sky-400 dark:via-sky-400/60 dark:to-sky-400 dark:focus-visible:ring-sky-400/40 cursor-pointer shadow-md shadow-sky-300/10 hover:shadow-sky-300/30'>
        Book Appointment
        <ArrowRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300' />
      </Button>
    </Link>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-linear-to-br from-[#0A2463]/80 to-[#1e3a8a]/80 backdrop-blur-sm border-white/10 shadow-lg'
          : 'bg-linear-to-br from-[#0A2463] to-[#1e3a8a] border-transparent'
      }`}
    >
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        {/* Logo */}
        <Link href='/'>
          <Image
            src='/brand/rect-logo.png'
            alt='Medicalink'
            width={200}
            height={45}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center gap-8 text-white'>
          <Link href='/' className='hover:text-blue-300 transition-colors'>
            Home
          </Link>
          <Link
            href='/specialities'
            className='hover:text-blue-300 transition-colors'
          >
            Specialities
          </Link>
          <Link
            href='/doctors'
            className='hover:text-blue-300 transition-colors'
          >
            Doctors
          </Link>
          <Link href='/blogs' className='hover:text-blue-300 transition-colors'>
            Blogs
          </Link>
          <Link
            href='/contact'
            className='hover:text-blue-300 transition-colors'
          >
            Contact
          </Link>
        </div>

        {/* Desktop Appointment Button */}
        <div className='hidden md:block'>
          <BookAppointmentButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-white'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className={`md:hidden absolute top-full left-0 right-0 border-t border-white/10 transition-all duration-300 ${
            isScrolled
              ? 'bg-gradient-to-br from-[#0A2463]/80 to-[#1e3a8a]/80 backdrop-blur-md'
              : 'bg-gradient-to-br from-[#0A2463] to-[#1e3a8a]'
          }`}
        >
          <div className='max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4'>
            <Link
              href='/'
              className='text-white hover:text-blue-300 transition-colors py-2'
            >
              Home
            </Link>
            <Link
              href='/specialities'
              className='text-white hover:text-blue-300 transition-colors py-2'
            >
              Specialities
            </Link>
            <Link
              href='/doctors'
              className='text-white hover:text-blue-300 transition-colors py-2'
            >
              Doctors
            </Link>
            <Link
              href='/blogs'
              className='text-white hover:text-blue-300 transition-colors py-2'
            >
              Blogs
            </Link>
            <Link
              href='/contact'
              className='text-white hover:text-blue-300 transition-colors py-2'
            >
              Contact
            </Link>
            <BookAppointmentButton />
          </div>
        </div>
      )}
    </nav>
  );
}
