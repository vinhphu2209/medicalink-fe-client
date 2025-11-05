import SpecialtiesList from "@/components/specialties/specialties-list"

async function getSpecialties() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties/public`, {
        next: { revalidate: 3600 }, // ISR: revalidate mỗi 1 tiếng
    })
    if (!res.ok) throw new Error("Failed to fetch specialties")
    return res.json()
}

export default async function SpecialtiesPage() {
    const data = await getSpecialties()
    const specialties = data.data || []

    return (
        <section className="max-w-7xl mx-auto px-6 py-20">
            <h1 className="text-3xl font-bold text-center mb-10">
                OUR SPECIALTIES
            </h1>
            <SpecialtiesList specialties={specialties} />
        </section>
    )
}
