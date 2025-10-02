import Image from "next/image";
import { Flower } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-blue-900 text-white">
      {/* Hero */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20 bg-blue-900 relative">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Health Care <span className="text-white">Doctors</span>
          </h1>
          <p className="mt-4 text-blue-200">
            Best Medical – Rapidiously reinvent long-term impact collaboration
          </p>
          <button className="mt-6 bg-blue-600 px-6 py-3 rounded-lg">
            Free Consultation →
          </button>
        </div>
        <div>
          <img
            src="/doctors/hero-img.png" // để ảnh doctor vào public/doctor.png
            alt="Doctor"
            className="w-[400px]"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-700 text-center py-10">
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
