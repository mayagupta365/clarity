import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash"})

export async function POST(req: NextRequest) {
  const { transcript, title } = await req.json()

  if (!transcript && !title) {
    return NextResponse.json(
      { error: "No content to summarize" },
      { status: 400 }
    )
  }

  try {
    const content = transcript
      ? `Video Title: ${title}\n\nTranscript:\n${transcript.slice(0, 8000)}`
      : `Video Title: ${title}\n\nNo transcript — summarize based on title only.`

    const prompt = `You are an expert educational content summarizer.

${content}

Return ONLY a valid JSON object with exactly this structure, no extra text:
{
  "takeaway": "one sentence core takeaway",
  "bullets": ["key point 1", "key point 2", "key point 3", "key point 4", "key point 5"],
  "followup": ["topic 1", "topic 2", "topic 3"]
}`

    const result = await model.generateContent(prompt)
    // console.log(result.response.text());
    const raw = result.response.text()
    console.log("raw", raw);
    const cleaned = raw.replace(/```json|```/g, "").trim()
    console.log("cleaned", cleaned);
    const summary = JSON.parse(cleaned)
    console.log("summary", summary);

    return NextResponse.json({ summary })

  } catch (err) {
    console.error("Summary error:", err)
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    )
  }
}