import { NextRequest, NextResponse } from "next/server"
import { searchYouTube, getDislikes } from "@/lib/youtube"
import { rankWithML, formulaFallback } from "@/lib/ml"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 })
  }

  try {
    // Step 1 — Fetch raw videos from YouTube
    const rawVideos = await searchYouTube(query)

    if (!rawVideos.length) {
      return NextResponse.json({ error: "No videos found" }, { status: 404 })
    }

    // Step 2 — Fetch dislike estimates
    const videosWithDislikes = await Promise.all(
      rawVideos.map(async (v: any) => ({
        ...v,
        estimatedDislikes: await getDislikes(v.id),
      }))
    )

    // Step 3 — Try ML ranking first
    try {
      const mlResult = await rankWithML(videosWithDislikes, query)

      const enriched = mlResult.videos.map((mlVideo: any) => {
        const original = videosWithDislikes.find((v: any) => v.id === mlVideo.id)
        const likes    = mlVideo.likes
        const dislikes = mlVideo.dislikes
        const views    = mlVideo.views
        const comments = mlVideo.comments
        const hoursSince = (Date.now() - new Date(original?.snippet?.publishedAt).getTime()) / 3600000

        const likeRatio      = likes / (likes + dislikes + 1)
        const engagementRate = Math.min((likes + comments) / Math.max(views, 1) * 100, 10) / 10
        const timeDecay      = Math.min(1 / Math.pow(hoursSince + 2, 1.5) * 1000, 1)
        const commentScore   = Math.min(comments / 1000, 1)

        return {
          id:           mlVideo.id,
          title:        mlVideo.title,
          channel:      original?.snippet?.channelTitle || "",
          channelTitle: original?.snippet?.channelTitle || "",
          thumbnail:    original?.snippet?.thumbnails?.high?.url || "",
          publishedAt:  original?.snippet?.publishedAt || "",
          duration:     original?.contentDetails?.duration || "",
          views,
          viewCount:    views,
          likes,
          likeCount:    likes,
          dislikes,
          dislikeCount: dislikes,
          comments,
          commentCount: comments,
          score:        Math.round(mlVideo.ml_score * 100),
          source:       "ml" as const,
          scoreBreakdown: {
            likeRatio,
            engagementRate,
            timeDecay,
            commentScore,
          },
        }
      })

      return NextResponse.json({ videos: enriched, source: "ml" })  // ← was missing

    } catch (mlError) {
      // ML service down — use formula fallback
      console.warn("ML unavailable, using formula:", mlError)
      const fallback = formulaFallback(videosWithDislikes)
      return NextResponse.json({ videos: fallback, source: "formula" })
    }

  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    )
  }
}