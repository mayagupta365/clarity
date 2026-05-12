import { NextRequest } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  const { messages, transcript } = await req.json()

  const systemPrompt = transcript
    ? `You are an expert tutor helping a student understand a video they just watched.
Answer ONLY based on the content of this video transcript.
If asked something outside the video scope, say so politely.
Be encouraging, clear, and use markdown formatting.

Video Transcript:
${transcript.slice(0, 8000)}`
    : `You are a helpful educational assistant. Be clear and concise.`

  try {
    const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite-preview",
      systemInstruction: systemPrompt,
    })

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))

    const lastMessage = messages[messages.length - 1].content

    const chat = model.startChat({ history })
    const result = await chat.sendMessageStream(lastMessage)

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) controller.enqueue(encoder.encode(text))
          }
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })

  } catch (err) {
    console.error("Chat error:", err)
    return new Response("Failed to generate response", { status: 500 })
  }
}