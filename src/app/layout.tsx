import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vansh Sinha",
  description:
    "Student studying CS at ASU — building across full stack and infra.",
  openGraph: {
    type: "website",
    siteName: "Vansh Sinha",
    title: "Vansh Sinha",
    description:
      "Student studying CS at ASU — building across full stack and infra.",
    images: ["/gallery/mesh-1.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vansh Sinha",
    description:
      "Student studying CS at ASU — building across full stack and infra.",
    images: ["/gallery/mesh-1.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#131313" },
  ],
};

// Runs before paint: theme selection, scroll restoration, dragged column width.
const themeInit = `
(function () {
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
  var isMobile = false, sysDark = false;
  try { isMobile = window.matchMedia("(max-width: 820px)").matches; } catch (e) {}
  try { sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) {}
  var theme = isMobile ? (sysDark ? "dark" : "light") : "dark";
  try {
    var stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") theme = stored;
  } catch (e) {}
  document.documentElement.setAttribute("data-theme", theme);
  try {
    const cw = parseFloat(localStorage.getItem("container-w"));
    if (cw && cw >= 700) {
      document.documentElement.style.setProperty("--container-w", Math.min(cw, window.innerWidth) + "px");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300..500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
