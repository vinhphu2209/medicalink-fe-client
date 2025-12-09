import type { Specialty } from '@/types/doctor';

async function getSpecialties(): Promise<Specialty[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/specialties/public`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) {
      throw new Error('Failed to fetch specialties');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return [];
  }
}

export async function SpecialtiesScrollLoop() {
  const specialties = await getSpecialties();

  if (specialties.length === 0) {
    return null;
  }

  // Duplicate for seamless loop
  const specialtyNames = specialties.map((s) => s.name.toUpperCase());

  return (
    <div className='w-full bg-linear-to-r from-blue-600 to-blue-700 py-6 overflow-hidden mt-auto'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex items-center gap-8 text-white animate-scroll-loop'>
          {specialtyNames.map((name, i) => (
            <div key={i} className='flex items-center gap-2 whitespace-nowrap'>
              <span className='text-xl'>✦</span>
              <span className='font-semibold'>{name}</span>
            </div>
          ))}

          {/* Duplicate for seamless scrolling */}
          {specialtyNames.map((name, i) => (
            <div
              key={i + specialtyNames.length}
              className='flex items-center gap-2 whitespace-nowrap'
            >
              <span className='text-xl'>✦</span>
              <span className='font-semibold'>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
