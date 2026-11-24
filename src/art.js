// Hand-drawn SVG illustrations (inline, no network, scale to any screen).
const svg = (body, vb = "0 0 100 100") => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${body}</svg>`;

export const LANDMARKS = [
  // 1 Grammar Village
  svg(`<ellipse cx="50" cy="88" rx="46" ry="9" fill="#6fcf7f"/>
    <rect x="44" y="30" width="7" height="14" fill="#b8442f"/>
    <rect x="14" y="50" width="38" height="34" rx="3" fill="#ffe3a3"/>
    <polygon points="8,52 33,24 58,52" fill="#ef5b45"/>
    <rect x="27" y="62" width="12" height="22" rx="2" fill="#a86b3c"/>
    <rect x="17" y="57" width="8" height="8" rx="1.5" fill="#8fd3ff"/>
    <rect x="56" y="60" width="29" height="24" rx="3" fill="#ffd1e0"/>
    <polygon points="52,62 70,43 89,62" fill="#4a90e2"/>
    <rect x="65" y="70" width="9" height="14" rx="2" fill="#a86b3c"/>
    <circle cx="90" cy="30" r="7" fill="#ffe27a"/>`),
  // 2 Enchanted Forest
  svg(`<ellipse cx="50" cy="90" rx="46" ry="8" fill="#5fc477"/>
    <rect x="24" y="72" width="7" height="16" fill="#8b5a2b"/>
    <polygon points="27,26 10,58 44,58" fill="#2f9e5b"/><polygon points="27,42 7,74 47,74" fill="#27874e"/>
    <rect x="54" y="80" width="9" height="10" fill="#8b5a2b"/>
    <polygon points="58,8 38,46 78,46" fill="#3bb36c"/><polygon points="58,28 33,66 83,66" fill="#2f9e5b"/><polygon points="58,48 29,84 87,84" fill="#27874e"/>
    <rect x="84" y="66" width="5" height="22" fill="#8b5a2b"/><circle cx="86.5" cy="58" r="12" fill="#5ad285"/>
    <circle cx="14" cy="84" r="3" fill="#ff7aa8"/><circle cx="20" cy="87" r="2.5" fill="#ffd23f"/>`),
  // 3 Crystal River
  svg(`<ellipse cx="50" cy="90" rx="46" ry="8" fill="#6fcf7f"/>
    <path d="M0 62 Q25 46 50 62 T100 62 L100 90 Q75 100 50 90 T0 90 Z" fill="#4fb4f2"/>
    <path d="M10 74 q6 -6 12 0 t12 0" stroke="#d3f0ff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M54 82 q6 -6 12 0 t12 0" stroke="#d3f0ff" stroke-width="3" fill="none" stroke-linecap="round"/>
    <polygon points="46,6 64,28 46,56 28,28" fill="#7fe3ff"/><polygon points="46,6 54,28 46,56 38,28" fill="#c9f7ff"/>
    <polygon points="78,36 87,48 78,64 69,48" fill="#b79cff"/><polygon points="78,36 82,48 78,64 74,48" fill="#dccfff"/>`),
  // 4 Wisdom Mountain
  svg(`<ellipse cx="50" cy="90" rx="46" ry="8" fill="#6fcf7f"/>
    <polygon points="4,90 36,30 68,90" fill="#8aa4c8"/><polygon points="36,30 46,48 38,44 30,50" fill="#fff"/>
    <polygon points="42,90 72,40 98,90" fill="#6f8bb5"/><polygon points="72,40 80,54 72,50 64,57" fill="#fff"/>
    <rect x="35.5" y="8" width="2.5" height="24" fill="#6b4a2a"/><polygon points="38,8 58,14 38,20" fill="#ff5a5f"/>`),
  // 5 Treasure Castle
  svg(`<ellipse cx="50" cy="90" rx="46" ry="8" fill="#6fcf7f"/>
    <rect x="22" y="46" width="56" height="42" fill="#d9d4ec"/>
    <rect x="10" y="34" width="22" height="54" fill="#c9c2e6"/><rect x="68" y="34" width="22" height="54" fill="#c9c2e6"/>
    <rect x="40" y="24" width="20" height="64" fill="#e6e1f6"/>
    <polygon points="8,34 21,10 34,34" fill="#ff5a5f"/><polygon points="66,34 79,10 92,34" fill="#ff5a5f"/><polygon points="38,24 50,2 62,24" fill="#ffb02e"/>
    <path d="M42 88 v-16 a8 8 0 0 1 16 0 v16 z" fill="#7a4f9a"/>
    <rect x="16" y="46" width="8" height="10" rx="3" fill="#ffe27a"/><rect x="76" y="46" width="8" height="10" rx="3" fill="#ffe27a"/><rect x="46" y="34" width="8" height="10" rx="3" fill="#ffe27a"/>`),
];

export const LOGO = svg(`<rect x="4" y="4" width="92" height="92" rx="26" fill="#ffc83d"/><rect x="22" y="44" width="56" height="36" rx="6" fill="#a8672f"/><path d="M20 46 v-8 a30 18 0 0 1 60 0 v8z" fill="#c27a38"/><rect x="22" y="58" width="56" height="7" fill="#ffd96b"/><rect x="44" y="55" width="12" height="14" rx="3" fill="#ffd96b" stroke="#a8672f" stroke-width="2"/>`);

export const CHEST = svg(`<circle cx="100" cy="90" r="80" fill="#fff3b0" opacity=".55"/>
  <ellipse cx="100" cy="152" rx="76" ry="10" fill="#000" opacity=".18"/>
  <rect x="34" y="82" width="132" height="68" rx="9" fill="#a8672f"/><rect x="34" y="82" width="132" height="14" fill="#8b5223"/>
  <rect x="34" y="116" width="132" height="9" fill="#ffd23f"/><rect x="89" y="106" width="22" height="28" rx="5" fill="#ffd23f" stroke="#c99200" stroke-width="2"/><circle cx="100" cy="119" r="3.5" fill="#8b5223"/>
  <g class="coins"><circle cx="64" cy="80" r="11" fill="#ffd23f" stroke="#d9a400" stroke-width="2"/><circle cx="90" cy="74" r="12" fill="#ffe27a" stroke="#d9a400" stroke-width="2"/><circle cx="118" cy="76" r="12" fill="#ffd23f" stroke="#d9a400" stroke-width="2"/><circle cx="142" cy="82" r="10" fill="#ffe27a" stroke="#d9a400" stroke-width="2"/>
  <polygon points="100,48 110,64 100,84 90,64" fill="#7fe3ff"/><polygon points="130,56 136,66 130,78 124,66" fill="#ff8fc1"/></g>
  <g class="lid"><path d="M30 86 v-22 a70 38 0 0 1 140 0 v22 z" fill="#c27a38"/><rect x="30" y="76" width="140" height="10" fill="#ffd23f"/><path d="M30 86 v-22 a70 38 0 0 1 40 -28" fill="none" stroke="#e29a52" stroke-width="5" stroke-linecap="round"/></g>`, "0 0 200 170");
