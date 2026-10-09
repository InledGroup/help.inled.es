/* Inled Docs — UI: theme, mobile menu (X + backdrop), full-text search overlay */
export function initDocsUi() {
  /* ---------- theme ---------- */
  const toggle = document.getElementById("theme-toggle");
  const setTheme = (t) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("theme", t);
    } catch {}
  };
  toggle?.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || "dark";
    setTheme(cur === "dark" ? "light" : "dark");
  });

  /* ---------- mobile menu: open via hamburger, close via X / backdrop / Escape ---------- */
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("sidebar-close");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const setMenu = (open) => {
    if (!sidebar) return;
    sidebar.classList.toggle("open", open);
    backdrop?.classList.toggle("open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open && window.innerWidth <= 900 ? "hidden" : "";
  };
  menuBtn?.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
  closeBtn?.addEventListener("click", () => setMenu(false));
  backdrop?.addEventListener("click", () => setMenu(false));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setMenu(false);
      closeSearch();
    }
  });
  sidebar?.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.closest("a") && window.innerWidth <= 900) setMenu(false);
  });

  /* ---------- full-text search with centered overlay ---------- */
  const trigger = document.getElementById("search");
  const overlay = document.getElementById("search-overlay");
  const overlayInput = document.getElementById("search-overlay-input");
  const results = document.getElementById("search-results");
  const closeBtnOverlay = document.getElementById("search-overlay-close");

  function openSearch() {
    if (!overlay) return;
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => overlayInput?.focus(), 30);
  }
  function closeSearch() {
    if (!overlay) return;
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    if (overlayInput) overlayInput.value = "";
    if (results) {
      results.hidden = true;
      results.innerHTML = "";
    }
  }
  trigger?.addEventListener("click", openSearch);
  trigger?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openSearch();
    }
  });
  closeBtnOverlay?.addEventListener("click", closeSearch);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  let INDEX = null;
  const loadIndex = () =>
    INDEX ??
    (INDEX = fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []));
  loadIndex(); // warm up

  const escHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const snippet = (text, q, radius = 80) => {
    const i = text.indexOf(q);
    if (i === -1) return "";
    const start = Math.max(0, i - radius);
    const end = Math.min(text.length, i + q.length + radius);
    return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
  };
  const highlight = (safe, q) =>
    safe.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), (m) => `<mark>${m}</mark>`);

  overlayInput?.addEventListener("input", async () => {
    const q = overlayInput.value.trim().toLowerCase();
    if (!q || !results) {
      if (results) results.hidden = true;
      return;
    }
    const idx = await loadIndex();
    if (!idx.length && results) {
      results.innerHTML = '<div class="no-results">Index not available.</div>';
      results.hidden = false;
      return;
    }
    const terms = q.split(/\s+/).filter(Boolean);
    const matches = idx
      .map((e) => {
        const title = (e.title || "").toLowerCase();
        const section = (e.section || "").toLowerCase();
        const text = (e.text || "").toLowerCase();
        let score = 0;
        for (const t of terms) {
          if (title.includes(t)) score += 4;
          if (section.includes(t)) score += 2;
          if (text.includes(t)) score += 1;
        }
        return { ...e, score };
      })
      .filter((e) => e.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    if (!results) return;
    results.innerHTML = matches.length
      ? matches
          .map((m) => {
            const label = m.section ? `${m.section} · ${m.title}` : m.title;
            const safeLabel = highlight(escHtml(label), q);
            const sn = snippet(m.text || "", terms[0]);
            return `<a href="${m.href}"><span class="sr-title">${safeLabel}</span>${sn ? `<span class="sr-snip">${escHtml(sn)}</span>` : ""}</a>`;
          })
          .join("")
      : '<div class="no-results">No results found.</div>';
    results.hidden = false;
  });

  results?.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.closest("a")) closeSearch();
  });

  /* ---------- copy buttons on code blocks ---------- */
  const COPY_LABEL = "Copy";
  const COPIED_LABEL = "Copied";
  document.querySelectorAll(".prose pre, .ai-step pre").forEach((pre) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy-btn";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.textContent = COPY_LABEL;
    btn.addEventListener("click", async () => {
      const text = pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
      try {
        await navigator.clipboard.writeText(text.trim());
      } catch {
        // fallback sin clipboard API (http no seguro)
        const ta = document.createElement("textarea");
        ta.value = text.trim();
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      btn.textContent = COPIED_LABEL;
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = COPY_LABEL;
        btn.classList.remove("copied");
      }, 1400);
    });
    pre.style.position = "relative";
    pre.appendChild(btn);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDocsUi);
  } else {
    initDocsUi();
  }
}
