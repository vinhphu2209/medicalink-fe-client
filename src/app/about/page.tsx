// src/app/about/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { exampleAPI } from '@/api/auth';

export default function AboutPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['example'],
    queryFn: () => exampleAPI(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Posts Info</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}