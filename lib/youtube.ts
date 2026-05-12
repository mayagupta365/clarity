export async function searchYouTube(query: string) {
    // Step 1: Search for video IDs
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      new URLSearchParams({
        part: "snippet",
        q: query,
        type: "video",
        maxResults: "15",
        key: process.env.YOUTUBE_API_KEY!,
      })
    )
    const searchData = await searchRes.json()
  
    if (!searchData.items?.length) return []
  
    const videoIds = searchData.items
      .map((i: any) => i.id.videoId)
      .join(",")
  
    // Step 2: Get full stats in one batch call
    const statsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?` +
      new URLSearchParams({
        part: "statistics,snippet,contentDetails",
        id: videoIds,
        key: process.env.YOUTUBE_API_KEY!,
      })
    )
    const statsData = await statsRes.json()
    return statsData.items || []
  }
  
  
  export async function getDislikes(videoId: string): Promise<number> {
    try {
      const res = await fetch(
        `https://returnyoutubedislike.com/api/votes?videoId=${videoId}`,
        { signal: AbortSignal.timeout(3000) }
      )
      const data = await res.json()
      return data.dislikes || 0
    } catch {
      return 0
    }
  }