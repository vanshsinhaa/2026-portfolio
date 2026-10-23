// Grey-to-white reading sweep. The big type starts dim and brightens word by
// word: the hero once the loading screen is gone, section titles and ledes as
// they scroll into view. Each word briefly flashes to full strength, then
// settles to its normal colour (so the grey/white contrast of the design stays).
// Skipped entirely for reduced motion; if this never runs, the text is simply
// shown as normal.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const SELECTOR = ".hero__statement, .section__title, .section__lede, .moodboard-title, .moodboard-lede";
  const STEP = 38; // ms between words
  const WORD = 900; // ms for one word's sweep

  function split(el) {
    if (el.classList.contains("words")) return;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let i = 0;
    for (const node of nodes) {
      const color = getComputedStyle(node.parentElement).color; // where the word settles
      const frag = document.createDocumentFragment();
      for (const part of node.textContent.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); continue; }
        const w = document.createElement("span");
        w.className = "w";
        w.textContent = part;
        w.style.setProperty("--i", String(i++));
        w.style.setProperty("--c", color);
        frag.appendChild(w);
      }
      node.replaceWith(frag);
    }
    el.style.setProperty("--words", String(i));
    el.classList.add("words");
  }

  function play(el) {
    if (el.classList.contains("words-in") || el.classList.contains("words-done")) return;
    el.classList.add("words-in");
    const total = (parseInt(el.style.getPropertyValue("--words") || "0", 10) - 1) * STEP + WORD;
    setTimeout(() => {
      el.classList.remove("words-in");
      el.classList.add("words-done");
    }, total + 50);
  }

  const els = [...document.querySelectorAll(SELECTOR)];
  els.forEach(split);

  // the hero waits for the loading screen to finish
  const hero = document.querySelector(".hero__statement");
  const root = document.documentElement;
  const startHero = () => hero && setTimeout(() => play(hero), 120);
  if (root.classList.contains("loaded")) startHero();
  else new MutationObserver((_, mo) => { if (root.classList.contains("loaded")) { mo.disconnect(); startHero(); } }).observe(root, { attributes: true, attributeFilter: ["class"] });

  // everything else plays the first time it scrolls into view
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { play(e.target); io.unobserve(e.target); }
  }, { threshold: 0.35 });
  els.filter((el) => el !== hero).forEach((el) => io.observe(el));
})();
