"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resolveImageUrl, type HeroDto } from "@/lib/hero";

interface VideoCaption {
  start: number;
  end: number;
  text: string;
}

const VIDEO_CAPTIONS: VideoCaption[] = [
  { start: 0, end: 10, text: "AI automates enterprise tax work" },
  { start: 10, end: 20, text: "Business spatial analytics" },
  { start: 20, end: 30, text: "Machine learning fraud detection" },
  { start: 30, end: 40, text: "SaaS cross-platform development" },
  { start: 40, end: 50, text: "AI in regulatory compliance" },
  { start: 50, end: 60, text: "Ethical AI for children" },
  { start: 60, end: 70, text: "Smart city IoT" },
  { start: 70, end: 80, text: "Purchase order automation" },
  { start: 80, end: 90, text: "Big data analytics platform" },
  { start: 90, end: 100, text: "Music app for African market" },
  { start: 100, end: 110, text: "AI automates clinical encounters" },
  { start: 110, end: 120, text: "Smart sensor agriculture" },
  { start: 120, end: 130, text: "Drone flying over farmland" },
  { start: 130, end: 140, text: "AI in furniture manufacturing" },
];

function getCaptionForTime(t: number): string | null {
  const match = VIDEO_CAPTIONS.find((c) => t >= c.start && t < c.end);
  return match ? match.text : null;
}

function VideoCaptionOverlay({ text }: { text: string | null }) {
  return (
    <div className="pointer-events-none absolute bottom-6 left-4 z-[5] w-[70%] max-w-[16rem] overflow-hidden sm:bottom-10 sm:left-6 sm:max-w-xs md:bottom-12 md:left-8 md:max-w-sm lg:bottom-14 lg:left-10 lg:max-w-md xl:bottom-16 xl:left-12 xl:max-w-lg">
      {text && (
        <div key={text} className="hero-caption-in flex items-start gap-2.5 sm:gap-3">
          <span className="mt-2 h-[2px] w-4 shrink-0 bg-ember sm:mt-2.5 sm:w-5 md:mt-3 md:w-6" />
          <p className="font-display text-lg font-semibold leading-tight tracking-tight text-paper drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            {text}
          </p>
        </div>
      )}
    </div>
  );
}

export default function HeroView({ hero }: { hero: HeroDto }) {
  const [activeCaption, setActiveCaption] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setActiveCaption(getCaptionForTime(video.currentTime));
  };

  const backgroundSrc = hero.backgroundImageUrl ? resolveImageUrl(hero.backgroundImageUrl) : "";
  const videoSrc = hero.backgroundVideoUrl ? resolveImageUrl(hero.backgroundVideoUrl) : "";

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div className="relative h-[280px] w-full overflow-hidden sm:absolute sm:inset-0 sm:h-auto">
        {videoSrc ? (
          <video
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={videoSrc} />
          </video>
        ) : backgroundSrc ? (
          <Image
            src={backgroundSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--color-wire) 1px, transparent 1px), linear-gradient(to bottom, var(--color-wire) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-signal/25 blur-[120px] animate-ambient-drift" />
            <div className="absolute -bottom-40 right-[-10%] h-[480px] w-[480px] rounded-full bg-ember/20 blur-[140px] animate-ambient-drift" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        {videoSrc ? <VideoCaptionOverlay text={activeCaption} /> : null}
      </div>

      <div className="relative mx-auto flex w-full flex-col gap-6 bg-ink px-4 pb-8 pt-6 sm:min-h-[520px] sm:max-w-6xl sm:flex-row sm:items-end sm:justify-end sm:gap-8 sm:bg-transparent sm:px-6 sm:pb-10 sm:pt-8 md:min-h-[600px] md:px-8 md:pb-12 md:pt-10 lg:min-h-[680px] lg:px-10 lg:pb-14 lg:pt-12 xl:min-h-[760px]">
        <div className="hero-card-rise relative w-full overflow-hidden rounded-none bg-paper p-4 shadow-none sm:max-w-lg sm:rounded-lg sm:p-6 sm:shadow-[0_24px_60px_-20px_rgba(14,20,32,0.55)] md:max-w-xl md:p-8 lg:max-w-2xl lg:rounded-xl lg:p-10">
          <h1 className="hero-h1-rise mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {hero.title}
          </h1>

          <p
            className="hero-fade-rise mt-5 text-base leading-relaxed text-graphite/80 sm:text-lg"
            style={{ animationDelay: "0.28s" }}
          >
            {hero.subtitle}
          </p>

          <div
            className="hero-fade-rise mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href={hero.primaryCtaUrl}
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-ember px-6 py-3.5 font-mono text-sm font-medium text-paper shadow-[0_8px_30px_-8px_rgba(255,107,53,0.55)] transition-all duration-200 hover:-translate-y-[3px] hover:bg-ember/90 hover:shadow-[0_12px_36px_-8px_rgba(255,107,53,0.65)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {hero.primaryCtaText}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={hero.secondaryCtaUrl}
              className="inline-flex items-center justify-center rounded-sm border border-ink/20 px-6 py-3.5 font-mono text-sm text-ink/80 transition-all duration-200 hover:-translate-y-[3px] hover:border-ink/40 hover:text-ink active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-paper motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {hero.secondaryCtaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
