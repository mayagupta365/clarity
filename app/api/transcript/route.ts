import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const videoId = req.nextUrl.searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "videoId is required" }, { status: 400 })
  }

  try {
    // Option 1 — YouTube timedtext (free, no key)
    const res = await fetch(
      `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`,
      { signal: AbortSignal.timeout(5000) }
    )
    const xml = await res.text()

    if (xml && xml.includes("<text")) {
      const transcript = xml
        .replace(/<[^>]*>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim()

      return NextResponse.json({ transcript, source: "youtube" })
    }

    // Option 2 — Fall back to video description
    const descRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      new URLSearchParams({
        part: "snippet",
        id: videoId,
        key: process.env.YOUTUBE_API_KEY!,
      })
    )
    const descData = await descRes.json()
    const description = descData.items?.[0]?.snippet?.description || ""

    if (description) {
      return NextResponse.json({
        transcript: description,
        source: "description",
      })
    }

    return NextResponse.json({ transcript: null, source: "none" })

  } catch (err) {
    console.error("Transcript error:", err)
    return NextResponse.json({ transcript: null, source: "error" })
  }
}