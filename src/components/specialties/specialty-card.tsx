"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function SpecialtyCard({ specialty }: { specialty: any }) {
    const { name, description, iconUrl, slug } = specialty

    return (
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center text-center">
                <Image
                    src={iconUrl || "/default-icon.png"}
                    alt={name}
                    width={64}
                    height={64}
                    className="mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{name}</h3>
                <p className="text-sm text-gray-500 line-clamp-3">{description}</p>
                <Button className="mt-4 w-full" variant="default">
                    Xem chi tiết
                </Button>
            </div>
        </div>
    )
}
