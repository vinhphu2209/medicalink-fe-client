
import { Flower } from "lucide-react";

export default function Specialty({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Flower className="size-10 text-green-500" />
      <div className="text-xl font-bold mt-4">Slug: {slug}</div>
    </div>
  );
}
