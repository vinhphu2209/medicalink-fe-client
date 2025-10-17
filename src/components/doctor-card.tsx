import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DoctorCardProps {
  id: string
  fullName: string
  degree: string
  position: string[]
  introduction: string
  avatarUrl: string
  portrait: string
  specialties: Array<{
    id: string
    name: string
    slug: string
  }>
  workLocations: Array<{
    id: string
    name: string
    address: string
    phone: string
  }>
  email: string
  phone: string
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
  email,
  phone,
}: DoctorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
      {/* Doctor Image */}
      <div className="relative h-80 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <Image
          src={portrait || avatarUrl || "/placeholder.svg?height=320&width=300&query=professional doctor"}
          alt={fullName}
          width={300}
          height={320}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Doctor Info */}
      <div className="p-6 space-y-4">
        {/* Name and Degree */}
        <div>
          <h3 className="font-bold text-lg text-gray-900">{fullName}</h3>
          <p className="text-sm text-blue-600 font-semibold">{degree}</p>
        </div>

        {/* Position */}
        {position && position.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {position.slice(0, 2).map((pos, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {pos}
              </Badge>
            ))}
          </div>
        )}

        {/* Specialties */}
        {specialties && specialties.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600 uppercase">Specialties</p>
            <div className="flex flex-wrap gap-1">
              {specialties.slice(0, 2).map((specialty) => (
                <Badge
                  key={specialty.id}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {specialty.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Introduction Preview */}
        <p className="text-sm text-gray-600 line-clamp-2">{introduction}</p>

        {/* Work Location */}
        {workLocations && workLocations.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
            <span className="line-clamp-1">{workLocations[0].name}</span>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-blue-500" />
            <span className="truncate">{phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="truncate">{email}</span>
          </div>
        </div>

        {/* View Profile Link */}
        <Link
          href={`/doctors/${id}`}
          className="block w-full text-center py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
        >
          View Profile
        </Link>
      </div>
    </Card>
  )
}
