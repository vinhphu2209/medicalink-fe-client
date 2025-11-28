'use client';

import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';

import SpecialtyCard from '@/components/specialties/specialty-card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function SpecialtiesList({
  specialties,
}: {
  specialties: any[];
}) {
  if (!specialties.length) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Empty className='border-gray-200 dark:border-neutral-800'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <Stethoscope className='w-6 h-6' />
            </EmptyMedia>
            <EmptyTitle>No Specialties Available</EmptyTitle>
            <EmptyDescription>
              We're currently updating our specialty listings. Please check back
              soon.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      animate='visible'
      className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    >
      {specialties.map((sp, index) => (
        <motion.div
          key={sp.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.4,
                ease: 'easeOut',
              },
            },
          }}
        >
          <SpecialtyCard specialty={sp} />
        </motion.div>
      ))}
    </motion.div>
  );
}
