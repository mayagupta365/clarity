import { Zap, Brain, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export function LandingHero() {
  return (
    <div className="relative flex flex-col items-center text-center space-y-6">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-black tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Clarity<span className="text-primary">Tube</span>
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg text-muted-foreground max-w-md md:text-xl"
      >
        Find the best video, not just the most viewed
      </motion.p>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 gap-4 pt-8 md:grid-cols-3 w-full max-w-2xl"
      >
        <FeatureCard
          icon={<Zap className="h-6 w-6 text-score-mid" />}
          title="Smart Scoring"
          description="Ranked by quality, not just views"
        />
        <FeatureCard
          icon={<Brain className="h-6 w-6 text-primary" />}
          title="AI Summaries"
          description="Understand any video in 30 seconds"
        />
        <FeatureCard
          icon={<MessageSquare className="h-6 w-6 text-score-high" />}
          title="Ask the Video"
          description="Chat with an AI tutor about the content"
        />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 p-5 backdrop-blur-sm">
      {icon}
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
