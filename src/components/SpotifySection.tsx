"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import type { SpotifyTrackCard } from "@/lib/spotify";

const REFRESH_MS = 60_000;
const SKELETON_COUNT = 8;

const SQUARE = { "--item-aspect": "1" } as React.CSSProperties;
const CID = { "data-scope-main": "" };

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always", style: "narrow" });
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return rtf.format(-Math.max(mins, 1), "minute");
  const hours = Math.round(mins / 60);
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-Math.round(hours / 24), "day");
}

function TrackCard({ track }: { track: SpotifyTrackCard }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <a className="spotify-card" href={track.url} target="_blank" rel="noopener noreferrer">
      <figure
        className={`gallery__item${loaded ? " is-loaded" : ""}`}
        style={SQUARE}
        {...CID}
      >
        <img
          src={track.albumArt}
          alt={`${track.title} — ${track.artist}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          {...CID}
        />
      </figure>
      <div className="spotify-card__meta">
        <span className="spotify-card__title">{track.title}</span>
        <span className="spotify-card__artist">{track.artist}</span>
        <span className="spotify-card__time">
          {track.nowPlaying ? (
            <>
              <span className="spotify-eq" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              Now playing
            </>
          ) : (
            relativeTime(track.playedAt)
          )}
        </span>
      </div>
    </a>
  );
}

export function SpotifySection() {
  const [tracks, setTracks] = useState<SpotifyTrackCard[] | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Green glow while the section is in the viewport (hover handled in CSS).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle("is-inview", entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [tracks !== null && tracks.length === 0]);

  useEffect(() => {
    let alive = true;
    let hasData = false;
    const load = () =>
      fetch("/api/spotify/recently-played")
        .then((r) => r.json())
        .then((d: { tracks: SpotifyTrackCard[] }) => {
          if (!alive) return;
          // Keep previous data on transient empty responses after first load.
          if (d.tracks.length > 0 || !hasData) setTracks(d.tracks);
          hasData = hasData || d.tracks.length > 0;
        })
        .catch(() => {
          if (alive && !hasData) setTracks([]);
        });
    load();
    const iv = setInterval(load, REFRESH_MS);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      alive = false;
      clearInterval(iv);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Loaded and genuinely empty (no env vars / no history): hide the section.
  if (tracks !== null && tracks.length === 0) return null;

  return (
    <section className="section" id="listening" ref={sectionRef} {...CID}>
      <h2 className="fit section__title" {...CID}>
        <img
          className="title-folder"
          src="/folder-icon.png"
          width="200"
          height="170"
          alt=""
          aria-hidden="true"
          {...CID}
        />
        Listening
      </h2>
      <p className="fit section__lede" {...CID}>
        <span className="lede-dim" {...CID}>
          Recently played on{" "}
          <span className="spotify-word">
            <img className="spotify-logo" src="/images/spotify_logo.svg" alt="" aria-hidden="true" />
            Spotify
          </span>
          ,
          <br {...CID} />
          straight from the source.
        </span>
      </p>
      <div className="spotify-grid">
        {tracks === null
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <div className="spotify-card" key={i} aria-hidden="true">
                <figure className="gallery__item" style={SQUARE} {...CID} />
              </div>
            ))
          : tracks.map((t) => <TrackCard key={t.id} track={t} />)}
      </div>
    </section>
  );
}
