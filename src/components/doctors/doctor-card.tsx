import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DoctorCardProps {
  id: string
  fullName: string
  degree: string
  position: string[]
  introduction?: string
  avatarUrl: string
  portrait?: string
  specialties?: Array<{
    id: string
    name: string
    slug: string
  }>
  workLocations: Array<{
    id: string
    name: string
    address: string
  }>
  email?: string
  phone?: string
}

export function DoctorCard({
  id,
  fullName,
  degree,
  position,
  introduction,
  avatarUrl,
  portrait,
  specialties,
  workLocations,
  email
}: DoctorCardProps) {
  return (
    <Link href={`/doctors/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
        {/* Doctor Avatar - Smaller */}
        <div className="relative h-48 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
          <Image
            src={portrait || avatarUrl || "/placeholder.svg?height=192&width=240&query=professional doctor"}
            alt={fullName}
            width={240}
            height={192}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Doctor Info */}
        <div className="p-4 space-y-3">
          {/* Name and Degree */}
          <div>
            <h3 className="font-bold text-base text-gray-900">
              {degree ? `${degree} ` : ""}
              {fullName}
            </h3>
          </div>

          {/* Position */}
          {position && position.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {position.slice(0, 2).map((pos, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs py-1">
                  {pos}
                </Badge>
              ))}
            </div>
          )}

          {/* Work Locations */}
          {workLocations && workLocations.length > 0 && (
            <div className="space-y-2 border-t border-gray-200 pt-3">
              {workLocations.slice(0, 2).map((location) => (
                <div key={location.id} className="flex items-start gap-2 text-xs text-gray-600">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700">{location.name}</p>
                    <p className="line-clamp-1 text-gray-500">{location.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
