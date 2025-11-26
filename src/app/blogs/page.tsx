"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BlogCard } from "@/components/blog-card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Blog {
  id: string
  title: string
  slug: string
  thumbnailUrl: string
  authorId: string
  category: {
    id: string
    name: string
    slug: string
  }
  status: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  publicIds: string[]
  authorName: string
}

interface ApiResponse {
  success: boolean
  data: Blog[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [meta, setMeta] = useState({
    page: 1,
    limit: 2,
    total: 0,
    hasNext: false,
    hasPrev: false,
    totalPages: 1,
  })

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)

        // Base URL (đặt trong .env hoặc fallback)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL

        // Endpoint chính xác
        const url = new URL(`${baseUrl}/blogs/public`)

        // Thêm các query params
        url.searchParams.append("sortBy", "createdAt")
        url.searchParams.append("sortOrder", "DESC")
        url.searchParams.append("page", currentPage.toString())
        url.searchParams.append("limit", "5") // tuỳ bạn muốn giới hạn bao nhiêu

        // Gọi API
        const response = await fetch(url.toString())
        if (!response.ok) {
          throw new Error("Failed to fetch blogs")
        }

        // Parse JSON
        const data: ApiResponse = await response.json()

        // Set data vào state
        // (Không cần filter status vì API `/public` chỉ trả blog đã PUBLISHED)
        setBlogs(data.data)
        setMeta(data.meta)
        setError(null)
      } catch (err) {
        console.error("[v0] Error fetching blogs:", err)
        setError(err instanceof Error ? err.message : "Failed to load blogs")
        setBlogs([])
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [currentPage])


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-white space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold">
              LATEST MEDICAL
              <span className="flex items-center justify-center gap-2 mt-2">
                NEWS & BLOGS
                <span className="text-red-500 text-4xl">+</span>
              </span>
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Stay informed with the latest medical news, health tips, and expert insights from our healthcare
              professionals
            </p>
            <div className="flex items-center gap-4 text-blue-200 font-semibold justify-center">
              <span>{meta.total}+</span>
              <span>Articles Published</span>
            </div>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <p className="text-gray-600">Loading blogs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <p className="text-red-600 font-semibold">Error loading blogs</p>
              <p className="text-gray-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600 text-white">
                Try Again
              </Button>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-lg">No blogs found</p>
              <Button onClick={() => setCurrentPage(1)} className="bg-blue-500 hover:bg-blue-600 text-white">
                Go to First Page
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={!meta.hasPrev}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className={currentPage === page ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                  disabled={!meta.hasNext}
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-blue-500 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-3xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-blue-100">Get the latest medical news and health tips delivered to your inbox</p>
            </div>
            <Button size="lg" className="bg-white text-blue-500 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#0A2463] to-[#1e3a8a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full" />
              </div>
              <span className="font-bold text-xl">Medic</span>
            </div>
            <p className="text-blue-200 text-sm">© 2025 Medic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
