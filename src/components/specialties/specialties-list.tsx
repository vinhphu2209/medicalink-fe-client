"use client"

import { motion } from "framer-motion"
import SpecialtyCard from "@/components/specialties/specialty-card"

export default function SpecialtiesList({ specialties }: { specialties: any[] }) {
    if (!specialties.length)
        return <p className="text-center text-gray-500">Chưa có chuyên khoa nào.</p>

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
            {specialties.map((sp) => (
                <SpecialtyCard key={sp.id} specialty={sp} />
            ))}
        </motion.div>
    )
}
