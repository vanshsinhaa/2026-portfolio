import type React from "react";

// A small 3D folder that sits before a section title. Hovering the section
// tips the front flap open and slides the papers up (pure CSS, see
// .folder3d in globals.css). `accent` tints the front sheet.
export function Folder3D({ accent = "#9aa0ff" }: { accent?: string }) {
  return (
    <span
      className="folder3d"
      aria-hidden="true"
      style={{ "--folder-accent": accent } as React.CSSProperties}
    >
      <span className="folder3d__back" />
      <span className="folder3d__paper" />
      <span className="folder3d__paper" />
      <span className="folder3d__paper" />
      <span className="folder3d__front" />
    </span>
  );
}
