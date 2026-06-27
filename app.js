/* ================= Gobblr app ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const byId = (id) => TURKEYS.find((t) => t.id === id) || (id === "me" ? ME : null);

const state = {
  tab: "browse",
  gobbled: new Set(),        // turkeys you've gobbled
  filter: { online: false, dist: 50, tribes: new Set() },
  search: "",
  sheetProfile: null,
  sheetIdx: 0,
};

/* ---- helpers ---- */
const FALLBACK_EMOJI = "🦃";
function imgEl(src, cls) {
  // returns <img> string with onerror fallback to a turkey glyph tile
  return `<img class="${cls}" src="${src}" alt="" loading="lazy"
    onerror="this.onerror=null;this.replaceWith(window.fallbackTile('${cls}'))" />`;
}
window.fallbackTile = (cls) => {
  const d = document.createElement("div");
  d.className = cls + " " + (cls.includes("img") ? "cell__img--fallback" : "ph-fallback");
  d.textContent = FALLBACK_EMOJI;
  d.style.display = "grid";
  d.style.placeItems = "center";
  d.style.fontSize = "38px";
  return d;
};
function photoUrl(t, i = 0) {
  const id = t.photos[i % t.photos.length];
  return `images/${id}.jpeg`;
}
function distLabel(d) {
  if (d === 0) return "right here";
  if (d < 1) return Math.round(d * 5280) + " ft";
  return d.toFixed(1) + " mi";
}
function statusText(t) {
  return t.online ? "Strutting now" : `Last seen ${t.last || "recently"}`;
}
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.hidden = true), 1900);
}

/* ---- filtering ---- */
function visibleTurkeys() {
  const q = state.search.trim().toLowerCase();
  return TURKEYS.filter((t) => {
    if (state.filter.online && !t.online) return false;
    if (t.dist > state.filter.dist) return false;
    if (state.filter.tribes.size && !state.filter.tribes.has(t.tribe)) return false;
    if (q) {
      const hay = `${t.name} ${t.tribe} ${t.headline} ${t.bio}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => a.dist - b.dist);
}

/* ================= Screens ================= */
function render() {
  const screen = $("#screen");
  screen.scrollTop = 0;
  ({
    browse: renderBrowse,
    gobbles: renderGobbles,
    messages: renderMessages,
    profile: renderProfile,
  }[state.tab])(screen);
}

function renderBrowse(screen) {
  const list = visibleTurkeys();
  const onlineCount = list.filter((t) => t.online).length;
  const banner = `
    <div class="banner">
      <span class="banner__emoji">🌽</span>
      <div>
        <div class="banner__t">${onlineCount} turkeys strutting nearby</div>
        <div class="banner__s">Tap a bird to see their full plumage &amp; send a gobble</div>
      </div>
    </div>`;
  if (!list.length) {
    screen.innerHTML = banner + emptyState("🪶", "No turkeys match", "Try widening your distance or clearing filters.");
    return;
  }
  const cells = list.map((t, i) => {
    const fresh = i === 0 ? `<span class="cell__fresh">New</span>` : "";
    return `
      <button class="cell" data-open="${t.id}">
        ${imgEl(photoUrl(t), "cell__img")}
        <div class="cell__grad"></div>
        ${t.online ? '<span class="cell__online"></span>' : fresh}
        <div class="cell__meta">
          <div class="cell__name">${t.name.split(" ")[0]}, ${t.age}</div>
          <div class="cell__sub">📍 ${distLabel(t.dist)} · ${t.tribe}</div>
        </div>
      </button>`;
  }).join("");
  screen.innerHTML = banner + `<div class="grid">${cells}</div>`;
}

function renderGobbles(screen) {
  const cards = GOBBLES.map((id) => {
    const t = byId(id);
    return `
      <div class="gobcard" data-open="${t.id}">
        ${imgEl(photoUrl(t), "")}
        <div class="gobcard__grad"></div>
        <span class="gobcard__heart">💛</span>
        <div class="gobcard__meta">
          <div class="gobcard__n">${t.name.split(" ")[0]}, ${t.age}</div>
          <div class="gobcard__s">${t.tribe} · ${distLabel(t.dist)} away</div>
        </div>
      </div>`;
  }).join("");
  screen.innerHTML = `
    <div class="banner">
      <span class="banner__emoji">💛</span>
      <div>
        <div class="banner__t">${GOBBLES.length} turkeys gobbled at you</div>
        <div class="banner__s">They like your plumage. Gobble back to start a chat.</div>
      </div>
    </div>
    <div class="gobgrid">${cards}</div>`;
}

function renderMessages(screen) {
  if (!CHATS.length) {
    screen.innerHTML = emptyState("💬", "No gobbles yet", "Start a conversation from the Browse grid.");
    return;
  }
  const rows = CHATS.map((c) => {
    const t = byId(c.with);
    const last = c.messages[c.messages.length - 1];
    const preview = (last.from === "me" ? "You: " : "") + last.text;
    return `
      <div class="row" data-chat="${c.with}">
        <div class="av">
          ${imgEl(photoUrl(t), "")}
          ${t.online ? '<span class="av__on"></span>' : ""}
        </div>
        <div class="row__main">
          <div class="row__top">
            <span class="row__name">${t.name.split(" ")[0]}</span>
            <span class="tribe-tag">${t.tribe}</span>
            <span class="row__time">${last.t}</span>
          </div>
          <div class="row__sub ${c.unread ? "is-unread" : ""}">${preview}</div>
        </div>
        ${c.unread ? `<span class="row__badge">${c.unread}</span>` : ""}
      </div>`;
  }).join("");
  screen.innerHTML = `<div class="list">${rows}</div>`;
}

function renderProfile(screen) {
  const t = ME;
  screen.innerHTML = `
    <div class="me">
      <div class="me__hero">
        ${imgEl(photoUrl(t), "")}
        <div class="me__hgrad"></div>
        <div class="me__id">
          <h2>${t.name}, ${t.age}</h2>
          <p>${t.tribe} · ${t.height} · ${t.weight}</p>
        </div>
      </div>

      <div class="me__complete">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>Profile strength</strong><span style="color:var(--gold-hi);font-weight:700">60%</span>
        </div>
        <div class="me__bar"><i></i></div>
        <div style="font-size:12.5px;color:var(--txt-dim)">Add 2 more photos and your favorite roost to reach <b style="color:var(--txt)">Prime Plumage</b>.</div>
      </div>

      <div class="me__list">
        ${meItem(iconCamera, "Edit photos")}
        ${meItem(iconPen, "Edit bio &amp; vitals")}
        ${meItem(iconTribe, "Tribes &amp; what you're looking for")}
        ${meItem(iconBell, "Notifications")}
        ${meItem(iconShield, "Privacy &amp; safety")}
      </div>

      <div class="me__upsell">
        <h3>🦃 Gobblr <span style="color:var(--gold-hi)">GOLD</span></h3>
        <p>See who viewed you, unlimited gobbles, and roam to any cornfield worldwide.</p>
        <button class="btn btn--primary" style="width:100%" data-upsell>Go Gold — $4.99/mo</button>
      </div>
    </div>`;
}

function meItem(icon, label) {
  return `<div class="me__item" data-stub>${icon}<span>${label}</span><span class="chev">›</span></div>`;
}
function emptyState(emoji, h, p) {
  return `<div class="empty"><div class="empty__emoji">${emoji}</div><h3>${h}</h3><p>${p}</p></div>`;
}

/* ================= Profile sheet ================= */
function openProfile(id) {
  const t = byId(id);
  if (!t) return;
  state.sheetProfile = t;
  state.sheetIdx = 0;
  drawProfileSheet();
  $("#profileSheet").hidden = false;
}
function drawProfileSheet() {
  const t = state.sheetProfile;
  const i = state.sheetIdx;
  const gobbled = state.gobbled.has(t.id);
  const dots = t.photos.map((_, k) =>
    `<span class="phero__dot ${k === i ? "is-on" : ""}"></span>`).join("");
  const vitals = `
    <div class="vitals">
      <span class="vital"><b>Age</b> ${t.age}</span>
      <span class="vital"><b>Height</b> ${t.height}</span>
      <span class="vital"><b>Weight</b> ${t.weight}</span>
      <span class="vital"><b>Wattle</b> ${t.wattle}</span>
      <span class="vital"><b>Distance</b> ${distLabel(t.dist)}</span>
    </div>`;
  const stats = Object.entries(t.stats).map(([k, v]) =>
    `<div class="stat"><div class="stat__k">${k}</div><div class="stat__v">${v}</div></div>`).join("");
  const looking = t.looking.map((l) => `<span class="chip">${l}</span>`).join("");

  $("#profilePanel").innerHTML = `
    <div class="phero">
      ${imgEl(photoUrl(t, i), "phero__img")}
      <div class="phero__grad"></div>
      <div class="phero__dots">${dots}</div>
      <button class="phero__close" data-close-sheet aria-label="Close">
        <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
      ${t.photos.length > 1 ? `<div class="phero__tap phero__tap--l" data-photo="prev"></div><div class="phero__tap phero__tap--r" data-photo="next"></div>` : ""}
      <div class="phero__name">
        <h2>${t.name}, ${t.age}</h2>
        <div class="phero__status">
          <span class="dot ${t.online ? "dot--on" : "dot--off"}"></span>${statusText(t)} · 📍 ${distLabel(t.dist)} away
        </div>
      </div>
    </div>

    <div class="pbody">
      <p class="pheadline">“${t.headline}”</p>
      <p class="pbio">${t.bio}</p>

      <div class="psec">
        <div class="psec__h">Tribe</div>
        <span class="chip chip--tribe">${t.tribe}</span>
      </div>
      <div class="psec">
        <div class="psec__h">Vitals</div>
        ${vitals}
      </div>
      <div class="psec">
        <div class="psec__h">Plumage stats</div>
        <div class="stats">${stats}</div>
      </div>
      <div class="psec">
        <div class="psec__h">Looking for</div>
        <div class="chips">${looking}</div>
      </div>
    </div>

    <div class="pactions">
      <button class="fab fab--gobble ${gobbled ? "is-on" : ""}" data-gobble="${t.id}" aria-label="Gobble">
        <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-10-9.2C.3 8.4 2 4.5 5.6 4.5c2 0 3.4 1.1 4.4 2.6 1-1.5 2.4-2.6 4.4-2.6 3.6 0 5.3 3.9 3.6 7.3C19.5 16.4 12 21 12 21z" ${gobbled ? 'fill="currentColor"' : ""}/></svg>
      </button>
      <button class="btn btn--primary" data-message="${t.id}">
        <svg viewBox="0 0 24 24" style="width:20px;height:20px"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.7 9.7 0 0 1-4.5-1L3 20l1.2-4A8.3 8.3 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>
        Chat
      </button>
      <button class="fab fab--block" data-block="${t.id}" aria-label="Block">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>
      </button>
    </div>`;
}
function closeSheets() {
  $("#profileSheet").hidden = true;
  $("#filterSheet").hidden = true;
}

/* ================= Chat view ================= */
function openChat(withId) {
  const t = byId(withId);
  let chat = CHATS.find((c) => c.with === withId);
  if (!chat) { chat = { with: withId, unread: 0, messages: [] }; CHATS.unshift(chat); }
  chat.unread = 0;
  setHeader(t.name.split(" ")[0], true);
  const screen = $("#screen");
  const renderBubbles = () => chat.messages.map((m) => `
    <div class="bub bub--${m.from}">${m.text}</div>
    <span class="bub__t bub__t--${m.from}">${m.t}</span>`).join("");
  screen.innerHTML = `
    <div class="chat">
      <button class="chathead" data-open="${withId}" aria-label="View ${t.name.split(" ")[0]}'s profile">
        <div class="av av--sm">
          ${imgEl(photoUrl(t), "")}
          ${t.online ? '<span class="av__on"></span>' : ""}
        </div>
        <div class="chathead__main">
          <div class="chathead__name">${t.name.split(" ")[0]}, ${t.age}</div>
          <div class="chathead__sub">${statusText(t)}</div>
        </div>
        <svg class="chathead__chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
      </button>
      <div class="bubbles" id="bubbles">${renderBubbles()}</div>
    </div>
    <div class="chatbar">
      <input id="chatInput" placeholder="Send a gobble to ${t.name.split(" ")[0]}…" autocomplete="off" />
      <button id="chatSend" aria-label="Send">
        <svg viewBox="0 0 24 24" style="width:20px;height:20px"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
      </button>
    </div>`;
  const scrollEnd = () => { const b = $("#bubbles"); b.scrollTop = b.scrollHeight; screen.scrollTop = screen.scrollHeight; };
  scrollEnd();
  const send = async () => {
    const inp = $("#chatInput");
    const text = inp.value.trim();
    if (!text) return;
    chat.messages.push({ from: "me", text, t: nowTime() });
    inp.value = "";
    $("#bubbles").innerHTML = renderBubbles();
    scrollEnd();
    const typing = document.createElement("div");
    typing.className = "bub bub--them bub--typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    $("#bubbles").appendChild(typing);
    scrollEnd();
    const reply = await fetchBotReply(withId, chat);
    typing.remove();
    chat.messages.push({ from: "them", text: reply, t: nowTime() });
    $("#bubbles").innerHTML = renderBubbles();
    scrollEnd();
  };
  $("#chatSend").onclick = send;
  $("#chatInput").addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
  $("#chatInput").focus();
}
const REPLIES = [
  "gobble gobble 😏", "omg yes", "you had me at corn", "strut over here then 😉",
  "ha you're trouble", "free range fr", "🦃💛", "love that for us",
  "ok but what's your roost situation", "say less",
];
const TURKEYJERKY_REPLIES = [
  "two birds, one branch? 😏", "I'm self-basting but I do take a helping wing",
  "buff my wattle and I'll buff yours, fair's fair", "I do my best work solo… but I'm a team player 🦃",
  "free-range AND hands-on, that's the dream", "you, me, and a bottle of corn oil",
  "I call it cardio. flock me on that.", "strut for me and I'll strut right back 😉",
  "tandem preening is criminally underrated", "warning: I get carried away in pairs",
];
function pickReply(withId) {
  const pool = withId === "turkeyjerky" ? TURKEYJERKY_REPLIES : REPLIES;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ---- live AI replies via the /api/chat serverless proxy ----
 * Falls back to the canned replies above when the proxy isn't reachable
 * (local file open, GitHub Pages, or ANTHROPIC_API_KEY not set yet). */
function personaFor(t) {
  if (t.id === "turkeyjerky") {
    return "You are TurkeyJerky, a shameless, flirty turkey on a turkey dating app called Gobblr. " +
      "You constantly make cheeky innuendo and double-entendre jokes, leaning on turkey-themed wordplay " +
      "(self-basting, buffing your own wattle, doing your best work solo but better in pairs, 'two birds one branch', BYO corn oil, etc). " +
      "Keep it PG-13 — suggestive and silly, never explicit or graphic. " +
      "Reply like a text message: 1-2 short punchy lines with the odd emoji. Always stay in character as a turkey.";
  }
  return `You are ${t.name}, a turkey on a turkey dating app called Gobblr. ` +
    `Bio: "${t.bio}" Tribe: ${t.tribe}. Headline: "${t.headline}". ` +
    "Reply in character as this turkey — flirty, fun, with turkey puns. " +
    "Text-message style: 1-2 short lines with the odd emoji. Keep it light and playful.";
}
function toAnthropicMessages(msgs) {
  // Map {from:'me'|'them'} → Anthropic roles, merge consecutive same-role turns,
  // and ensure the sequence starts with a user turn.
  const out = [];
  for (const m of msgs) {
    const role = m.from === "me" ? "user" : "assistant";
    if (out.length && out[out.length - 1].role === role) out[out.length - 1].content += "\n" + m.text;
    else out.push({ role, content: m.text });
  }
  while (out.length && out[0].role !== "user") out.shift();
  return out;
}
async function fetchBotReply(withId, chat) {
  const t = byId(withId);
  const messages = toAnthropicMessages(chat.messages);
  if (!messages.length) return pickReply(withId);
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ system: personaFor(t), messages }),
    });
    if (!res.ok) throw new Error("status " + res.status);
    const data = await res.json();
    const text = (data.text || "").trim();
    return text || pickReply(withId);
  } catch (_) {
    return pickReply(withId);
  }
}
function nowTime() {
  const d = new Date();
  let h = d.getHours(), m = d.getMinutes();
  const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12;
  return `${h}:${m < 10 ? "0" + m : m} ${ap}`;
}

/* ================= Header / nav ================= */
function setHeader(title, showBack) {
  $("#brandHome").hidden = !!title;
  $("#topbarTitle").hidden = !title;
  $("#topbarTitle").textContent = title || "";
  $("#navBack").hidden = !showBack;
  state.inSubview = !!showBack;
}
function goTab(tab) {
  state.tab = tab;
  state.inSubview = false;
  setHeader(null, false);
  $$(".tab").forEach((b) => b.classList.toggle("is-active", b.dataset.tab === tab));
  closeSearch();
  render();
}

/* ================= Filters ================= */
function buildTribeChips() {
  $("#fTribes").innerHTML = TRIBES.map((tr) =>
    `<span class="chip ${state.filter.tribes.has(tr) ? "is-on" : ""}" data-ftribe="${tr}">${tr}</span>`).join("");
  updateFilterCount();
}
function updateFilterCount() {
  const tmp = { ...state.filter };
  const n = TURKEYS.filter((t) => {
    if (tmp.online && !t.online) return false;
    if (t.dist > tmp.dist) return false;
    if (tmp.tribes.size && !tmp.tribes.has(t.tribe)) return false;
    return true;
  }).length;
  $("#filterCount").textContent = n;
}
function filterActive() {
  return state.filter.online || state.filter.dist < 50 || state.filter.tribes.size > 0;
}

/* ================= Search ================= */
function openSearch() {
  $("#searchRow").hidden = false;
  $("#searchInput").focus();
}
function closeSearch() {
  $("#searchRow").hidden = true;
  $("#searchInput").value = "";
  state.search = "";
}

/* ================= Events ================= */
document.addEventListener("click", (e) => {
  const openT = e.target.closest("[data-open]");
  if (openT) return openProfile(openT.dataset.open);

  const chat = e.target.closest("[data-chat]");
  if (chat) return openChat(chat.dataset.chat);

  if (e.target.closest("[data-close-sheet]")) return closeSheets();

  const photo = e.target.closest("[data-photo]");
  if (photo) {
    const t = state.sheetProfile;
    const n = t.photos.length;
    state.sheetIdx = photo.dataset.photo === "next"
      ? (state.sheetIdx + 1) % n
      : (state.sheetIdx - 1 + n) % n;
    return drawProfileSheet();
  }

  const gob = e.target.closest("[data-gobble]");
  if (gob) {
    const id = gob.dataset.gobble;
    if (state.gobbled.has(id)) { state.gobbled.delete(id); }
    else { state.gobbled.add(id); toast(`💛 You gobbled at ${byId(id).name.split(" ")[0]}!`); }
    return drawProfileSheet();
  }

  const msg = e.target.closest("[data-message]");
  if (msg) { closeSheets(); goTab("messages"); return openChat(msg.dataset.message); }

  const block = e.target.closest("[data-block]");
  if (block) { closeSheets(); toast("🚫 Turkey blocked"); return; }

  if (e.target.closest("[data-stub]")) return toast("Coming soon to the coop 🪺");
  if (e.target.closest("[data-upsell]")) return toast("🦃 Gobblr GOLD — demo only");

  const tribe = e.target.closest("[data-ftribe]");
  if (tribe) {
    const tr = tribe.dataset.ftribe;
    state.filter.tribes.has(tr) ? state.filter.tribes.delete(tr) : state.filter.tribes.add(tr);
    tribe.classList.toggle("is-on");
    return updateFilterCount();
  }
});

$("#tabbar").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) goTab(tab.dataset.tab);
});

$("#navBack").addEventListener("click", () => goTab(state.tab));

$("#openSearch").addEventListener("click", () => {
  if ($("#searchRow").hidden) { goTab("browse"); openSearch(); }
  else closeSearch();
});
$("#searchClear").addEventListener("click", () => { $("#searchInput").value = ""; state.search = ""; render(); });
$("#searchInput").addEventListener("input", (e) => { state.search = e.target.value; if (state.tab !== "browse") goTab("browse"); else render(); });

$("#openFilter").addEventListener("click", () => { buildTribeChips(); $("#filterSheet").hidden = false; });
$("#fOnline").addEventListener("change", (e) => { state.filter.online = e.target.checked; updateFilterCount(); });
$("#fDist").addEventListener("input", (e) => {
  state.filter.dist = +e.target.value;
  $("#fDistVal").textContent = e.target.value + " mi";
  updateFilterCount();
});
$("#filterReset").addEventListener("click", () => {
  state.filter = { online: false, dist: 50, tribes: new Set() };
  $("#fOnline").checked = false;
  $("#fDist").value = 50; $("#fDistVal").textContent = "50 mi";
  buildTribeChips();
});
$("#filterApply").addEventListener("click", () => {
  closeSheets();
  $("#filterDot").hidden = !filterActive();
  goTab("browse");
});

$("#brandHome").addEventListener("click", () => goTab("browse"));

/* ================= Icons ================= */
const iconCamera = `<svg viewBox="0 0 24 24"><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.2"/></svg>`;
const iconPen = `<svg viewBox="0 0 24 24"><path d="M4 20h4L20 8l-4-4L4 16z"/></svg>`;
const iconTribe = `<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.6"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/></svg>`;
const iconBell = `<svg viewBox="0 0 24 24"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>`;
const iconShield = `<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>`;

/* ================= Boot ================= */
buildTribeChips();
goTab("browse");
