import { createRequire } from "node:module";
const WebSocket = createRequire(import.meta.url)("ws");
import { spawn } from "node:child_process";
import http from "node:http";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BASE = "http://localhost:4177";

function jsonGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let d = "";
      res.on("data", (c) => (d += c));
      res.on("end", () => resolve(JSON.parse(d)));
    }).on("error", reject);
  });
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener("message", (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function connectPage(width, height) {
  const chrome = spawn("/usr/bin/google-chrome-stable", [
    "--headless", "--disable-gpu", "--no-sandbox",
    `--window-size=${width},${height}`, "--remote-debugging-port=9222", "about:blank",
  ], { stdio: "ignore" });
  await sleep(1800);
  const list = await jsonGet("http://127.0.0.1:9222/json/list");
  const page = list.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.on("open", r));
  const cdp = new CDP(ws);
  await cdp.send("Page.enable");
  const ev = async (expr, awaitPromise = true) =>
    (await cdp.send("Runtime.evaluate", { expression: expr, awaitPromise, returnByValue: true })).result.value;
  return { chrome, cdp, ev };
}

/* ---------- ESCRITORIO ---------- */
{
  const { chrome, cdp, ev } = await connectPage(1440, 900);
  try {
    await cdp.send("Page.navigate", { url: `${BASE}/docs/pulsar-os/seguridad-y-privacidad/` });
    await sleep(1400);

    /* topbar desktop: hamburguesa y close-btn NO visibles */
    const visibility = await ev(`(function(){
      const mb = document.getElementById('menu-btn');
      const cb = document.getElementById('sidebar-close');
      const vis = (el) => el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
      return JSON.stringify({ menu: vis(mb), close: vis(cb) });
    })()`);
    console.log("DESKTOP hamburguesa/cierres visibles:", visibility);

    /* tema */
    const t1 = await ev(`document.documentElement.dataset.theme`);
    await ev(`document.getElementById('theme-toggle').click(); 1`);
    await sleep(150);
    const t2 = await ev(`document.documentElement.dataset.theme`);
    await ev(`document.getElementById('theme-toggle').click(); 1`);
    await sleep(150);
    console.log("DESKTOP tema:", t1, "→", t2, "→ de vuelta:", await ev(`document.documentElement.dataset.theme`));

    /* enlaces de la sidebar: clic real en 'Mac Edition' */
    await ev(`(function(){
      const a = [...document.querySelectorAll('#nav a')].find(x => x.textContent.trim() === 'Mac Edition');
      a.click(); 1;
    })()`);
    await sleep(700);
    const nav = await ev(`location.pathname`);
    console.log("DESKTOP clic sidebar 'Mac Edition' →", nav);

    /* búsqueda con overlay */
    await ev(`document.getElementById('search').click(); 1`);
    await sleep(250);
    const ov = await ev(`document.getElementById('search-overlay').classList.contains('open')`);
    await ev(`
      (function(){
        const i = document.getElementById('search-overlay-input');
        i.value = 'vpn';
        i.dispatchEvent(new Event('input', { bubbles: true }));
      })(); 1
    `);
    await sleep(800);
    const res = await ev(`(function(){
      const r = document.getElementById('search-results');
      const links = [...r.querySelectorAll('a')].slice(0,3).map(a => ({ h: a.getAttribute('href'), t: a.querySelector('.sr-title')?.textContent.trim() }));
      return JSON.stringify({ open: document.getElementById('search-overlay').classList.contains('open'), visible: !r.hidden, links });
    })()`);
    const r = JSON.parse(res);
    console.log("DESKTOP overlay abierto:", r.open, "| resultados:", r.visible);
    r.links.forEach((l) => console.log("   -", l.t, "→", l.h));

    /* cerrar overlay con Escape */
    await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
    await sleep(200);
    console.log("DESKTOP overlay cerrado con Esc:", await ev(`!document.getElementById('search-overlay').classList.contains('open')`));
  } finally {
    chrome.kill();
  }
}

/* ---------- MÓVIL ---------- */
{
  const { chrome, cdp, ev } = await connectPage(390, 844);
  try {
    await cdp.send("Page.navigate", { url: `${BASE}/docs/pulsar-os/` });
    await sleep(1400);
    const info = await ev(`(function(){
      const vis = (id) => { const el = document.getElementById(id); if (!el) return false; const cs = getComputedStyle(el); return cs.display !== 'none' && el.getBoundingClientRect().width > 0; };
      return JSON.stringify({ w: innerWidth, menuVisible: vis('menu-btn'), closeVisible: vis('sidebar-close') });
    })()`);
    const i = JSON.parse(info);
    console.log("MOBILE", i.w + "px", "| menú visible:", i.menuVisible, "| X visible:", i.closeVisible);

    await ev(`document.getElementById('menu-btn').click(); 1`);
    await sleep(400);
    const s1 = await ev(`document.getElementById('sidebar').classList.contains('open')`);
    await ev(`document.getElementById('sidebar-close').click(); 1`);
    await sleep(300);
    const s2 = await ev(`!document.getElementById('sidebar').classList.contains('open')`);
    console.log("MOBILE menu abre:", s1, "| X cierra:", s2);
  } finally {
    chrome.kill();
  }
}
