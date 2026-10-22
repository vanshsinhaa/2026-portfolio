import type React from "react";
import moodboard from "@/data/moodboard.json";

// Gallery view: a moodboard of pins curated from Pinterest.
// Rendered on the server as static markup on purpose — public/scripts/index.js
// collects the .gallery__item nodes at load, lays them out as masonry columns,
// and lazy-loads each <img>/<video> from data-src when the gallery opens.

type Item = {
  slug: string;
  kind: string;
  alt: string;
  aspect: number;
  image: string;
  video?: string;
};

const CID = { "data-scope-main": "" };

function Tile({ item }: { item: Item }) {
  const style = { "--item-aspect": String(item.aspect) } as React.CSSProperties;
  return (
    <figure
      className="gallery__item moodboard-item"
      data-aspect={item.aspect}
      style={style}
      {...CID}
    >
      {item.video ? (
        <video
          data-src={item.video}
          data-gallery-video=""
          aria-label={item.alt}
          muted
          loop
          playsInline
          preload="auto"
          {...CID}
        />
      ) : (
        <img data-src={item.image} alt={item.alt} decoding="async" {...CID} />
      )}
    </figure>
  );
}

export function MoodboardGallery() {
  return (
    <>
      <header className="moodboard-head" {...CID}>
        <h2 className="moodboard-title">Moodboard</h2>
        <p className="moodboard-lede">
          Pinned on{" "}
          <a
            className="pinterest-word"
            href="https://www.pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="pinterest-logo" src="/images/pinterest_logo.svg" alt="" aria-hidden="true" />
            Pinterest
          </a>
          ,
          <br />
          the side of me that isn&rsquo;t code.
        </p>
      </header>
      <section className="gallery" id="gallery" aria-label="Moodboard" {...CID}>
        {(moodboard.items as Item[]).map((item) => (
          <Tile key={item.slug} item={item} />
        ))}
      </section>
    </>
  );
}
