export function initDocsUi() {
  const toggle = document.getElementById("theme-toggle");
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }
  toggle?.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || "dark";
    setTheme(cur === "dark" ? "light" : "dark");
  });

  /* menú móvil */
  const menuBtn = document.getElementById("menu-btn");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebar-backdrop");
  const closeMenu = () => {
    sidebar?.classList.remove("open");
    backdrop?.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  };
  menuBtn?.addEventListener("click", () => {
    const open = sidebar?.classList.toggle("open");
    backdrop?.classList.toggle("open", !!open);
    menuBtn.setAttribute("aria-expanded", String(!!open));
  });
  backdrop?.addEventListener("click", closeMenu);
  sidebar?.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.closest("a") && window.innerWidth <= 900) closeMenu();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* búsqueda por títulos de la sidebar */
  const input = document.getElementById("search");
  const results = document.getElementById("search-results");
  const navLinks = Array.from(document.querySelectorAll("#nav a")).map((a) => ({
    title: a.textContent?.trim() ?? "",
    href: a.getAttribute("href") ?? "/",
  }));
  input?.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q || !results) {
      if (results) results.hidden = true;
      return;
    }
    const matches = navLinks.filter((it) => it.title.toLowerCase().includes(q)).slice(0, 8);
    results.innerHTML = matches.length
      ? matches
          .map((it) => {
            const safe = it.title.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>");
            return `<a href="${it.href}">${safe}</a>`;
          })
          .join("")
      : '<div class="no-results">Sin resultados</div>';
    results.hidden = false;
  });
  results?.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.closest("a") && input) {
      input.value = "";
      results.hidden = true;
    }
  });
  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    if (!e.target.closest(".search-box") && results) results.hidden = true;
  });
}

/* auto-init */
if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initDocsUi);
}
