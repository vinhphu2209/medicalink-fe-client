'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowRight, Stethoscope } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export default function SpecialtyCard({ specialty }: { specialty: any }) {
  const { name, description, iconUrl, slug, doctorCount, averageRating } =
    specialty;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2 }}
      className='h-full'
    >
      <Card className='group h-full gap-1 flex flex-col bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 p-0'>
        <CardHeader className='relative p-0'>
          <div className='relative h-36 bg-linear-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 overflow-hidden'>
            <div className='absolute inset-0 bg-linear-to-t from-blue-600/10 to-transparent' />
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='relative w-24 h-24 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300'>
                {iconUrl ? (
                  <Image
                    src={iconUrl}
                    alt={name}
                    width={96}
                    height={96}
                    className='size-full object-contain'
                  />
                ) : (
                  <Stethoscope className='size-full text-blue-600 dark:text-blue-400' />
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='flex-1 px-5 py-0 space-y-4'>
          <h3 className='text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
            {name}
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-5'>
            {description ||
              'Comprehensive medical care provided by experienced specialists dedicated to your health and well-being.'}
          </p>
        </CardContent>

        <CardFooter className='px-5 py-4'>
          <Link
            href={`/specialty/${slug || name.toLowerCase().replace(/\s+/g, '-')}`}
            className='w-full'
          >
            <Button
              className='w-full group/btn cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
              variant='default'
            >
              View Details
              <ArrowRight className='w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform' />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
