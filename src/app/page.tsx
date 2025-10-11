import Image from "next/image";
import { Flower } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#E5F1FF] text-white p-6">
      {/* Hero */}
      <section
        className="relative flex items-center justify-center h-[800px] bg-[#002570] text-white rounded-2xl mb-6 p-8"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '250px 250px'
        }}
      >
        {/* Text phía său ảnh */}
        <h1 className="absolute left-1/2 top-1/2 transform -translate-x-[calc(50%+50px)] -translate-y-[calc(50%+200px)] text-[110px] font-bold text-white z-0">
          HEALTHCARE
        </h1>

        {/* Ảnh bác sĩ */}
        <div className="absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="/doctors/hero-img.png"
            alt="Doctor"
            className="w-[699px] h-[766px] object-contain"
          />
        </div>

        {/* Text phía trước ảnh */}
        <h2 className="absolute left-1/2 top-1/2 transform -translate-x-[calc(50%-140px)] -translate-y-[calc(50%+60px)] text-[110px] font-bold text-white z-20">
          DOCTORS
        </h2>

        {/* Free Consultation Link - Góc dưới bên phải */}
        <a
          href="/book-appointment"
          className="absolute bottom-8 right-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors duration-200 z-30 text-white font-medium"
        >
          Free Consultation →
        </a>
        <p className="mt-4 text-blue-200">
          Best Medical – Rapidiously reinvent long-term impact collaboration
        </p>
      </section>

      {/* Stats */}
      <section className="bg-blue-700 text-center py-10 rounded-2xl p-8">
        <h2 className="text-xl font-semibold">
          Medical Achievement Health Protection
        </h2>
        <div className="flex justify-center gap-20 mt-6">
          <div>
            <p className="text-3xl font-bold">12K+</p>
            <span>Satisfied Patients</span>
          </div>
          <div>
            <p className="text-3xl font-bold">100%</p>
            <span>Satisfaction Rates</span>
          </div>
        </div>
      </section>
    </main>
  );
}
