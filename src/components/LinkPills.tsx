// Rounded link pills for the About panel, styled like the 3D section folders:
// a soft gray body with a top highlight, and a brand-coloured disc for each link.

const ICONS = {
  resume: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path fill="#d9d6cc" d="M14 2v5h5Z" />
      <rect x="6.2" y="12.4" width="11.6" height="5.6" rx="1" fill="#e5484d" />
      <text x="12" y="16.75" textAnchor="middle" fontSize="4.4" fontWeight="700" fill="#fff" fontFamily="ui-monospace, Menlo, monospace">PDF</text>
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#fff" d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3Z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="5" width="19" height="14" rx="2.2" fill="#fff" />
      <path d="m3.4 6.2 8.6 6.6 8.6-6.6" fill="none" stroke="#e5484d" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
};

const PILLS = [
  { key: "resume", label: "Resume", href: "/resume/resume.pdf", external: true },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/vanshsinha/", external: true },
  { key: "github", label: "GitHub", href: "https://github.com/vanshsinhaa", external: true },
  { key: "email", label: "Email", href: "mailto:vanshsinhaacademics@gmail.com", title: "vanshsinhaacademics@gmail.com" },
] as const;

export function LinkPills() {
  return (
    <div className="link-pills">
      {PILLS.map((p) => (
        <a
          key={p.key}
          className={`link-pill link-pill--${p.key}`}
          href={p.href}
          title={"title" in p ? p.title : undefined}
          {...("external" in p ? { target: "_blank", rel: "noopener" } : {})}
        >
          <span className="link-pill__icon">{ICONS[p.key]}</span>
          <span className="link-pill__label">{p.label}</span>
          <span className="link-pill__arrow" aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
