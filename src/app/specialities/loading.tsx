export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-neutral-800 h-40 rounded-2xl"></div>
            ))}
        </div>
    )
}
