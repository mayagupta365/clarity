export async function rankWithML(videos: any[], query: string) {
    const payload = {
      query,
      videos: videos.map((v: any) => ({
        id: v.id,
        title: v.snippet.title,
        likes:    parseInt(v.statistics?.likeCount    || 0),
        dislikes: v.estimatedDislikes || 0,
        views:    parseInt(v.statistics?.viewCount    || 1),
        comments: parseInt(v.statistics?.commentCount || 0),
        age_days: Math.max(
          Math.floor(
            (Date.now() - new Date(v.snippet.publishedAt).getTime()) / 86400000
          ), 1
        ),
      })),
    }
  
    const res = await fetch(`${process.env.ML_SERVICE_URL}/rank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ML_API_KEY!,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    })
  
    if (!res.ok) throw new Error(`ML service error: ${res.status}`)
    return await res.json()
  }
export function formulaFallback(videos: any[]) {
    return videos
      .map((v: any) => {
        const likes    = parseInt(v.statistics?.likeCount    || 0)
        const dislikes = v.estimatedDislikes || 0
        const views    = Math.max(parseInt(v.statistics?.viewCount || 1), 1)
        const comments = parseInt(v.statistics?.commentCount || 0)
        const hoursSince = (Date.now() - new Date(v.snippet.publishedAt).getTime()) / 3600000
  
        const likeRatio      = likes / (likes + dislikes + 1)
        const engagementRate = Math.min((likes + comments) / views * 100, 10) / 10
        const timeDecay      = Math.min(1 / Math.pow(hoursSince + 2, 1.5) * 1000, 1)
        const commentScore   = Math.min(comments / 1000, 1)
  
        const score = Math.round(
          (likeRatio * 0.35 + engagementRate * 0.35 +
           timeDecay * 0.20 + commentScore * 0.10) * 100
        ) 
  
        return {
          id:           v.id,
          title:        v.snippet.title,
          channel:      v.snippet.channelTitle,
          channelTitle: v.snippet.channelTitle,   // ← both field names
          thumbnail:    v.snippet.thumbnails?.high?.url,
          publishedAt:  v.snippet.publishedAt,
          duration:     v.contentDetails?.duration || "",
          views,
          viewCount:    views,                    // ← both field names
          likes,
          likeCount:    likes,                    // ← both field names
          dislikes,
          dislikeCount: dislikes,                 // ← both field names
          comments,
          commentCount: comments,                 // ← both field names
          score,
          source: "formula" as const,
          scoreBreakdown: {                       // ← add breakdown
            likeRatio,
            engagementRate,
            timeDecay,
            commentScore,
          },
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }