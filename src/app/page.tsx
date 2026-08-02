import { MainIndex } from "@/components/MainIndex";
import { FloatingDock } from "@/components/FloatingDock";
import { BioOverlay } from "@/components/BioOverlay";
import { ArticleOverlay } from "@/components/ArticleOverlay";
import { CaseModal } from "@/components/CaseModal";
import { SiteFooter } from "@/components/SiteFooter";
import { BehaviorScripts } from "@/components/BehaviorScripts";
import projects from "@/data/projects.json";

// Scramble loader percentage, then reveal the page.
const loaderScript = `
(function () {
  var screen = document.getElementById("loading-screen");
  var el = document.getElementById("loader-percentage");
  if (!screen || !el) return;
  var chars = "!<>-_\\\\/[]{}\\u2014=+*^?#%&@0123456789";
  var pct = 0, done = false;
  var rnd = function () { return chars[(Math.random() * chars.length) | 0]; };
  function finish() {
    if (done) return; done = true;
    el.textContent = "100%";
    screen.classList.add("is-done");
    document.documentElement.classList.add("loaded");
    setTimeout(function () { screen.style.display = "none"; }, 500);
  }
  var iv = setInterval(function () {
    if (pct < 98) {
      pct += 2;
      el.textContent = pct <= 80 ? rnd() + rnd() + rnd() : pct + "%";
    } else clearInterval(iv);
  }, 7);
  window.addEventListener("load", function () { setTimeout(finish, 400); });
  setTimeout(finish, 1200);
})();
`;

// Deep-link: ?view=gallery opens the gallery straight away (no index flash).
const galleryDeepLink = `
try { if (new URLSearchParams(location.search).get("view") === "gallery") document.documentElement.classList.add("gallery-mode"); } catch (e) {}
`;

export default function Home() {
  return (
    <>
      <div
        id="loading-screen"
        aria-hidden="true"
        data-scope-loader=""
        suppressHydrationWarning
      >
        <div
          id="loader-percentage"
          data-scope-loader=""
          suppressHydrationWarning
        >
          0%
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
      <script dangerouslySetInnerHTML={{ __html: galleryDeepLink }} />
      <div className="page-field" aria-hidden="true" data-scope-main="" />
      <div
        className="col-handle col-handle--left"
        data-resize="left"
        aria-hidden="true"
        data-scope-main=""
      >
        <span className="col-handle__grip" data-scope-main="" />
      </div>
      <div
        className="col-handle col-handle--right"
        data-resize="right"
        aria-hidden="true"
        data-scope-main=""
      >
        <span className="col-handle__grip" data-scope-main="" />
      </div>
      <MainIndex />
      <div className="filter-scrim" aria-hidden="true" data-scope-main="" />
      <FloatingDock />
      <script
        id="projects-data"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projects) }}
      />
      <BioOverlay />
      <ArticleOverlay />
      <CaseModal />
      <SiteFooter />
      <BehaviorScripts />
    </>
  );
}
