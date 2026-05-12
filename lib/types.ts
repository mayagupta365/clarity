export interface VideoResult {
  id: string
  title: string
  channel: string
  channelTitle: string        // ← add this
  thumbnail: string
  publishedAt: string
  duration?: string
  views: number
  viewCount: number           // ← add this
  likes: number
  likeCount: number           // ← add this
  dislikes: number
  dislikeCount: number        // ← add this
  comments: number
  commentCount: number        // ← add this
  score: number
  source?: "ml" | "formula"
  scoreBreakdown: {           // ← add this
    likeRatio: number
    engagementRate: number
    timeDecay: number
    commentScore: number
  }
}

export interface AISummary {
  takeaway: string
  bullets: string[]
  followup: string[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}