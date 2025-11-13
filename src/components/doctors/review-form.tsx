"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ReviewFormProps {
    doctorId: string
}

export function ReviewForm({ doctorId }: ReviewFormProps) {
    const [rating, setRating] = useState(5)
    const [authorName, setAuthorName] = useState("")
    const [authorEmail, setAuthorEmail] = useState("")
    const [body, setBody] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!authorName.trim()) {
            setError("Please enter your name")
            return
        }

        if (!authorEmail.trim()) {
            setError("Please enter your email")
            return
        }

        if (!body.trim()) {
            setError("Please enter your review")
            return
        }

        try {
            setLoading(true)
            setError(null)

            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
            const response = await fetch(`${baseUrl}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    doctorId,
                    rating,
                    title: `${rating}-star review`,
                    body,
                    authorName,
                    authorEmail,
                }),
            })

            if (!response.ok) {
                toast.error("Failed to submit review")
            }
            toast.success("Review submitted successfully")

            setSuccess(true)
            setAuthorName("")
            setAuthorEmail("")
            setBody("")
            setRating(5)

            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            console.error("[v0] Error submitting review:", err)
            setError(err instanceof Error ? err.message : "Failed to submit review")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Rating */}
            <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Your Rating</label>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            </button>
                        ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-600">{rating} out of 5</span>
                </div>
            </div>

            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Name
                </label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="bg-white border-gray-300"
                />


            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Email
                </label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    className="bg-white border-gray-300"
                />
            </div>

            {/* Review Body */}
            <div>
                <label htmlFor="review" className="block text-sm font-semibold text-gray-900 mb-2">
                    Your Review
                </label>
                <textarea
                    id="review"
                    placeholder="Share your experience with this doctor..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                />
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Send Review"
                )}
            </Button>
        </form>
    )
}
