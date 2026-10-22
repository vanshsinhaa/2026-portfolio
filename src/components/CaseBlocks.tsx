import type React from "react";

// Server-rendered case-study body. Mirrors the block renderer the old case
// modal used (public/scripts/index.js), so the same projects.json blocks and
// the same .case__* styles work on the standalone project pages.

export type Block = {
  type: string;
  src?: string;
  title?: string;
  aspect?: number;
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  images?: string[];
  layout?: string;
  columns?: number | Column[];
  side?: string;
  sectionBelow?: boolean;
};
type Column = { heading?: string; paragraphs?: string[]; bullets?: string[] };

const isVideo = (src: string) => /\.(mp4|webm)(\?|$)/i.test(src);
const html = (s: string) => ({ __html: s });

function TextBody({ b }: { b: Column }) {
  return (
    <>
      {b.heading && <h4 className="case__heading" dangerouslySetInnerHTML={html(b.heading)} />}
      {(b.paragraphs || []).map((p, i) => (
        <p key={i} dangerouslySetInnerHTML={html(p)} />
      ))}
      {b.bullets?.length ? (
        <ul className="case__bullets">
          {b.bullets.map((li, i) => (
            <li key={i} dangerouslySetInnerHTML={html(li)} />
          ))}
        </ul>
      ) : null}
    </>
  );
}

function Media({ src }: { src: string }) {
  return isVideo(src) ? <video src={src} loop muted playsInline autoPlay preload="metadata" /> : <img src={src} alt="" loading="lazy" />;
}

function renderBlock(b: Block, section: boolean, key: number): React.ReactNode {
  const sec = section ? " case__section" : "";
  switch (b.type) {
    case "video":
    case "image":
      return (
        <figure key={key} className={"case__fig" + sec}>
          <Media src={b.src || ""} />
        </figure>
      );
    case "embed":
      return (
        <figure key={key} className={"case__fig case__embed" + sec}>
          <iframe src={b.src} title={b.title || ""} loading="lazy" scrolling="no" style={{ aspectRatio: String(b.aspect || 1.4) }} suppressHydrationWarning />
        </figure>
      );
    case "gallery": {
      const cols = typeof b.columns === "number" ? b.columns : b.layout === "grid" ? 1 : 2;
      return (
        <div key={key} className={"case__grid-imgs" + sec} style={{ "--cols": cols } as React.CSSProperties}>
          {(b.images || []).map((src, i) => (
            <Media key={i} src={src} />
          ))}
        </div>
      );
    }
    case "figrow": {
      const media = (
        <figure className="case__figrow-media">
          <img src={b.src} alt="" loading="lazy" />
        </figure>
      );
      const text = (
        <div className="case__figrow-text">
          <TextBody b={b as Column} />
        </div>
      );
      return (
        <div key={key} className={"case__figrow" + sec}>
          {b.side === "left" ? (
            <>
              {media}
              {text}
            </>
          ) : (
            <>
              {text}
              {media}
            </>
          )}
        </div>
      );
    }
    case "text2col":
      return (
        <div key={key} className="case__text2col">
          {((b.columns as Column[]) || []).map((c, i) => (
            <div key={i} className="case__text2col-col">
              <TextBody b={c} />
            </div>
          ))}
        </div>
      );
    default:
      return (
        <div key={key} className="case__text">
          <TextBody b={b as Column} />
        </div>
      );
  }
}

// Same spacing rules as the modal: a media block gets extra space above it
// when it follows text (except the first media block), or when the previous
// block asked for `sectionBelow`.
export function CaseBlocks({ blocks }: { blocks: Block[] }) {
  const out: React.ReactNode[] = [];
  let prev: string | null = null;
  let seenMedia = false;
  let prevSectionBelow = false;
  blocks.forEach((b, i) => {
    const media = ["image", "video", "gallery", "figrow", "embed"].includes(b.type);
    let section = false;
    if (media) {
      if (seenMedia) section = prev === "text";
      else seenMedia = true;
    }
    if (prevSectionBelow) section = true;
    prevSectionBelow = !!b.sectionBelow;
    prev = ["image", "video", "gallery"].includes(b.type) ? b.type : "text";
    out.push(renderBlock(b, section, i * 2));
    if (i === 0) out.push(<hr key={i * 2 + 1} className="case__rule" />);
  });
  return <>{out}</>;
}
