import Image from 'next/image';

export function Footer() {
  return (
    <footer className='bg-linear-to-br from-blue-950 via-blue-900 to-blue-950 text-white py-12'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1'>
            <Image
              src='/brand/rect-logo.png'
              alt='Medicalink'
              width={240}
              height={60}
            />
          </div>
          <p className='text-blue-200 text-sm'>
            © 2025 MedicaLink. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
