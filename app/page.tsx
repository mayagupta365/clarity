"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2 } from "lucide-react";
import type { VideoResult, ChatMessage, AISummary } from "@/lib/types";
import { SearchBar } from "@/components/SearchBar";
import { LandingHero } from "@/components/LandingHero";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AlternativeVideos } from "@/components/AlternativeVideos";
import { SummaryPanel } from "@/components/SummaryPanel";
import { ChatPanel } from "@/components/ChatPanel";
import { SearchSkeleton } from "@/components/SearchSkeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatStreaming, setIsChatStreaming] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  const loadTranscriptAndSummary = useCallback(async (
    videoId: string,
    videoTitle: string
  ) => {
    try {
      const tRes = await fetch(`/api/transcript?videoId=${videoId}`)
      const tData = await tRes.json()
      const fetchedTranscript = tData.transcript || null
      setTranscript(fetchedTranscript)

      const sRes = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: fetchedTranscript,
          title: videoTitle,
        }),
      })
      const sData = await sRes.json()
      setSummary(sData.summary || null)
    } catch (err) {
      console.error("Failed to load transcript/summary:", err)
    }
  }, [])

  const handleSearch = useCallback(async (query: string) => {
    setIsSearching(true)
    setHasSearched(true)
    setSummary(null)
    setTranscript(null)
    setChatMessages([])

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Search failed")

      setVideos(data.videos)
      setSelectedVideo(data.videos[0])
      setIsSearching(false)
      setActiveTab("summary")

      setIsLoadingSummary(true)
      await loadTranscriptAndSummary(data.videos[0].id, data.videos[0].title)
      setIsLoadingSummary(false)

    } catch (err) {
      console.error("Search failed:", err)
      setIsSearching(false)
      setIsLoadingSummary(false)
    }
  }, [loadTranscriptAndSummary])

  const handleSelectVideo = useCallback(async (video: VideoResult) => {
    setSelectedVideo(video)
    setSummary(null)
    setTranscript(null)
    setChatMessages([])
    setIsLoadingSummary(true)
    setActiveTab("summary")

    // On mobile scroll to top when switching videos
    window.scrollTo({ top: 0, behavior: "smooth" })

    await loadTranscriptAndSummary(video.id, video.title)
    setIsLoadingSummary(false)
  }, [loadTranscriptAndSummary])

  const handleSendMessage = useCallback(async (message: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
    }
    setChatMessages((prev) => [...prev, userMsg])
    setIsChatStreaming(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          transcript,
        }),
      })

      if (!res.ok) throw new Error("Chat failed")

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let aiContent = ""

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
      }
      setChatMessages((prev) => [...prev, aiMsg])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          aiContent += decoder.decode(value)
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === aiMsg.id ? { ...m, content: aiContent } : m
            )
          )
        }
      }
    } catch (err) {
      console.error("Chat error:", err)
    } finally {
      setIsChatStreaming(false)
    }
  }, [chatMessages, transcript])

  const handleShare = () => {
    if (!selectedVideo) return
    const url = `${window.location.origin}?v=${selectedVideo.id}`
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] animate-gradient opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(229,9,20,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(229,9,20,0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(20,20,20,0.8) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: "#e50914" }}>
        <div className="mx-auto flex max-w-7xl justify-center items-center gap-2 sm:gap-8 px-3 sm:px-4 py-2 sm:py-3">

          {/* Logo */}

          <a href="/"
            className="text-2xl sm:text-2xl font-black tracking-tight shrink-0"
            style={{ color: "#ffffff", letterSpacing: "-0.5px" }}
          >
            Clarity<span style={{ color: "#000000" }}>Tube</span>
          </a>

          {/* Search bar */}
          {hasSearched && (
            <div className="flex-1 max-w-xl ">
              <SearchBar
                onSearch={handleSearch}
                variant="compact"
                className="w-full rounded-2xl"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  border: "0.5px solid rgba(0,0,0,0.2)",
                  color: "#ffffff",
                }}
              />
            </div>
          )}

          {/* Sign in pill */}
          <div
            className="ml-auto shrink-0 text-xs text-white cursor-pointer max-lg:hidden sm:block"
            style={{
              background: "rgba(0,0,0,0.2)",
              border: "0.5px solid rgba(255,255,255,0.2)",
              padding: "6px 14px",
              borderRadius: "6px",
            }}
          >
            Sign in
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {!hasSearched ? (
            /* ── Landing ── */
            <motion.div
              key="landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex min-h-[80vh] flex-col items-center justify-center gap-6 sm:gap-8 px-2"
            >
              <LandingHero />
              <SearchBar
                onSearch={handleSearch}
                variant="landing"
                className="w-full max-w-xl sm:max-w-2xl"
              />
            </motion.div>
          ) : (
            /* ── Results ── */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4 sm:space-y-6"
            >
              {isSearching ? (
                <SearchSkeleton />
              ) : selectedVideo ? (
                <>
                  {/* ── Main grid: stacked on mobile, side-by-side on desktop ── */}
                  <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-5">

                    {/* Left — Video player */}
                    <div className="space-y-4 sm:space-y-6 lg:col-span-3">
                      <VideoPlayer video={selectedVideo} />

                      {/* AI panel — shows BELOW video on mobile, hidden here on desktop */}
                      <div className="block lg:hidden">
                        <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                          <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <TabsList className="bg-secondary">
                                <TabsTrigger
                                  value="summary"
                                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
                                >
                                  🧠 Summary
                                </TabsTrigger>
                                <TabsTrigger
                                  value="chat"
                                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
                                >
                                  💬 Ask AI
                                </TabsTrigger>
                              </TabsList>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleShare}
                                className="h-8 w-8"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <TabsContent value="summary">
                              <SummaryPanel
                                summary={summary}
                                isLoading={isLoadingSummary}
                                transcript={transcript}
                                onRegenerate={async () => {
                                  if (!selectedVideo) return
                                  setIsLoadingSummary(true)
                                  setSummary(null)
                                  await loadTranscriptAndSummary(
                                    selectedVideo.id,
                                    selectedVideo.title
                                  )
                                  setIsLoadingSummary(false)
                                }}
                              />
                            </TabsContent>
                            <TabsContent value="chat">
                              <ChatPanel
                                messages={chatMessages}
                                isStreaming={isChatStreaming}
                                onSendMessage={handleSendMessage}
                                hasTranscript={!!transcript}
                              />
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>

                      {/* Alternative videos */}
                      <AlternativeVideos
                        videos={videos}
                        selectedId={selectedVideo.id}
                        onSelect={handleSelectVideo}
                      />
                    </div>

                    {/* Right — AI panel (desktop only) */}
                    <div className="sm:hidden md:hidden max-sm:hidden  lg:block lg:col-span-2">
                      <div className="sticky top-20 rounded-xl border border-border bg-card p-4">
                        <Tabs
                          value={activeTab}
                          onValueChange={setActiveTab}
                          className="w-full"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <TabsList className="bg-secondary">
                              <TabsTrigger
                                value="summary"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
                              >
                                🧠 Summary
                              </TabsTrigger>
                              <TabsTrigger
                                value="chat"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
                              >
                                💬 Ask AI
                              </TabsTrigger>
                            </TabsList>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={handleShare}
                              className="h-8 w-8"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <TabsContent value="summary">
                            <SummaryPanel
                              summary={summary}
                              isLoading={isLoadingSummary}
                              transcript={transcript}
                              onRegenerate={async () => {
                                if (!selectedVideo) return
                                setIsLoadingSummary(true)
                                setSummary(null)
                                await loadTranscriptAndSummary(
                                  selectedVideo.id,
                                  selectedVideo.title
                                )
                                setIsLoadingSummary(false)
                              }}
                            />
                          </TabsContent>
                          <TabsContent value="chat">
                            <ChatPanel
                              messages={chatMessages}
                              isStreaming={isChatStreaming}
                              onSendMessage={handleSendMessage}
                              hasTranscript={!!transcript}
                            />
                          </TabsContent>
                        </Tabs>
                      </div>
                    </div>

                  </div>
                </>
              ) : (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg">No videos found. Try a different search term.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}