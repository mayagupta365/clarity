import type { Metadata } from "next";
import "../styles.css";
import "../index.css";

export const metadata: Metadata = {
  title: "ClarityTube — Smart YouTube Video Finder",
  description: "AI-powered YouTube video finder with smart scoring, summaries, and educational chatbot.",
  openGraph: {
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}