'use client';

import { useEffect, useRef } from 'react';

import Link from 'next/link';

import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Calendar,
  Clock,
  Shield,
  Stethoscope,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

const COLORS = ['#1e3a8a', '#1e40af', '#2563eb', '#3b82f6'];

export function HeroSection() {
  const color = useMotionValue(COLORS[0]);
  const underHeroRef = useRef<HTMLDivElement>(null);

  const scrollDown = () => {
    if (underHeroRef.current) {
      const elementPosition = underHeroRef.current.getBoundingClientRect().top;
      const offsetPosition = window.scrollY + elementPosition - 80;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    animate(color, COLORS, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    });
  }, [color]);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #172554 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <>
      <motion.section
        style={{
          backgroundImage,
        }}
        className='relative h-dvh flex items-center justify-center overflow-hidden'
      >
        {/* Dark Background Pattern */}
        <div className='absolute inset-0 overflow-hidden'>
          {/* Animated Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className='absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl'
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: 1,
            }}
            className='absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl'
          />

          {/* Minimal Grid Pattern */}
          <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[4rem_4rem]' />
        </div>

        <div className='max-w-7xl mx-auto px-6 py-20 relative z-10'>
          <div className='grid lg:grid-cols-2 gap-16 items-center'>
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className='space-y-8 relative'
            >
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm'
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Stethoscope className='w-4 h-4 text-cyan-400' />
                </motion.div>
                <span className='text-sm font-medium text-cyan-100'>
                  Professional Healthcare Platform
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className='space-y-4'
              >
                <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight'>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className='text-white block'
                  >
                    Healthcare
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className='text-white'
                  >
                    Made{' '}
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className='bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'
                  >
                    Simple
                  </motion.span>
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className='text-lg md:text-xl text-blue-100 leading-relaxed max-w-lg'
                >
                  Connect with experienced doctors and access quality healthcare
                  services from anywhere, anytime.
                </motion.p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className='flex flex-wrap gap-4'
              >
                <Link href='/appointments'>
                  <motion.div
                    style={{
                      borderRadius: '50%',
                      border,
                      boxShadow,
                    }}
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    <Button
                      size='lg'
                      className='bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8 transition-all group border-0'
                    >
                      Book Appointment
                      <ArrowRight className='ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform' />
                    </Button>
                  </motion.div>
                </Link>

                <Link href='/doctors'>
                  <motion.div
                    whileHover={{
                      scale: 1.05,
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    <Button
                      size='lg'
                      variant='outline'
                      className='border-2 border-white/30 hover:border-white/50 text-white hover:text-white rounded-full px-8 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all'
                    >
                      Find Doctors
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className='flex flex-wrap gap-6 pt-8 border-t border-white/10'
              >
                {[
                  { icon: Shield, text: 'Certified Professionals' },
                  { icon: Clock, text: 'Always Available' },
                  { icon: Calendar, text: 'Easy Scheduling' },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    className='flex items-center gap-2'
                  >
                    <div className='w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center'>
                      <item.icon className='w-4 h-4 text-cyan-400' />
                    </div>
                    <span className='text-sm text-blue-200'>{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Features Cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className='relative'
            >
              {/* Decorative Element */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className='absolute -top-8 -right-8 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl'
              />

              <div className='relative space-y-4'>
                {[
                  {
                    icon: Calendar,
                    title: 'Easy Booking',
                    description: 'Schedule appointments with just a few clicks',
                    delay: 0.5,
                  },
                  {
                    icon: Shield,
                    title: 'Verified Doctors',
                    description: 'All doctors are certified and experienced',
                    delay: 0.6,
                    ml: true,
                  },
                  {
                    icon: Clock,
                    title: 'Always Available',
                    description: 'Get medical support whenever you need it',
                    delay: 0.7,
                  },
                ].map((card) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: card.delay, duration: 0.6 }}
                    whileHover={{
                      y: -8,
                      scale: 1.02,
                    }}
                    className={`group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${card.ml ? 'ml-8' : ''}`}
                  >
                    <div className='flex items-start gap-4'>
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className='w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 transition-colors'
                      >
                        <card.icon className='w-6 h-6 text-cyan-400 group-hover:text-white transition-colors' />
                      </motion.div>
                      <div className='flex-1'>
                        <h3 className='font-semibold text-white mb-1'>
                          {card.title}
                        </h3>
                        <p className='text-sm text-blue-200 leading-relaxed'>
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className='absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-blue-950 to-transparent pointer-events-none' />
        <button
          className='absolute z-1 flex items-center justify-center bottom-8 left-1/2 -translate-x-1/2 size-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors hover:shadow-sm hover:shadow-white/10 cursor-pointer'
          onClick={() => scrollDown()}
        >
          <ArrowDown className='size-6 text-white/50' />
        </button>
        <div className='absolute inset-0 z-0'>
          <Canvas>
            <Stars
              radius={100}
              depth={50}
              count={5000}
              factor={4}
              saturation={0}
              fade
              speed={3}
            />
          </Canvas>
        </div>
      </motion.section>
      <div ref={underHeroRef} />
    </>
  );
}
