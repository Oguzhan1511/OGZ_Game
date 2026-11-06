import { lobbyStyles, lobbyClient } from './lobby.js';
const foxWatermarkSvg =
  '<svg class="app-bg-watermark" aria-hidden="true">' +
  '<defs>' +
  '<g id="ogzFoxWatermark">' +
  '<path d="M165,0 Q165,0 166,0 Q167,0 169,2 Q171,4 176,14 Q181,24 183,31.5 Q185,39 185.5,46.5 Q186,54 181.5,50 Q177,46 176,46 Q175,46 174.5,44 Q174,42 168.5,37 Q163,32 155.5,29.5 Q148,27 148,25.5 Q148,24 149,23.5 Q150,23 151,20 Q152,17 158.5,8.5Z M66,5 Q66,5 71.5,6 Q77,7 85,11 Q93,15 98.5,19.5 Q104,24 105,24 Q106,24 110.5,28.5 Q115,33 122,30.5 Q129,28 138,28 Q147,28 150,29.5 Q153,31 145,30.5 Q137,30 129,33 Q121,36 114,42 Q107,48 107,49 Q107,50 103.5,54 Q100,58 99,61 Q98,64 103.5,66.5 Q109,69 112,72.5 Q115,76 117,80.5 Q119,85 118.5,94.5 Q118,104 113.5,111 Q109,118 101,122 Q93,126 88,126 Q83,126 77,123.5 Q71,121 67.5,117.5 Q64,114 63,111.5 Q62,109 60.5,104.5 Q59,100 59,96.5 Q59,93 62,84.5 Q65,76 68.5,72.5 Q72,69 77,66.5 Q82,64 87,63.5 Q92,63 96.5,55 Q101,47 106,42.5 Q111,38 110,37.5 Q109,37 105,41 Q101,45 98.5,40.5 Q96,36 91,31 Q86,26 79.5,22 Q73,18 79,38.5 Q85,59 78.5,62 Q72,65 70,67 Q68,69 67,71.5 Q66,74 65,74 Q64,74 61.5,64 Q59,54 59,40.5 Q59,27 60,22 Q61,17 63.5,11Z   M144,44 Q144,44 150,44.5 Q156,45 164.5,48.5 Q173,52 181,59 Q189,66 191.5,71 Q194,76 198.5,81 Q203,86 206,87 Q209,88 209.5,89 Q210,90 218.5,92.5 Q227,95 230.5,95 Q234,95 235,96 Q236,97 235.5,99.5 Q235,102 234.5,101 Q234,100 229,100 Q224,100 225,103 Q226,106 228,107.5 Q230,109 224,114 Q218,119 212.5,121.5 Q207,124 195.5,126.5 Q184,129 180.5,130.5 Q177,132 173.5,135 Q170,138 168.5,141 Q167,144 167,149 Q167,154 168,156.5 Q169,159 173,163.5 Q177,168 185.5,172.5 Q194,177 187,179 Q180,181 169,181 Q158,181 155.5,182 Q153,183 151,185 Q149,187 147.5,191.5 Q146,196 147,200.5 Q148,205 150,209 Q152,213 155.5,217 Q159,221 157.5,221 Q156,221 152,219 Q148,217 147.5,216 Q147,215 142.5,212.5 Q138,210 133.5,205.5 Q129,201 126,196 Q123,191 122,187 Q121,183 121,177.5 Q121,172 122.5,167 Q124,162 126.5,157.5 Q129,153 133.5,148 Q138,143 133,145.5 Q128,148 123,152.5 Q118,157 115.5,162 Q113,167 112,167.5 Q111,168 110,173.5 Q109,179 107.5,177.5 Q106,176 105,172.5 Q104,169 104,161.5 Q104,154 108.5,145 Q113,136 121,128.5 Q129,121 135,117.5 Q141,114 142.5,114 Q144,114 139.5,113.5 Q135,113 130,114.5 Q125,116 128.5,110 Q132,104 139,98 Q146,92 139,93.5 Q132,95 130.5,86 Q129,77 127,73.5 Q125,70 123.5,69 Q122,68 122,66.5 Q122,65 124.5,61 Q127,57 131,53 Q135,49 139.5,46.5Z M86,68 Q86,68 82.5,69 Q79,70 74,74 Q69,78 66.5,83 Q64,88 63.5,93.5 Q63,99 64,103 Q65,107 68,110.5 Q71,114 71,115 Q71,116 76,118.5 Q81,121 85,121 Q89,121 93.5,120 Q98,119 103,114.5 Q108,110 110.5,104 Q113,98 113,92.5 Q113,87 111.5,83 Q110,79 107,75.5 Q104,72 99,70 Q94,68 90,68Z M163,73 Q163,73 158,75 Q153,77 151.5,79 Q150,81 158,80.5 Q166,80 169.5,81.5 Q173,83 178.5,84.5 Q184,86 180.5,81 Q177,76 173.5,74.5 Q170,73 166.5,73Z M50,109 Q50,109 51,112 Q52,115 46,120.5 Q40,126 36,134 Q32,142 32,148.5 Q32,155 33,158 Q34,161 37.5,166.5 Q41,172 49.5,179 Q58,186 70,191.5 Q82,197 91.5,199 Q101,201 102,202.5 Q103,204 107.5,206.5 Q112,209 101,208.5 Q90,208 76,205.5 Q62,203 49,198 Q36,193 35.5,192 Q35,191 33,190.5 Q31,190 27,186.5 Q23,183 22,183 Q21,183 16.5,178 Q12,173 10,169 Q8,165 7.5,157 Q7,149 11,141.5 Q15,134 22,127.5 Q29,121 39.5,115Z M107,131 Q107,131 108,131.5 Q109,132 105.5,135 Q102,138 97.5,145.5 Q93,153 91.5,159 Q90,165 90,170 Q90,175 87.5,173 Q85,171 85,170 Q85,169 82.5,165.5 Q80,162 79,158 Q78,154 78,150 Q78,146 80,140.5 Q82,135 90,135 Q98,135 102.5,133Z M260,146 Q260,146 256.5,151.5 Q253,157 245,165 Q237,173 236,173 Q235,173 233.5,175 Q232,177 231,177 Q230,177 229,178.5 Q228,180 227,180 Q226,180 221,184 Q216,188 207,192.5 Q198,197 188,200.5 Q178,204 169.5,206 Q161,208 160,208 Q159,208 158.5,206.5 Q158,205 156.5,201.5 Q155,198 165,196.5 Q175,195 190.5,189.5 Q206,184 222.5,174.5 Q239,165 249.5,155.5Z" fill="currentColor" fill-rule="evenodd"/>' +
  '</g>' +
  '<pattern id="foxWatermarkPattern" width="140" height="120" patternUnits="userSpaceOnUse">' +
  '<g transform="translate(16, 12) scale(0.18)" opacity="0.04" style="color: #ffffff;">' +
  '<use href="#ogzFoxWatermark"/>' +
  '</g>' +
  '<g transform="translate(86, 72) scale(0.18)" opacity="0.04" style="color: #ffffff;">' +
  '<use href="#ogzFoxWatermark"/>' +
  '</g>' +
  '</pattern>' +
  '</defs>' +
  '<rect width="100%" height="100%" fill="url(#foxWatermarkPattern)"/>' +
  '</svg>';

export function createAppShell({ gameViewportStyles, battleshipStyles, battleshipClient, numberRaceStyles, numberRaceClient, finalStandingsStyles, finalStandingsClient, gameAudioClient, desktopGameStyles, roundRankingStyles, mobileGameStyles, guessInputClient, productGameStyles, productGameClient, modeCardStyles, modeCardClient, roundRankingClient, mobileGameClient, validProfile, auctionStyles, auctionClient }) {
  return String.raw`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>OGZ Game — Tahminin konuşsun.</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,700&family=Bungee&family=Fira+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800&family=Space+Grotesk:wght@400;500;600;700;800&family=Syne:wght@700;800&family=Outfit:wght@700;800&family=Righteous&family=Russo+One&family=Montserrat:wght@800;900&family=Unbounded:wght@700;800;900&family=Chakra+Petch:wght@700&family=Bebas+Neue&display=swap" rel="stylesheet"><style>
:root {
  --brand-font: "Bungee", cursive, sans-serif;
  --hero-font: "Fira Sans", sans-serif;
  --bg: #111520;
  --bg-wave: #241620;
  --panel: #1c222e;
  --panel-hover: #232b3a;
  --line: #252b37;
  --line-light: #343d4e;
  --muted: #94a3b8;
  --a: #e24046;
  --a-hover: #f04f55;
  --gold: #f0ad5f;
  --text: #ffffff;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  position: relative;
  isolation: isolate;
  min-height: 100vh;
}
.app-bg-watermark {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  pointer-events: none;
}
body:is(.game-mode, .auction-active, .number-active, .battleship-active) .app-bg-watermark {
  display: none;
}
button,
input,
select {
  font: inherit;
}
button {
  cursor: pointer;
  border: 0;
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 4px;
}
h1,
h2,
h3,
.logo,
.num {
  font-family: var(--brand-font, "Space Grotesk"), "Space Grotesk", sans-serif;
}
main {
  margin: 0 auto;
  padding: 0 28px;
  width: 100%;
  max-width: 1260px;
}
header.topbar {
  position: fixed;
  top: 22px;
  right: 28px;
  left: auto;
  z-index: 20;
  height: auto;
  display: flex;
  gap: 10px;
  border: 0;
  background: transparent;
}
.headeruser,
.settings-button {
  height: 42px;
  padding: 6px 13px;
  display: flex;
  align-items: center;
  gap: 9px;
  background: #1c222eeb;
  border: 1px solid var(--line-light);
  border-radius: 10px;
  color: #f8fafc;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  transition:
    border-color 0.18s,
    color 0.18s,
    transform 0.18s;
}
.headeruser img {
  width: 26px;
  height: 26px;
  border-radius: 7px;
}
.headeruser:hover,
.settings-button:hover {
  border-color: var(--gold);
  color: var(--gold);
  transform: translateY(-1px);
}
body:not(.home-mode) > main {
  padding-top: 75px;
}
.pagehead {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0 24px;
}
.pagehead h1 {
  margin: 0 0 7px;
  font-size: 30px;
  letter-spacing: -1px;
}
.pagehead p {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}
.pill {
  border: 1px solid var(--line-light);
  border-radius: 30px;
  padding: 8px 13px;
  font-size: 10px;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tag {
  color: var(--gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.8px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #f0ad5f14;
  border: 1px solid #f0ad5f38;
  padding: 6px 10px;
  border-radius: 6px;
}
.sectiontitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 25px 0 17px;
}
.sectiontitle h2 {
  font-size: 17px;
  margin: 0;
  letter-spacing: -0.4px;
}
.sectiontitle span {
  font-size: 11px;
  color: var(--muted);
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 13px;
  object-fit: cover;
}
.modalback {
  position: fixed;
  inset: 0;
  background: #090c14d9;
  backdrop-filter: blur(9px);
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
}
.modal {
  background: var(--panel);
  border: 1px solid var(--line-light);
  width: min(480px, 100%);
  border-radius: 18px;
  padding: 30px;
  max-height: 92vh;
  overflow: auto;
  box-shadow: 0 24px 100px #000a;
}
.modal h2 {
  font-size: 25px;
  margin: 12px 0 8px;
}
.modal p {
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}
.modal label {
  display: block;
  margin: 22px 0 8px;
  font-size: 12px;
  color: #e2e8f0;
}
.input {
  width: 100%;
  background: #111520;
  border: 1px solid var(--line-light);
  border-radius: 9px;
  padding: 14px;
  color: white;
  outline: none;
  transition: border-color 0.15s;
}
.input:focus {
  border-color: var(--a);
}
.avatars {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 9px;
}
.avbtn {
  background: transparent;
  padding: 3px;
  border: 2px solid transparent;
  border-radius: 14px;
  transition: transform 0.18s;
}
.avbtn:hover {
  transform: translateY(-3px);
}
.avbtn img {
  display: block;
  width: 100%;
  border-radius: 9px;
}
.avbtn.selected {
  border-color: var(--gold);
  background: #f0ad5f18;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--a);
  color: #ffffff;
  padding: 13px 22px;
  font-weight: 700;
  border-radius: 10px;
  transition:
    background 0.18s,
    transform 0.18s;
}
.btn:hover:not(:disabled) {
  background: var(--a-hover);
  transform: translateY(-1px);
}
.btn.secondary {
  background: #232b3a;
  color: #e2e8f0;
  border: 1px solid var(--line-light);
}
.btn.secondary:hover:not(:disabled) {
  background: #2c3648;
  border-color: var(--gold);
}
.btn.full {
  width: 100%;
  margin-top: 20px;
}
.close {
  float: right;
  color: #94a3b8;
  background: none;
  font-size: 24px;
}
.upload {
  background: none;
  color: var(--gold);
  font-size: 11px;
  margin-top: 12px;
  padding: 5px 0;
}
.toast {
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  background: #1c222e;
  color: #ffffff;
  border: 1px solid var(--gold);
  padding: 13px 22px;
  border-radius: 10px;
  max-width: 90%;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 10px 40px #0008;
}
.roomlayout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 24px;
}
/* ==================== LOBBY HERO DASHBOARD ==================== */

.box {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 26px;
}
.code {
  font-size: 40px;
  letter-spacing: 8px;
  color: var(--gold);
  margin: 20px 0;
}
.players {
  display: grid;
  gap: 12px;
  margin: 20px 0;
}
.player {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #151a24;
}
.player strong {
  font-size: 13px;
}
.player small {
  display: block;
  font-size: 10px;
  color: var(--muted);
  margin-top: 4px;
}
.player .score {
  margin-left: auto;
  color: var(--gold);
  font-family: "Space Grotesk";
  font-size: 19px;
  font-weight: 700;
}
.carphoto {
  width: 100%;
  height: 295px;
  object-fit: cover;
  border-radius: 10px;
}
.specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}
.specs div {
  background: #111520;
  padding: 13px;
  border-radius: 8px;
  border: 1px solid var(--line);
}
.specs small {
  display: block;
  font-size: 10px;
  color: var(--muted);
  margin-bottom: 7px;
}
.specs b {
  font-size: 12px;
  line-height: 1.5;
}
.notice {
  font-size: 10px !important;
  color: #8492a6 !important;
  line-height: 1.7;
}
.price {
  font-size: 36px;
  color: var(--gold);
  font-family: "Space Grotesk";
  font-weight: 700;
  margin: 18px 0;
}
.progress {
  height: 4px;
  background: #252b37;
  border-radius: 5px;
  margin-bottom: 25px;
}
.progress i {
  display: block;
  height: 100%;
  background: var(--a);
  border-radius: 5px;
}
.hidden {
  display: none !important;
}
.motion-setting {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 17px 0;
  border-top: 1px solid var(--line);
}
.motion-setting input {
  width: 19px;
  height: 19px;
  accent-color: var(--a);
  cursor: pointer;
}
.room-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}
.round-timer {
  font-family: "Space Grotesk";
  font-weight: 700;
  font-size: 22px;
  color: var(--gold);
  padding: 10px 14px;
  border: 1px solid #f0ad5f44;
  background: #1c222e;
  border-radius: 10px;
  white-space: nowrap;
}
.round-timer.urgent {
  color: #ff6b6b;
  border-color: var(--a);
}
.duration-control {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 14px;
}
.duration-slider {
  --fill: 18.1818%;
  width: 100%;
  min-width: 0;
  height: 7px;
  appearance: none;
  -webkit-appearance: none;
  border-radius: 10px;
  cursor: pointer;
  background: linear-gradient(to right, var(--a) var(--fill), #283040 var(--fill));
  accent-color: var(--a);
}
.duration-slider::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  background: var(--a);
  border: 3px solid #ffffff;
  box-shadow: 0 0 0 5px #e2404624;
}
.duration-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--a);
  border: 3px solid #ffffff;
}
.duration-slider:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 8px;
}
.duration-value {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.duration-value input {
  width: 78px;
  text-align: center;
  padding: 12px 8px;
  font-size: 18px;
  font-family: "Space Grotesk";
}
.duration-value span {
  font-size: 11px;
  color: var(--muted);
}
.duration-limits {
  display: flex;
  justify-content: space-between;
  margin-top: 14px;
  font-size: 10px;
  color: var(--muted);
}
.carphoto.listing-photo {
  height: auto;
  max-height: 460px;
  object-fit: contain;
  background: #111520;
}
.damage-section {
  margin: 24px 0;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
.damage-section h3 {
  font-size: 16px;
  margin: 0 0 15px;
}
.damage-image {
  display: block;
  width: 100%;
  max-width: 520px;
  height: auto;
  margin: 0 auto;
  border-radius: 10px;
}

/* === HOME MODE (NO NAVBAR, IMAGE 1 PALETTE + IMAGE 2 3D MODE CARDS) === */
body.home-mode {
  isolation: isolate;
  background: var(--bg);
  min-height: 100svh;
  overflow-x: hidden;
  position: relative;
}
body.home-mode::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  background: var(--bg);
}
.home-wave-bl,
.home-wave-br {
  position: fixed;
  bottom: 0;
  z-index: -1;
  pointer-events: none;
}
.home-wave-bl {
  left: 0;
  width: min(540px, 46vw);
  height: auto;
}
.home-wave-br {
  right: 0;
  width: min(580px, 50vw);
  height: auto;
}
.home-mode main {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 40px 26px;
  max-width: 1320px;
  margin: 0 auto;
}
.home-brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
}
.ogz-brand {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: var(--text);
  user-select: none;
}
.ogz-brand-logo {
  width: auto;
  height: clamp(66px, 7.6svh, 86px);
  max-width: 102px;
  object-fit: contain;
  flex-shrink: 0;
}
.ogz-brand-crown {
  width: 44px;
  height: 38px;
  flex-shrink: 0;
  transform: rotate(-14deg);
}
.ogz-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}
.ogz-brand-text strong {
  font-family: var(--brand-font, "Bungee"), "Bungee", cursive, sans-serif;
  font-weight: 400;
  font-size: 46px;
  letter-spacing: 0.5px;
  color: #ffffff;
}
.ogz-brand-text span {
  font-family: var(--brand-font, "Bungee"), "Bungee", cursive, sans-serif;
  font-weight: 400;
  font-size: 13px;
  letter-spacing: 6.5px;
  color: #94a3b8;
  margin-top: 4px;
  padding-left: 2px;
}

.home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(320px, 0.92fr);
  align-items: center;
  gap: 32px;
  margin: auto 0;
  padding: 12px 0 20px;
}
.home-hero-copy {
  position: relative;
  z-index: 2;
  max-width: 620px;
}
.hero-title-wrap {
  position: relative;
  display: inline-block;
  padding-top: 0;
}
.home-headline {
  margin: 0;
  font-family: var(--hero-font, "Fira Sans"), "Fira Sans", sans-serif;
  font-weight: 900;
  font-style: italic;
  font-size: clamp(42px, 5.2vw, 68px);
  line-height: 1.06;
  letter-spacing: -0.5px;
  color: #ffffff;
  transform: skewX(-2deg);
}
.home-headline .accent-red {
  display: block;
  color: var(--a);
  margin-top: 2px;
}
.hero-brush-underline {
  display: block;
  width: min(390px, 85%);
  height: 18px;
  margin-top: 6px;
  margin-left: 10px;
}
.home-subtext {
  font-family: var(--hero-font, "Fira Sans"), "Fira Sans", sans-serif;
  margin: 22px 0 32px;
  color: #cbd5e1;
  font-size: clamp(16px, 1.25vw, 19px);
  line-height: 1.65;
  max-width: 550px;
  font-weight: 400;
}
.home-cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
}
.home-cta {
  position: relative;
  display: inline-flex;
  padding: 0;
  padding-bottom: 5px;
  border: 0;
  background: transparent;
  cursor: pointer;
  user-select: none;
  font-family: "DM Sans", sans-serif;
  text-decoration: none;
  border-radius: 14px;
  outline: none;
}
.home-cta:focus-visible {
  outline: 2px solid var(--a);
  outline-offset: 4px;
}
.home-cta-base {
  position: absolute;
  inset-inline: 0;
  top: 5px;
  bottom: 0;
  border-radius: 14px;
  pointer-events: none;
}
.home-cta-face {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  height: 50px;
  padding: 0 28px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 15.5px;
  line-height: 1;
  transition: transform 0.12s cubic-bezier(0.23, 1, 0.32, 1);
}
.home-cta:hover .home-cta-face {
  transform: translateY(1.5px);
}
.home-cta:active .home-cta-face {
  transform: translateY(5px);
}
.home-cta.primary .home-cta-base {
  background: #9f1c22;
  box-shadow: inset 0 -1px 0 #6e1014;
}
.home-cta.primary .home-cta-face {
  background: #e24046;
  color: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.28), 0 2px 8px rgba(0, 0, 0, 0.25);
}
.home-cta.secondary .home-cta-base {
  background: #10141e;
  box-shadow: inset 0 -1px 0 #080a10;
}
.home-cta.secondary .home-cta-face {
  background: #1c2333;
  color: #f1f5f9;
  border: 1px solid #303c54;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.25);
}
.home-cta.secondary:hover .home-cta-face {
  color: #ffffff;
  border-color: #445474;
}
.home-cta svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.home-hero-art {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 520px;
  perspective: 1200px;
}
.mascot-aura {
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, #e2404624 0%, #f0ad5f1a 42%, transparent 72%);
  filter: blur(36px);
  pointer-events: none;
  animation: auraPulse 6s ease-in-out infinite alternate;
}
@keyframes auraPulse {
  0% {
    transform: scale(0.92);
    opacity: 0.65;
  }
  100% {
    transform: scale(1.08);
    opacity: 0.95;
  }
}
.mascot-canvas {
  width: 100%;
  max-width: 520px;
  height: 520px;
  display: block;
  cursor: grab;
  outline: none;
  filter: drop-shadow(0 20px 48px #000000ba);
}
.mascot-canvas:active {
  cursor: grabbing;
}

/* 3D SLANTED MODE CARDS (FROM IMAGE 2, WITH IMAGE 1 PALETTE) */
.home-modes-section {
  position: relative;
  z-index: 2;
  margin-top: 12px;
}
.home-modes-track {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(115px, 0.58fr);
  gap: 20px;
  align-items: stretch;
  padding-top: 64px;
}
.mode-3d-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 196px;
  padding: 20px 18px 18px;
  border-radius: 20px;
  background: linear-gradient(165deg, #212736 0%, #151924 100%);
  border: 1px solid #2d3548;
  color: #ffffff;
  text-align: left;
  transform: skewX(-6deg);
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s,
    box-shadow 0.22s;
  overflow: visible;
  box-shadow: 0 14px 32px #00000055;
}
.mode-3d-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 19px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, transparent 60%);
  pointer-events: none;
}
.mode-3d-card:hover {
  transform: skewX(-6deg) translateY(-8px);
  border-color: var(--card-accent, var(--a));
  box-shadow: 0 22px 48px #00000099;
}
.mode-3d-card.gold-glow:hover {
  --card-accent: var(--gold);
}
.mode-3d-inner {
  transform: skewX(6deg);
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: flex-end;
}
.mode-3d-figure {
  position: absolute;
  top: -64px;
  left: 50%;
  transform: translateX(-50%);
  width: 215px;
  height: 148px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.mode-3d-card:hover .mode-3d-figure {
  transform: translateX(-50%) translateY(-10px) scale(1.08);
}
.mode-3d-figure svg {
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 14px 22px #00000099);
}
.mode-3d-title {
  font-family: var(--brand-font, "Space Grotesk"), "Space Grotesk", sans-serif;
  font-weight: 800;
  font-style: italic;
  font-size: clamp(16px, 1.35vw, 20px);
  line-height: 1.06;
  letter-spacing: -0.4px;
  text-transform: uppercase;
  color: #ffffff;
  margin-top: 86px;
  text-shadow: 0 2px 10px #0009;
}
.mode-3d-title span {
  display: block;
  font-size: 0.86em;
  color: #f1f5f9;
  margin-top: 2px;
}
.mode-3d-Origin-stroke {
  display: block;
  width: 96px;
  height: 10px;
  margin-top: 6px;
}
.mode-3d-badge {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 3px 7px;
  border-radius: 6px;
  background: #111520cc;
  border: 1px solid #333d50;
  color: var(--gold);
  transform: skewX(6deg);
  z-index: 3;
}
.mode-3d-card.coming-soon {
  opacity: 0.72;
}
.mode-3d-card.coming-soon .mode-3d-figure {
  filter: grayscale(0.25) brightness(0.88);
}
.mode-3d-card.coming-soon:hover {
  transform: skewX(-6deg) translateY(-3px);
  border-color: #38455e;
}
.mode-3d-card.more-card {
  min-height: 196px;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(165deg, #1a1f2c 0%, #131721 100%);
  border-color: #252c3c;
}
.mode-3d-card.more-card:hover {
  border-color: #475569;
}
.more-card .mode-3d-inner {
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.more-plus {
  font-family: var(--brand-font, "Space Grotesk"), "Space Grotesk", sans-serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 1;
  color: #cbd5e1;
}
.more-label {
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;
  line-height: 1.35;
}

.home-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 22px;
}
.home-dot {
  width: 10px;
  height: 8px;
  border-radius: 99px;
  background: #363e4f;
  border: 0;
  padding: 0;
  transition:
    transform 0.2s,
    background 0.2s;
  cursor: pointer;
}
.home-dot.active {
  transform: scaleX(2.4);
  background: var(--a);
}

/* === GAME MODE STYLES === */
body.game-mode {
  background: var(--bg);
}
body.game-mode main {
  max-width: none;
  padding: 0 24px;
}
.game-mode header.topbar {
  position: relative;
  top: auto;
  right: auto;
  left: auto;
  height: 66px;
  border: 0;
  justify-content: flex-end;
}
.game-sound-toggle {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--panel);
  border: 1px solid var(--line-light);
  color: var(--gold);
  font-size: 22px;
}
.game-top {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 10px 8px 26px;
}
.game-back {
  width: 48px;
  height: 48px;
  border: 1px solid var(--line-light);
  border-radius: 14px;
  background: var(--panel);
  color: #f8fafc;
  font-size: 26px;
}
.game-progress {
  flex: 1;
}
.game-progress > div:first-child {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-family: "Space Grotesk";
  font-size: 14px;
}
.game-progress span {
  color: var(--muted);
  font-size: 12px;
}
.game-progress .progress {
  margin: 0;
  height: 6px;
}
.game-board {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 1fr) minmax(260px, 0.65fr);
  border: 1px solid var(--line-light);
  border-radius: 25px;
  overflow: hidden;
  background: #161b26;
  min-height: 780px;
}
.game-visual {
  padding: 24px;
  border-right: 1px solid var(--line);
  background: linear-gradient(145deg, #1c222e, #121620);
}
.photo-stage {
  height: 405px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.photo-badge {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--gold);
}
.game-photo {
  width: 100%;
  max-height: 350px;
  object-fit: contain;
  border-radius: 12px;
}
.game-damage {
  border: 1px solid var(--line-light);
  border-radius: 18px;
  padding: 18px;
  margin-top: 18px;
  background: var(--panel);
}
.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.panel-heading h3 {
  font-family: "Space Grotesk";
  font-size: 12px;
  letter-spacing: 1.2px;
  margin: 0;
}
.panel-heading > span {
  font-size: 10px;
  color: var(--muted);
}
.game-damage > img {
  width: 100%;
  height: 245px;
  object-fit: contain;
  border-radius: 10px;
}
.damage-summary {
  display: flex;
  gap: 16px;
  margin-top: 14px;
  color: var(--muted);
  font-size: 11px;
}
.damage-summary span {
  flex: 1;
}
.damage-summary b {
  display: block;
  color: #f8fafc;
  margin-top: 5px;
}
.game-details {
  padding: 40px 30px;
}
.game-eyebrow {
  color: var(--gold);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}
.game-details h1 {
  font-size: 27px;
  letter-spacing: -1px;
  line-height: 1.2;
  margin: 12px 0 23px;
}
.vehicle-rows > div {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 47px;
  border-bottom: 1px solid var(--line);
  padding: 10px 0;
}
.vehicle-rows span {
  color: var(--muted);
  letter-spacing: 0.7px;
  font-size: 10px;
  width: 110px;
  flex-shrink: 0;
}
.vehicle-rows b {
  font-size: 15px;
  font-weight: 500;
}
.guess-card {
  margin-top: 28px;
  padding: 22px;
  background: var(--panel);
  border: 1px solid var(--line-light);
  border-radius: 18px;
}
.guess-card h2 {
  font-size: 19px;
  margin: 12px 0 23px;
}
.guess-label {
  display: block;
  font-size: 11px;
  color: #cbd5e1;
  margin-bottom: 10px;
}
.currency-input {
  display: flex;
  align-items: center;
  background: #111520;
  border: 1px solid var(--line-light);
  border-radius: 11px;
  padding: 0 16px;
  gap: 12px;
}
.currency-input > span {
  font-size: 23px;
  color: var(--gold);
}
.currency-input input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: white;
  padding: 17px 0;
  font-family: "Space Grotesk";
  font-size: 21px;
}
.guess-card .btn {
  justify-content: space-between;
}
.guess-shortcuts {
  display: flex;
  gap: 10px;
  margin: 12px 0 18px;
}
.guess-multiplier {
  flex: 1;
  padding: 11px 12px;
  border: 1px solid var(--line-light);
  border-radius: 10px;
  background: #232b3a;
  color: #f8fafc;
  font-weight: 700;
  transition:
    background 0.15s,
    border-color 0.15s;
}
.guess-multiplier:hover {
  background: #2c3648;
  border-color: var(--gold);
}
.guess-multiplier small {
  display: block;
  font-size: 10px;
  color: var(--gold);
  font-weight: 400;
  margin-top: 4px;
}
.guess-card p {
  font-size: 10px;
  color: var(--muted);
  text-align: center;
  margin: 15px 0 0;
}
.game-footnote {
  color: #64748b;
  font-size: 10px;
  line-height: 1.7;
  margin-top: 20px;
}
.game-scores {
  border-left: 1px solid var(--line);
  padding: 30px 18px;
  background: #161b26;
}
.rank-card {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 13px 9px;
  border: 1px solid var(--line);
  background: var(--panel);
  border-radius: 12px;
  margin-bottom: 10px;
}
.rank-card.is-me {
  border-color: var(--a);
  background: #2b1d26;
}
.rank-number {
  font-size: 11px;
  color: var(--muted);
}
.rank-card > img {
  width: 30px;
  height: 30px;
  border-radius: 9px;
}
.rank-name {
  flex: 1;
  min-width: 0;
}
.rank-name strong {
  font-size: 12px;
  display: block;
  overflow-wrap: anywhere;
}
.rank-name small {
  color: var(--gold);
  font-size: 9px;
}
.rank-name > span {
  display: block;
  font-size: 9px;
  color: var(--muted);
  margin-top: 5px;
}
.rank-points {
  text-align: right;
}
.rank-points > b {
  color: var(--gold);
  font-family: "Space Grotesk";
  font-size: 20px;
}
.rank-points small {
  display: block;
  color: var(--muted);
  font-size: 8px;
  margin-top: 4px;
}
.score-tip {
  margin-top: 35px;
  display: flex;
  gap: 12px;
  align-items: center;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}
.score-tip > span {
  font-size: 25px;
  color: var(--gold);
}
.actual-price {
  background: #231f29;
  border: 1px solid #f0ad5f55;
  border-radius: 16px;
  padding: 22px;
  margin-top: 15px;
}
.actual-price span,
.result-tiles span {
  display: block;
  color: #cbd5e1;
  font-size: 10px;
}
.actual-price strong {
  display: block;
  font-family: "Space Grotesk";
  color: var(--gold);
  font-size: 37px;
  margin-top: 14px;
}
.reveal-label {
  color: var(--gold);
  margin-top: 28px;
  font-size: 12px;
  font-weight: 700;
}
.result-tiles {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.result-tiles > div {
  flex: 1;
  min-width: 0;
  background: var(--panel);
  border: 1px solid var(--line-light);
  border-radius: 12px;
  padding: 13px 9px;
}
.result-tiles b {
  display: block;
  margin-top: 12px;
  font-size: 13px;
}
.guess-confirmed {
  padding: 20px;
  color: var(--gold);
  text-align: center;
  font-weight: 700;
}
.game-board > .game-damage {
  grid-column: 1/3;
  grid-row: 2;
  margin: 0 24px 24px;
}
.game-board > .game-scores {
  grid-column: 3;
  grid-row: 1/3;
}
.game-board > .game-visual,
.game-board > .game-details {
  grid-row: 1;
}

@media (max-width: 1100px) {
  .home-modes-track {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 64px 20px;
    padding-top: 60px;
  }
  .mode-3d-card.more-card {
    grid-column: 1/-1;
    min-height: 100px;
  }
  .game-board {
    grid-template-columns: 1fr 1fr;
  }
  .game-scores {
    grid-column: 1/-1;
    border-left: 0;
    border-top: 1px solid var(--line);
  }
  .photo-stage {
    height: 350px;
  }
  .game-details {
    padding: 30px 22px;
  }
  .game-board > .game-scores {
    grid-column: 1/-1;
    grid-row: 3;
  }
}
@media (max-width: 820px) {
  .home-mode main {
    padding: 18px 20px 24px;
  }
  .home-hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 18px;
    padding: 16px 0;
  }
  .home-hero-copy {
    margin: 0 auto;
  }
  .hero-brush-underline {
    margin: 4px auto 0;
  }
  .home-subtext {
    margin: 14px auto 22px;
  }
  .home-cta-row {
    justify-content: center;
  }
  .mascot-canvas {
    max-width: 380px;
    height: 400px;
  }
  .roomlayout {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 700px) {
  header.topbar {
    top: 16px;
    right: 18px;
    gap: 8px;
  }
  .headeruser,
  .settings-button {
    padding: 6px 10px;
    font-size: 11px;
    height: 38px;
  }
  .headeruser small {
    display: none;
  }
  .ogz-brand {
    gap: 12px;
  }
  .ogz-brand-logo {
    height: 52px;
    max-width: 68px;
  }
  .ogz-brand-text strong {
    font-size: 34px;
  }
  .ogz-brand-text span {
    font-size: 11px;
    letter-spacing: 5.5px;
  }
  .ogz-brand-crown {
    width: 32px;
    height: 28px;
  }
  .home-modes-track {
    grid-template-columns: 1fr 1fr;
    gap: 56px 12px;
    padding-top: 46px;
  }
  .mode-3d-card {
    min-height: 165px;
    padding: 14px 12px 13px;
    transform: skewX(-3deg);
  }
  .mode-3d-card:hover {
    transform: skewX(-3deg) translateY(-4px);
  }
  .mode-3d-inner,
  .mode-3d-badge {
    transform: skewX(3deg);
  }
  .mode-3d-figure {
    width: 165px;
    height: 115px;
    top: -48px;
  }
  .mode-3d-title {
    font-size: 15px;
    margin-top: 62px;
  }
  .pagehead {
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 25px;
  }
  .pagehead h1 {
    font-size: 25px;
  }
  .pagehead .pill {
    display: none;
  }
  .room-tools {
    width: 100%;
    justify-content: space-between;
  }
  .room-tools .btn {
    font-size: 12px;
  }
  .code {
    font-size: 32px;
    letter-spacing: 6px;
  }
  .specs {
    grid-template-columns: 1fr 1fr;
  }
  .carphoto {
    height: 220px;
  }
  .box {
    padding: 20px;
  }
  .modal {
    padding: 24px;
  }
  body.game-mode main {
    padding: 0 12px;
  }
  .game-board {
    grid-template-columns: 1fr;
  }
  .game-visual {
    border-right: 0;
    padding: 16px;
  }
  .game-details {
    padding: 25px 20px;
  }
  .photo-stage {
    height: 290px;
  }
  .game-photo {
    max-height: 250px;
  }
  .game-top {
    gap: 12px;
  }
  .game-damage > img {
    height: 210px;
  }
  .game-progress > div:first-child > span {
    display: none;
  }
}
/* Keep the desktop home in one viewport, including shorter laptop windows. */
@media (min-width: 900px) {
  .home-mode main {
    height: 100svh;
    min-height: 0;
    max-width: 1440px;
    padding: clamp(10px, 2.4svh, 24px) clamp(24px, 3vw, 48px);
  }
  .home-mode #content {
    height: 100%;
    min-height: 0;
    display: grid;
    grid-template-rows: clamp(36px, 6svh, 48px) minmax(0, 1fr) clamp(150px, 28svh, 260px);
    gap: clamp(8px, 1.6svh, 18px);
  }
  .home-brand-row {
    min-height: 0;
  }
  .home-hero {
    height: 100%;
    min-height: 0;
    margin: 0;
    padding: 0;
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    gap: 24px;
  }
  .home-headline {
    font-size: clamp(30px, min(4.8vw, 7.8svh), 68px);
  }
  .hero-title-wrap {
    padding-top: 0;
  }
  .hero-brush-underline {
    height: clamp(10px, 2svh, 18px);
  }
  .home-subtext {
    font-size: clamp(13px, min(1.25vw, 2.5svh), 18px);
    margin: clamp(8px, 1.7svh, 18px) 0 clamp(12px, 2.5svh, 28px);
  }
  .home-cta-face {
    height: clamp(40px, 6svh, 50px);
    font-size: clamp(13px, 1.3vw, 15.5px);
    padding: 0 clamp(18px, 2.5vw, 28px);
  }
  .home-hero-art {
    height: 100%;
    min-height: 0;
    max-height: 560px;
  }
  .mascot-canvas {
    height: 100%;
    max-height: 560px;
    min-height: 0;
    max-width: 540px;
  }
  .mascot-aura {
    width: min(32vw, 44svh);
    height: min(32vw, 44svh);
  }
  .home-modes-section {
    height: 100%;
    min-height: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  .home-modes-track {
    min-height: 0;
    flex: 1;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: clamp(12px, 1.6vw, 20px);
    padding-top: clamp(30px, 6svh, 64px);
  }
  .mode-3d-card,
  .mode-3d-card.more-card {
    height: 100%;
    min-height: 0;
    grid-column: auto;
    padding: 12px 14px;
  }
  .mode-3d-figure {
    top: calc(-1 * clamp(30px, 6svh, 64px));
    width: min(100%, 215px);
    height: clamp(72px, 15svh, 148px);
  }
  .mode-3d-title {
    margin-top: 0;
    font-size: clamp(13px, min(1.35vw, 2.8svh), 20px);
  }
  .home-dots {
    flex-shrink: 0;
    margin-top: clamp(10px, 1.6svh, 18px);
  }
}
${finalStandingsStyles}
${mobileGameStyles}
${roundRankingStyles}
${desktopGameStyles}
${productGameStyles}
${modeCardStyles}
${auctionStyles || ''}
${numberRaceStyles || ''}
${battleshipStyles || ''}
${gameViewportStyles || ''}
${lobbyStyles}
</style></head><body>${foxWatermarkSvg}<main><header class="topbar"><span id="breadcrumb" class="hidden">Ana sayfa</span><button class="settings-button" onclick="showHow()" aria-label="Nasıl Oynanır?"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><span>Nasıl oynanır?</span></button><button class="headeruser" onclick="profileModal()" id="userbutton" aria-label="Profil"></button><button class="settings-button" onclick="settingsModal()"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m9 3-1 3-3 1-2 5 2 5 3 1 1 3h6l1-3 3-1 2-5-2-5-3-1-1-3z"/><circle cx="12" cy="12" r="3"/></svg><span>Ayarlar</span></button></header><div id="content"></div></main><div id="overlay"></div><div id="toast" class="toast hidden" role="status"></div><script>
${finalStandingsClient}
${gameAudioClient}
${guessInputClient}
${productGameClient}
${modeCardClient}
${mobileGameClient}
${roundRankingClient}
${auctionClient || ''}
${numberRaceClient || ''}
${battleshipClient || ''}

${validProfile.toString()}
const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat('tr-TR').format(n) + ' ₺';
const esc = s =>
  String(s).replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );
let profile;
try {
  profile = JSON.parse(localStorage.getItem('ogz-profile'));
} catch {}
if (!validProfile(profile)) profile = null;
let token = localStorage.getItem('ogz-token');
if (!token) {
  token = crypto.randomUUID();
  localStorage.setItem('ogz-token', token);
}
let room = null,
  rounds = 10,
  selected = profile?.avatar || 'a0',
  afterProfile = null,
  poll = null,
  busy = false,
  editingProfile = false,
  guessSeconds = 30,
  timer = null,
  clockOffset = 0;
const characterNames = [
  'Astronot',
  'Tilki',
  'Robot',
  'Ninja',
  'Kıvırcık',
  'Kaptan',
  'Kedi',
  'Punk',
  'Büyücü',
  'Kurbağa',
];
function avatar(a) {
  if (a?.startsWith('data:')) return a;
  const i = Number(a?.slice(1) || 0);
  const bg = [
    '#152b50',
    '#493043',
    '#183d39',
    '#302c50',
    '#493b2d',
    '#23434b',
    '#49304c',
    '#28395a',
    '#3a2858',
    '#264839',
  ][i];
  const art = [
    '<path d="M21 100V80q0-18 29-18t29 18v20" fill="#e8edf6"/><path d="M35 80h30v20H35" fill="#c5d0e0"/><circle cx="50" cy="43" r="34" fill="#f0f4fa"/><rect x="21" y="23" width="58" height="42" rx="21" fill="#132e48"/><path d="M29 37q9-15 28-8" stroke="#70e9e1" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="65" cy="48" r="5" fill="#49d9c5"/><rect x="44" y="82" width="13" height="9" rx="2" fill="#f9ae55"/>',
    '<path d="M19 99q0-27 31-28t31 28" fill="#e38338"/><path d="M19 43 14 9l28 16M81 43 86 9 58 25" fill="#ee9749"/><path d="m22 29-2-11 14 9m44 2 2-11-14 9" fill="#61373b"/><path d="M17 41q33-34 66 0l-8 29-25 16-25-16z" fill="#f1a052"/><path d="m23 50 27 14 27-14-10 23-17 9-17-9" fill="#fff0d6"/><path d="m32 43 8 3m20 0 8-3" stroke="#342d36" stroke-width="4" stroke-linecap="round"/><path d="m44 60 6 6 6-6" fill="#342d36"/>',
    '<path d="M19 100V81q0-11 31-11t31 11v19" fill="#599eaa"/><path d="M50 10V2" stroke="#f5bd55" stroke-width="4"/><circle cx="50" cy="7" r="5" fill="#f5bd55"/><rect x="17" y="18" width="66" height="57" rx="16" fill="#9be0da"/><rect x="10" y="35" width="8" height="23" rx="3" fill="#599eaa"/><rect x="82" y="35" width="8" height="23" rx="3" fill="#599eaa"/><rect x="25" y="29" width="50" height="27" rx="8" fill="#173c45"/><circle cx="37" cy="42" r="5" fill="#ffcb61"/><circle cx="63" cy="42" r="5" fill="#ffcb61"/><path d="M38 64h24" stroke="#386875" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="88" r="7" fill="#f5bd55"/>',
    '<path d="M13 100q3-29 37-29t37 29" fill="#252736"/><ellipse cx="50" cy="44" rx="30" ry="34" fill="#252736"/><path d="M23 35q27-15 54 0v19H23" fill="#edba9b"/><path d="m32 40 10 3m16 0 10-3" stroke="#252736" stroke-width="4" stroke-linecap="round"/><path d="M21 26h58v10H21" fill="#eb626c"/><path d="m77 28 20-7-7 17 8 11-22-12" fill="#eb626c"/><path d="M35 80 64 99M65 80 36 99" stroke="#51536a" stroke-width="7"/>',
    '<path d="M12 100q3-28 38-28t38 28" fill="#e4ad4c"/><rect x="43" y="64" width="14" height="18" rx="5" fill="#965e40"/><ellipse cx="50" cy="46" rx="25" ry="29" fill="#ad7651"/><g fill="#312527"><circle cx="23" cy="28" r="13"/><circle cx="30" cy="17" r="13"/><circle cx="47" cy="15" r="14"/><circle cx="64" cy="17" r="14"/><circle cx="76" cy="29" r="13"/><circle cx="37" cy="28" r="13"/><circle cx="59" cy="27" r="13"/></g><path d="M35 48h4m22 0h4" stroke="#302426" stroke-width="4" stroke-linecap="round"/><path d="M39 61q11 13 22 0" fill="#fff2df"/><circle cx="24" cy="57" r="4" fill="#f8ca62"/><circle cx="76" cy="57" r="4" fill="#f8ca62"/>',
    '<path d="M13 100q2-30 37-30t37 30" fill="#e6e9d8"/><path d="m32 76 18 18 18-18" fill="#264451"/><ellipse cx="50" cy="44" rx="26" ry="29" fill="#e6b28e"/><path d="M26 46q-2 34 24 35t24-35L64 57H36" fill="#7a4f3b"/><path d="M22 29 18 12q32-17 64 0l-4 17z" fill="#e6e9d8"/><path d="M22 26h56v11q-28 9-56 0z" fill="#203d4e"/><path d="m44 17 6 5 6-5" stroke="#e8b753" stroke-width="3" fill="none"/><circle cx="39" cy="46" r="2.5" fill="#24333b"/><circle cx="61" cy="46" r="2.5" fill="#24333b"/><path d="M44 63h12" stroke="#e9b28e" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M18 100V81q2-13 32-13t32 13v19" fill="#bdabd7"/><path d="m20 42 1-32 27 20 28-20 4 32v23Q50 89 20 65z" fill="#c6b3dc"/><path d="m26 31 1-11 12 10m22 0 12-10 1 11" fill="#edb9c9"/><path d="m32 47 9-3m18 0 9 3" stroke="#493e5c" stroke-width="4" stroke-linecap="round"/><path d="m45 56 5 5 5-5" fill="#bd738e"/><path d="M50 61v5m0-1-7 3m7-3 7 3M15 55l18 3M12 64h20m36-6 18-3m-18 9h20" stroke="#766180" stroke-width="2" stroke-linecap="round"/>',
    '<path d="M12 100q1-28 38-28t38 28" fill="#252c42"/><path d="m34 76 16 15 16-15" fill="#96bfbc"/><ellipse cx="50" cy="46" rx="25" ry="29" fill="#d3a892"/><path d="M25 44V32q0-19 25-19t25 19v12L64 29H36" fill="#25304a"/><path d="m36 26 2-19 10 7 8-13 8 22" fill="#f07cae"/><path d="m30 38 17 2-3 11H33zm23 2 17-2-3 13H56" fill="#26364d"/><path d="M47 42h6" stroke="#26364d" stroke-width="4"/><path d="M43 61q8 5 16-1" stroke="#774655" stroke-width="3" fill="none"/><circle cx="74" cy="55" r="5" fill="none" stroke="#f5c45c" stroke-width="3"/>',
    '<path d="M13 100q3-29 37-29t37 29" fill="#7057a9"/><ellipse cx="50" cy="48" rx="24" ry="27" fill="#e7bc98"/><path d="M24 48q-8 42 26 40t26-40L63 61H37" fill="#e4d9f1"/><path d="m26 31 17-29 18 9 13 21" fill="#8e72c8"/><path d="M16 33q34-13 68 0v8H16z" fill="#a083db"/><path d="m51 15 2 5 6 1-5 3 1 6-5-4-5 3 1-6-4-3 6-1z" fill="#f6dc87"/><circle cx="39" cy="48" r="2.5" fill="#49405b"/><circle cx="61" cy="48" r="2.5" fill="#49405b"/><path d="M43 63h14" stroke="#917092" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M16 100V82q0-16 34-16t34 16v18" fill="#91bf69"/><ellipse cx="50" cy="49" rx="36" ry="29" fill="#91bf69"/><circle cx="29" cy="27" r="16" fill="#91bf69"/><circle cx="71" cy="27" r="16" fill="#91bf69"/><circle cx="29" cy="27" r="10" fill="#f4f0cf"/><circle cx="71" cy="27" r="10" fill="#f4f0cf"/><circle cx="31" cy="28" r="5" fill="#253c37"/><circle cx="69" cy="28" r="5" fill="#253c37"/><path d="M30 55q20 21 40 0" stroke="#335e40" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="48" rx="7" ry="4" fill="#c4ab77"/><ellipse cx="76" cy="48" rx="7" ry="4" fill="#c4ab77"/><path d="m36 79 14 9 14-9v17H36z" fill="#f2c75d"/>',
  ];
  return (
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="' +
        bg +
        '"/>' +
        art[i] +
        '</svg>'
    )
  );
}

function user() {
  $('#userbutton').innerHTML =
    '<img alt="Profil resmi" src="' +
    avatar(profile?.avatar || 'a0') +
    '"><span>' +
    (profile?.name ? esc(profile.name) : 'Profil') +
    '</span>';
}
function toast(s) {
  $('#toast').textContent = s;
  $('#toast').classList.remove('hidden');
  setTimeout(() => $('#toast').classList.add('hidden'), 4500);
}
function roomCodeFromPath(path = location.pathname) {
  return /^\/oda\/([a-f0-9]{6})\/?$/i.exec(path)?.[1].toUpperCase() || null;
}
function roomLink(code) {
  return location.origin + '/oda/' + code.toUpperCase();
}
function syncRoomUrl() {
  if (!room?.code) return;
  const path = '/oda/' + room.code;
  if (location.pathname !== path) {
    if (roomCodeFromPath() === room.code) history.replaceState(null, '', path);
    else history.pushState(null, '', path);
  }
  document.title = 'OGZ Game · Oda ' + room.code;
}
function resetRoomUrl() {
  if (location.pathname !== '/' || location.search || location.hash)
    history.replaceState(null, '', '/');
  document.title = 'OGZ Game — Tahminin konuşsun.';
}
function openRoomLink(code) {
  if (room?.code === code) return;
  requireProfile(() => enterRoom('join', code));
}
async function copyRoomLink() {
  if (!room?.code) return;
  const link = roomLink(room.code);
  try {
    await navigator.clipboard.writeText(link);
    toast('Oda bağlantısı kopyalandı.');
  } catch {
    toast(link);
  }
}
window.addEventListener('popstate', () => {
  if (roomCodeFromPath() !== room?.code) location.reload();
});
function openModeRoom(mode = 'car-price') {
  requireProfile(() => createLobby(mode));
}
async function createLobby(mode = 'car-price') {
  if (busy) return;
  busy = true;
  try {
    const options = {
      profile,
      mode,
      rounds: settings.rounds,
      guessSeconds: 30,
      gridSize: mode === 'number-race' ? 6 : undefined,
      categories: mode === 'product-price' ? 'mixed' : undefined,
    };
    if (mode === 'auction') {
      const result = await call('auction-categories');
      options.category = result.categories.find(c => c.available >= 10)?.id;
      if (!options.category) throw Error('Henüz oynanabilir bir açık artırma kategorisi yok.');
    }
    room = await call('create', options);
    $('#overlay').innerHTML = '';
    renderRoom();
    clearInterval(poll);
    poll = setInterval(refresh, ['number-race', 'battleship'].includes(room.mode) ? 500 : 2000);
  } catch (e) {
    toast(e.message);
  } finally {
    busy = false;
  }
}

function build3DFox(THREE) {
  const foxGroup = new THREE.Group();
  const orangeMat = new THREE.MeshStandardMaterial({
    color: 0xf07d2c,
    roughness: 0.45,
    metalness: 0.05,
  });
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xfdf7ee,
    roughness: 0.5,
    metalness: 0.02,
  });
  const tongueMat = new THREE.MeshStandardMaterial({ color: 0xf45e76, roughness: 0.3 });
  const blackGloss = new THREE.MeshStandardMaterial({
    color: 0x121016,
    roughness: 0.1,
    metalness: 0.1,
  });
  const eyeWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const hoodieNavy = new THREE.MeshStandardMaterial({
    color: 0x241c30,
    roughness: 0.6,
    metalness: 0.05,
  });
  const hoodRed = new THREE.MeshStandardMaterial({
    color: 0xe24046,
    roughness: 0.4,
    metalness: 0.1,
  });
  const goldCrownMat = new THREE.MeshStandardMaterial({
    color: 0xf0ad5f,
    roughness: 0.25,
    metalness: 0.6,
    emissive: 0xf0ad5f,
    emissiveIntensity: 0.4,
  });
  const headphoneGrey = new THREE.MeshStandardMaterial({
    color: 0x2f263d,
    roughness: 0.35,
    metalness: 0.3,
  });

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.35, 0);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 28), orangeMat);
  skull.scale.set(1.18, 1.0, 1.05);
  headGroup.add(skull);

  const cheekGeo = new THREE.ConeGeometry(0.42, 0.65, 16);
  const leftCheek = new THREE.Mesh(cheekGeo, creamMat);
  leftCheek.position.set(-0.76, -0.25, 0.38);
  leftCheek.rotation.set(0.3, 0.2, 1.3);
  leftCheek.scale.set(1, 0.7, 0.9);
  headGroup.add(leftCheek);
  const rightCheek = leftCheek.clone();
  rightCheek.position.set(0.76, -0.25, 0.38);
  rightCheek.rotation.set(0.3, -0.2, -1.3);
  headGroup.add(rightCheek);

  const cheekFillGeo = new THREE.SphereGeometry(0.42, 20, 16);
  const cheekFillL = new THREE.Mesh(cheekFillGeo, creamMat);
  cheekFillL.position.set(-0.45, -0.28, 0.55);
  cheekFillL.scale.set(1.2, 0.75, 0.85);
  headGroup.add(cheekFillL);
  const cheekFillR = cheekFillL.clone();
  cheekFillR.position.x = 0.45;
  headGroup.add(cheekFillR);

  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 20), creamMat);
  snout.position.set(0, -0.22, 0.72);
  snout.scale.set(1.05, 0.75, 0.85);
  headGroup.add(snout);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), blackGloss);
  nose.position.set(0, -0.12, 0.98);
  nose.scale.set(1.15, 0.85, 0.8);
  headGroup.add(nose);

  const mouthBack = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), blackGloss);
  mouthBack.position.set(0, -0.26, 0.88);
  mouthBack.scale.set(1.1, 0.85, 0.6);
  headGroup.add(mouthBack);

  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 14), tongueMat);
  tongue.position.set(0, -0.28, 0.92);
  tongue.scale.set(1.0, 0.45, 0.8);
  headGroup.add(tongue);

  function createEye(x) {
    const eyeWrap = new THREE.Group();
    eyeWrap.position.set(x, 0.04, 0.68);
    eyeWrap.rotation.y = x > 0 ? 0.18 : -0.18;
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 20), blackGloss);
    eye.scale.set(0.9, 1.05, 0.35);
    eyeWrap.add(eye);
    const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), eyeWhite);
    h1.position.set(x > 0 ? 0.07 : 0.05, 0.11, 0.18);
    eyeWrap.add(h1);
    const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), eyeWhite);
    h2.position.set(x > 0 ? -0.09 : -0.11, -0.11, 0.18);
    eyeWrap.add(h2);
    const brow = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 12), creamMat);
    brow.position.set(x > 0 ? -0.02 : 0.02, 0.38, 0.1);
    brow.scale.set(1.1, 0.65, 0.4);
    brow.rotation.z = x > 0 ? -0.15 : 0.15;
    eyeWrap.add(brow);
    return eyeWrap;
  }
  headGroup.add(createEye(-0.38));
  headGroup.add(createEye(0.38));

  const tuftGroup = new THREE.Group();
  tuftGroup.position.set(0, 0.85, 0.35);
  tuftGroup.rotation.x = 0.35;
  const t1 = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.38, 12), orangeMat);
  tuftGroup.add(t1);
  const t2 = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.3, 10), orangeMat);
  t2.position.set(-0.12, -0.04, -0.02);
  t2.rotation.z = 0.35;
  tuftGroup.add(t2);
  const t3 = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.3, 10), orangeMat);
  t3.position.set(0.12, -0.04, -0.02);
  t3.rotation.z = -0.35;
  tuftGroup.add(t3);
  headGroup.add(tuftGroup);

  function createEar(side) {
    const ear = new THREE.Group();
    ear.position.set(side * 0.62, 0.74, -0.05);
    ear.rotation.set(-0.15, side * -0.12, side * -0.42);
    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.88, 20), orangeMat);
    outer.scale.set(1.0, 1.0, 0.45);
    ear.add(outer);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.75, 16), creamMat);
    inner.position.set(0, -0.04, 0.08);
    inner.scale.set(0.85, 0.95, 0.3);
    ear.add(inner);
    return ear;
  }
  const earL = createEar(-1),
    earR = createEar(1);
  headGroup.add(earL);
  headGroup.add(earR);

  const band = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.085, 16, 32, Math.PI), headphoneGrey);
  band.position.set(0, 0.22, 0.02);
  band.rotation.x = 0.08;
  headGroup.add(band);

  function createEarcup(side) {
    const cup = new THREE.Group();
    cup.position.set(side * 0.98, 0.16, 0.08);
    cup.rotation.set(0, side * 0.15, (side * -Math.PI) / 2);
    const cMain = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.22, 24), headphoneGrey);
    cup.add(cMain);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.035, 14, 28), hoodRed);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08;
    cup.add(ring);
    const crownBadge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16),
      goldCrownMat
    );
    crownBadge.position.y = 0.11;
    cup.add(crownBadge);
    return cup;
  }
  headGroup.add(createEarcup(-1));
  headGroup.add(createEarcup(1));
  foxGroup.add(headGroup);

  const bodyGroup = new THREE.Group();
  bodyGroup.position.set(0, 0.42, 0);
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.78, 28, 24), hoodieNavy);
  torso.scale.set(1.0, 1.15, 0.92);
  bodyGroup.add(torso);

  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.22, 16, 32), hoodRed);
  collar.position.set(0, 0.65, 0.04);
  collar.rotation.x = Math.PI / 2 - 0.2;
  bodyGroup.add(collar);

  function createString(x) {
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.36, 10), creamMat);
    s.position.set(x, 0.42, 0.68);
    s.rotation.set(-0.2, 0, x > 0 ? -0.1 : 0.1);
    return s;
  }
  bodyGroup.add(createString(-0.14));
  bodyGroup.add(createString(0.14));

  const chestCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 16), goldCrownMat);
  chestCrown.position.set(0, 0.26, 0.75);
  chestCrown.rotation.x = Math.PI / 2 - 0.25;
  bodyGroup.add(chestCrown);

  function createFrontPaw(x) {
    const leg = new THREE.Group();
    leg.position.set(x, -0.32, 0.52);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.035, 12, 20), hoodRed);
    cuff.rotation.x = Math.PI / 2;
    cuff.position.y = 0.2;
    leg.add(cuff);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.14, 0.26, 16), orangeMat);
    upper.position.y = 0.08;
    leg.add(upper);
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 14), creamMat);
    foot.position.set(0, -0.12, 0.05);
    foot.scale.set(0.95, 0.75, 1.25);
    leg.add(foot);
    return leg;
  }
  bodyGroup.add(createFrontPaw(-0.28));
  bodyGroup.add(createFrontPaw(0.28));

  function createHindLeg(side) {
    const hind = new THREE.Mesh(new THREE.SphereGeometry(0.35, 18, 16), orangeMat);
    hind.position.set(side * 0.58, -0.35, 0.1);
    hind.scale.set(0.85, 0.8, 1.15);
    return hind;
  }
  bodyGroup.add(createHindLeg(-1));
  bodyGroup.add(createHindLeg(1));

  const tailGroup = new THREE.Group();
  tailGroup.position.set(-0.52, -0.28, -0.35);
  const tBase = new THREE.Mesh(new THREE.SphereGeometry(0.32, 18, 16), orangeMat);
  tBase.scale.set(1.0, 1.1, 1.3);
  tailGroup.add(tBase);
  const tMid = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 18), orangeMat);
  tMid.position.set(-0.25, 0.22, -0.1);
  tMid.scale.set(1.0, 1.2, 1.25);
  tailGroup.add(tMid);
  const tTip = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.62, 18), creamMat);
  tTip.position.set(-0.38, 0.58, -0.05);
  tTip.rotation.set(-0.1, 0, 0.52);
  tTip.scale.set(1.0, 1.0, 0.9);
  tailGroup.add(tTip);
  bodyGroup.add(tailGroup);
  foxGroup.add(bodyGroup);

  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 2.75, 0);
  const crownBase = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.045, 14, 28), goldCrownMat);
  crownBase.rotation.x = Math.PI / 2;
  crownGroup.add(crownBase);
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2,
      isCenter = i === 0,
      isMid = i === 1 || i === 4,
      height = isCenter ? 0.35 : isMid ? 0.26 : 0.2;
    const point = new THREE.Mesh(new THREE.ConeGeometry(0.065, height, 10), goldCrownMat);
    const radius = 0.36;
    point.position.set(Math.sin(angle) * radius, height / 2 + 0.02, Math.cos(angle) * radius);
    point.rotation.set(Math.cos(angle) * 0.2, 0, -Math.sin(angle) * 0.2);
    crownGroup.add(point);
    const jewel = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), eyeWhite);
    jewel.position.set(
      Math.sin(angle) * (radius + 0.02),
      height + 0.04,
      Math.cos(angle) * (radius + 0.02)
    );
    crownGroup.add(jewel);
  }
  foxGroup.add(crownGroup);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 1.45, 0.06, 36),
    new THREE.MeshStandardMaterial({ color: 0x22182c, roughness: 0.6, metalness: 0.2 })
  );
  pedestal.position.set(0, -0.03, 0);
  foxGroup.add(pedestal);
  const pedRim = new THREE.Mesh(new THREE.TorusGeometry(1.44, 0.03, 14, 36), goldCrownMat);
  pedRim.rotation.x = Math.PI / 2;
  pedRim.position.y = 0.01;
  foxGroup.add(pedRim);

  return { foxGroup, headGroup, earL, earR, tailGroup, crownGroup };
}

let foxAnimId = null,
  foxRenderer = null;
function init3DFox() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (typeof THREE === 'undefined') {
    if (!document.getElementById('three-script')) {
      const s = document.createElement('script');
      s.id = 'three-script';
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      s.onload = () => init3DFox();
      document.head.appendChild(s);
    }
    return;
  }
  const canvas = document.getElementById('mascotCanvas');
  if (!canvas) return;
  if (foxAnimId) {
    cancelAnimationFrame(foxAnimId);
    foxAnimId = null;
  }
  if (foxRenderer) {
    foxRenderer.dispose();
    foxRenderer = null;
  }
  const width = canvas.clientWidth || 500,
    height = canvas.clientHeight || 520;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 1.5, 6.2);
  camera.lookAt(0, 1.42, 0);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  foxRenderer = renderer;
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const canvasResize = new ResizeObserver(() => {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    camera.fov = aspect < 0.9 ? 40 / (aspect / 0.9) : 40;
    camera.updateProjectionMatrix();
  });
  canvasResize.observe(canvas);
  renderer.shadowMap.enabled = true;

  scene.add(new THREE.AmbientLight(0xfff5ea, 0.75));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
  dirLight.position.set(3, 6, 4);
  dirLight.castShadow = true;
  scene.add(dirLight);
  const crownLight = new THREE.PointLight(0xf0ad5f, 1.6, 6);
  crownLight.position.set(0, 2.8, 0.5);
  scene.add(crownLight);
  const rimLight = new THREE.DirectionalLight(0xa855f7, 0.6);
  rimLight.position.set(-3, 3, -3);
  scene.add(rimLight);

  const { foxGroup, headGroup, earL, earR, tailGroup, crownGroup } = build3DFox(THREE);
  scene.add(foxGroup);

  let mouseX = 0,
    mouseY = 0,
    targetHeadRotY = 0,
    targetHeadRotX = 0,
    isDragging = false,
    prevDragX = 0,
    dragRotY = 0,
    jumpTime = 0,
    isJumping = false;
  const dragMove = e => {
    if (isDragging) {
      dragRotY = Math.max(-0.65, Math.min(0.65, dragRotY + (e.clientX - prevDragX) * 0.005));
      prevDragX = e.clientX;
    }
  };
  const stage = document.getElementById('hero-art-stage');
  if (stage) {
    stage.onmousemove = e => {
      const rect = stage.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetHeadRotY = mouseX * 0.45;
      targetHeadRotX = -mouseY * 0.32;
    };
    stage.onmouseleave = () => {
      targetHeadRotY = 0;
      targetHeadRotX = 0;
    };
    stage.onmousedown = e => {
      isDragging = true;
      prevDragX = e.clientX;
    };
    window.onmouseup = () => {
      isDragging = false;
    };
    window.addEventListener('mousemove', dragMove);
    stage.onclick = () => {
      if (!isJumping) {
        isJumping = true;
        jumpTime = 0;
      }
    };
  }

  let clock = 0;
  function animate() {
    if (!canvas.isConnected) {
      window.removeEventListener('mousemove', dragMove);
      canvasResize.disconnect();
      scene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          for (const mat of [obj.material].flat()) mat.dispose();
        }
      });
      renderer.dispose();
      if (foxRenderer === renderer) foxRenderer = null;
      foxAnimId = null;
      return;
    }
    foxAnimId = requestAnimationFrame(animate);
    if (document.hidden) return;
    clock += 0.016;
    headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.08;
    headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.08;
    crownGroup.position.y = 2.75 + Math.sin(clock * 2) * 0.05;
    crownGroup.rotation.y += 0.012;
    tailGroup.rotation.y = Math.sin(clock * 1.5) * 0.22;
    tailGroup.rotation.z = Math.cos(clock * 1.5) * 0.08;
    earL.rotation.z = -0.42 + Math.sin(clock * 1.8) * 0.03;
    earR.rotation.z = 0.42 - Math.sin(clock * 1.8) * 0.03;
    foxGroup.position.y = Math.sin(clock) * 0.03;
    const autoSweep = Math.sin(clock * 0.45) * 0.55;
    const targetBodyY = isDragging ? dragRotY : autoSweep;
    foxGroup.rotation.y += (targetBodyY - foxGroup.rotation.y) * 0.05;
    if (!isDragging) dragRotY += (autoSweep - dragRotY) * 0.04;
    if (isJumping) {
      jumpTime += 0.08;
      foxGroup.position.y += Math.sin(jumpTime * Math.PI) * 0.22;
      if (jumpTime >= 1) {
        isJumping = false;
        jumpTime = 0;
      }
    }
    renderer.render(scene, camera);
  }
  animate();
}


function home() {
  resetMobileRoundRanking();
  document.body.classList.remove('game-mode', 'product-game', 'lobby-mode');
  document.body.classList.remove('number-active', 'battleship-active');
  document.body.classList.add('home-mode');
  $('#breadcrumb').textContent = 'Ana sayfa';
  $('#content').innerHTML = [
    '<svg class="home-wave-bl" viewBox="0 0 540 240" fill="none" aria-hidden="true">',
    '<defs>',
    '<linearGradient id="blGradBack" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#24131d" stop-opacity=".75"/><stop offset="100%" stop-color="#140f18" stop-opacity="0"/></linearGradient>',
    '<linearGradient id="blGradMain" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0%" stop-color="#3b1524"/><stop offset="60%" stop-color="#22111c"/><stop offset="100%" stop-color="#120e17"/></linearGradient>',
    '<linearGradient id="blGlowStroke" x1="0" y1="0" x2="1" y2="0.8"><stop offset="0%" stop-color="#ff4d6d"/><stop offset="40%" stop-color="#e24046"/><stop offset="85%" stop-color="#9f1239" stop-opacity=".4"/><stop offset="100%" stop-color="#e24046" stop-opacity="0"/></linearGradient>',
    '<linearGradient id="blAccentStroke" x1="0" y1="0" x2="1" y2="0.6"><stop offset="0%" stop-color="#e24046" stop-opacity=".7"/><stop offset="100%" stop-color="#e24046" stop-opacity="0"/></linearGradient>',
    '</defs>',
    '<path d="M0 60C140 30 280 110 440 180C480 198 510 216 540 240H0V60Z" fill="url(#blGradBack)"/>',
    '<path d="M0 95C120 70 250 140 400 200C450 216 495 228 540 240H0V95Z" fill="url(#blGradMain)"/>',
    '<path d="M0 95C120 70 250 140 400 200C450 216 495 228 540 240" stroke="url(#blGlowStroke)" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M0 145C95 125 190 170 310 215C365 228 420 236 470 240H0V145Z" fill="#2d121f" opacity=".5"/>',
    '<path d="M0 145C95 125 190 170 310 215C365 228 420 236 470 240" stroke="url(#blAccentStroke)" stroke-width="1.8" stroke-linecap="round"/>',
    '</svg>',
    '<svg class="home-wave-br" viewBox="0 0 580 240" fill="none" aria-hidden="true">',
    '<defs>',
    '<linearGradient id="brGradBack" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#26141f" stop-opacity=".75"/><stop offset="100%" stop-color="#140f18" stop-opacity="0"/></linearGradient>',
    '<linearGradient id="brGradMain" x1="1" y1="0" x2="0.2" y2="1"><stop offset="0%" stop-color="#3d1626"/><stop offset="60%" stop-color="#24111d"/><stop offset="100%" stop-color="#120e17"/></linearGradient>',
    '<linearGradient id="brGlowStroke" x1="1" y1="0" x2="0" y2="0.8"><stop offset="0%" stop-color="#ff4d6d"/><stop offset="40%" stop-color="#e24046"/><stop offset="85%" stop-color="#9f1239" stop-opacity=".4"/><stop offset="100%" stop-color="#e24046" stop-opacity="0"/></linearGradient>',
    '<linearGradient id="brAccentStroke" x1="1" y1="0" x2="0" y2="0.6"><stop offset="0%" stop-color="#e24046" stop-opacity=".7"/><stop offset="100%" stop-color="#e24046" stop-opacity="0"/></linearGradient>',
    '</defs>',
    '<path d="M580 45C440 25 295 105 140 180C95 200 50 220 0 240H580V45Z" fill="url(#brGradBack)"/>',
    '<path d="M580 80C450 60 310 135 155 198C105 215 55 228 0 240H580V80Z" fill="url(#brGradMain)"/>',
    '<path d="M580 80C450 60 310 135 155 198C105 215 55 228 0 240" stroke="url(#brGlowStroke)" stroke-width="3" stroke-linecap="round"/>',
    '<path d="M580 135C475 115 360 168 220 215C160 228 95 236 40 240H580V135Z" fill="#301321" opacity=".5"/>',
    '<path d="M580 135C475 115 360 168 220 215C160 228 95 236 40 240" stroke="url(#brAccentStroke)" stroke-width="1.8" stroke-linecap="round"/>',
    '</svg>',
    '<div class="home-brand-row">',
    '<div class="ogz-brand" aria-label="OGZ Game">',
    '<img class="ogz-brand-logo" src="/logo.png" alt="OGZ Game" onerror="if(!this.dataset.retried){this.dataset.retried=1;this.src=\'logo.png\';}else{this.style.display=\'none\';}">',
    '<div class="ogz-brand-text"><strong>OGZ</strong><span>GAME</span></div>',
    '</div>',
    '</div>',
    '<section class="home-hero">',
    '<div class="home-hero-copy">',
    '<div class="hero-title-wrap">',
    '<h1 class="home-headline">Arkadaşlarınla<br>Tahmin Et,<span class="accent-red">Yarış, Eğlen!</span></h1>',
    '<svg class="hero-brush-underline" viewBox="0 0 340 20" fill="none" aria-hidden="true">',
    '<path d="M4 13C88 4 218 4 336 15" stroke="#e24046" stroke-width="4.5" stroke-linecap="round"/>',
    '<path d="M42 17C128 11 225 11 312 16" stroke="#e24046" stroke-width="2" stroke-linecap="round" opacity=".6"/>',
    '</svg>',
    '</div>',
    '<p class="home-subtext">OGZ Game, arkadaşlarınla birlikte oynayabileceğin çok oyunculu, Türkçe tahmin ve parti oyunları platformudur.</p>',
    '<div class="home-cta-row">',
    '<button type="button" class="home-cta primary" onclick="requireProfile(joinModal)">',
    '<span class="home-cta-base"></span>',
    '<span class="home-cta-face">',
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5.5v13l11-6.5-11-6.5z"/></svg>',
    '<span>Hemen Oyna</span>',
    '</span>',
    '</button>',
    '<button type="button" class="home-cta secondary" onclick="openModeRoom(\'car-price\')">',
    '<span class="home-cta-base"></span>',
    '<span class="home-cta-face">',
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
    '<span>Oda Kur</span>',
    '</span>',
    '</button>',
    '</div>',
    '</div>',
    '<div class="home-hero-art" id="hero-art-stage">',
    '<div class="mascot-aura" aria-hidden="true"></div>',
    '<canvas id="mascotCanvas" class="mascot-canvas" role="img" aria-label="OGZ 3D Tilki Maskotu"></canvas>',
    '</div>',
    '</section>',
    '<section class="home-modes-section" aria-label="Oyun Modları">',
    '<div class="home-modes-track">',
    '<button type="button" class="mode-3d-card" onclick="openModeRoom(\'car-price\')">',
    '<div class="mode-3d-inner">',
    '<div class="mode-3d-figure" aria-hidden="true">',
    '<svg viewBox="0 0 220 135" fill="none">',
    '<defs>',
    '<linearGradient id="carBody" x1="20" y1="25" x2="195" y2="110" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#38465e"/><stop offset="48%" stop-color="#1e2636"/><stop offset="100%" stop-color="#0f131d"/></linearGradient>',
    '<linearGradient id="carGlass" x1="65" y1="30" x2="155" y2="70" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#64748b"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>',
    '<radialGradient id="headlightGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="45%" stop-color="#bae6fd"/><stop offset="100%" stop-color="#e24046" stop-opacity="0"/></radialGradient>',
    '</defs>',
    '<ellipse cx="110" cy="108" rx="88" ry="14" fill="#07090f" opacity=".85"/>',
    '<ellipse cx="110" cy="104" rx="76" ry="8" fill="#e24046" opacity=".22"/>',
    '<path d="M22 82L34 62L68 34C76 28 88 25 104 25H144C158 25 168 29 176 38L196 60L204 76C206 82 205 92 198 96L176 102H42L24 96C19 92 19 86 22 82Z" fill="url(#carBody)" stroke="#475569" stroke-width="1.5"/>',
    '<path d="M36 62L70 35C78 29 90 26 105 26H142" stroke="#e24046" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>',
    '<path d="M66 59L86 35H146L164 59H66Z" fill="url(#carGlass)" stroke="#64748b" stroke-width="1"/>',
    '<path d="M36 63L78 60L66 82M164 60L142 82" stroke="#475569" stroke-width="1.4" opacity=".7"/>',
    '<path d="M56 80H126L118 95H62L56 80Z" fill="#090c14" stroke="#334155" stroke-width="1.5"/>',
    '<path d="M64 85H118M66 90H114" stroke="#e24046" stroke-width="1.5" opacity=".7"/>',
    '<path d="M28 73L54 76L48 84L26 81Z" fill="#ffffff"/>',
    '<path d="M132 76L162 72L158 82L134 84Z" fill="#ffffff"/>',
    '<circle cx="40" cy="78" r="18" fill="url(#headlightGlow)" opacity=".85"/>',
    '<circle cx="148" cy="77" r="20" fill="url(#headlightGlow)" opacity=".9"/>',
    '<ellipse cx="175" cy="92" rx="13" ry="16" fill="#0b0e17" stroke="#64748b" stroke-width="3"/>',
    '<ellipse cx="175" cy="92" rx="6" ry="8" fill="#f0ad5f"/>',
    '</svg>',
    '</div>',
    '<div class="mode-3d-title">ARAÇ<span>FİYATI TAHMİNİ</span></div>',
    '<svg class="mode-3d-Origin-stroke" viewBox="0 0 110 12" fill="none" aria-hidden="true"><path d="M3 9C36 3 74 3 107 7" stroke="#e24046" stroke-width="4" stroke-linecap="round"/></svg>',
    '</div>',
    '</button>',
    '<button type="button" class="mode-3d-card gold-glow" onclick="openModeRoom(\'product-price\')">',
    '<div class="mode-3d-inner">',
    '<div class="mode-3d-figure" aria-hidden="true">',
    '<svg viewBox="0 0 200 135" fill="none">',
    '<defs>',
    '<linearGradient id="hpMetal" x1="40" y1="10" x2="160" y2="120" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#f8fafc"/><stop offset="45%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#334155"/></linearGradient>',
    '<linearGradient id="hpCup" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="#0f172a"/></linearGradient>',
    '</defs>',
    '<ellipse cx="104" cy="114" rx="64" ry="11" fill="#07090f" opacity=".8"/>',
    '<ellipse cx="104" cy="110" rx="50" ry="6" fill="#f0ad5f" opacity=".25"/>',
    '<path d="M54 78V56C54 22 146 22 146 56V78" stroke="url(#hpMetal)" stroke-width="14" stroke-linecap="round"/>',
    '<path d="M60 52C60 27 140 27 140 52" stroke="#f0ad5f" stroke-width="3" stroke-linecap="round" opacity=".85"/>',
    '<g transform="rotate(-12 60 84)">',
    '<ellipse cx="64" cy="84" rx="18" ry="26" fill="#0f172a"/>',
    '<ellipse cx="56" cy="84" rx="17" ry="25" fill="url(#hpCup)" stroke="#cbd5e1" stroke-width="2.5"/>',
    '<ellipse cx="53" cy="84" rx="9" ry="15" fill="#1e293b" stroke="#f0ad5f" stroke-width="1.8"/>',
    '</g>',
    '<g transform="rotate(12 140 84)">',
    '<ellipse cx="134" cy="84" rx="18" ry="26" fill="#0f172a"/>',
    '<ellipse cx="142" cy="84" rx="17" ry="25" fill="url(#hpCup)" stroke="#cbd5e1" stroke-width="2.5"/>',
    '<ellipse cx="145" cy="84" rx="9" ry="15" fill="#1e293b" stroke="#e24046" stroke-width="1.8"/>',
    '</g>',
    '</svg>',
    '</div>',
    '<div class="mode-3d-title">ÜRÜN<span>FİYATI TAHMİNİ</span></div>',
    '<svg class="mode-3d-Origin-stroke" viewBox="0 0 110 12" fill="none" aria-hidden="true"><path d="M3 9C36 3 74 3 107 7" stroke="#f0ad5f" stroke-width="4" stroke-linecap="round"/></svg>',
    '</div>',
    '</button>',
    '<button type="button" class="mode-3d-card gold-glow" onclick="openModeRoom(\'auction\')">',
    '<span class="mode-3d-badge" style="background:#e24046;color:#ffffff;border-color:#e24046">2 KİŞİ</span>',
    '<div class="mode-3d-inner">',
    '<div class="mode-3d-figure" aria-hidden="true">',
    '<svg viewBox="0 0 200 135" fill="none">',
    '<defs>',
    '<linearGradient id="woodGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#b45309"/><stop offset="50%" stop-color="#78350f"/><stop offset="100%" stop-color="#451a03"/></linearGradient>',
    '<linearGradient id="goldBand" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="50%" stop-color="#f0ad5f"/><stop offset="100%" stop-color="#b45309"/></linearGradient>',
    '</defs>',
    '<ellipse cx="98" cy="112" rx="68" ry="11" fill="#07090f" opacity=".85"/>',
    '<ellipse cx="82" cy="103" rx="38" ry="10" fill="#451a03" stroke="#f0ad5f" stroke-width="1.5" opacity=".9"/>',
    '<ellipse cx="82" cy="99" rx="34" ry="8" fill="#78350f"/>',
    '<path d="M102 64L168 104" stroke="url(#woodGrad)" stroke-width="11" stroke-linecap="round"/>',
    '<path d="M102 62L166 101" stroke="#f0ad5f" stroke-width="2" stroke-linecap="round" opacity=".6"/>',
    '<g transform="rotate(-28 88 56)">',
    '<rect x="54" y="34" width="68" height="36" rx="10" fill="url(#woodGrad)" stroke="#f0ad5f" stroke-width="1.8"/>',
    '<rect x="78" y="34" width="20" height="36" fill="url(#goldBand)"/>',
    '<ellipse cx="54" cy="52" rx="7" ry="18" fill="#92400e" stroke="#f0ad5f" stroke-width="1.5"/>',
    '<ellipse cx="122" cy="52" rx="7" ry="18" fill="#451a03" stroke="#b45309" stroke-width="1.5"/>',
    '</g>',
    '</svg>',
    '</div>',
    '<div class="mode-3d-title">AÇIK<span>ARTTIRMA</span></div>',
    '<svg class="mode-3d-Origin-stroke" viewBox="0 0 110 12" fill="none" aria-hidden="true"><path d="M3 9C36 3 74 3 107 7" stroke="#e24046" stroke-width="4" stroke-linecap="round"/></svg>',
    '</div>',
    '</button>',
    '<button type="button" class="mode-3d-card gold-glow" onclick="openModeRoom(\'number-race\')">',
    '<span class="mode-3d-badge">2 KİŞİ</span>',
    '<div class="mode-3d-inner">',
    '<div class="mode-3d-figure" aria-hidden="true">',
    '<svg viewBox="0 0 200 135" fill="none">',
    '<defs>',
    '<linearGradient id="bubble3D" x1="40" y1="20" x2="160" y2="110" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#384459"/><stop offset="55%" stop-color="#1e2536"/><stop offset="100%" stop-color="#111520"/></linearGradient>',
    '</defs>',
    '<ellipse cx="102" cy="114" rx="60" ry="10" fill="#07090f" opacity=".8"/>',
    '<path d="M58 28H150C164 28 175 39 175 53V79C175 93 164 104 150 104H92L66 120L72 104H58C44 104 33 93 33 79V53C33 39 44 28 58 28Z" fill="#0f131d" stroke="#e24046" stroke-width="2" opacity=".7"/>',
    '<path d="M52 22H144C158 22 169 33 169 47V73C169 87 158 98 144 98H86L60 114L66 98H52C38 98 27 87 27 73V47C27 33 38 22 52 22Z" fill="url(#bubble3D)" stroke="#f0ad5f" stroke-width="2.8" stroke-linejoin="round"/>',
    '<path d="M54 28H142C152 28 160 36 160 46" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity=".45"/>',
    '<text x="68" y="70" fill="#f8fafc" font-size="32" font-weight="bold">3</text>',
    '<text x="98" y="70" fill="#f0ad5f" font-size="32" font-weight="bold">7</text>',
    '<text x="128" y="70" fill="#e24046" font-size="32" font-weight="bold">1</text>',
    '</svg>',
    '</div>',
    '<div class="mode-3d-title">SAYI<span>YARIŞI</span></div>',
    '<svg class="mode-3d-Origin-stroke" viewBox="0 0 110 12" fill="none" aria-hidden="true"><path d="M3 9C36 3 74 3 107 7" stroke="#e24046" stroke-width="4" stroke-linecap="round"/></svg>',
    '</div>',
    '</button>',
    '<button type="button" class="mode-3d-card gold-glow" onclick="openModeRoom(\'battleship\')">',
    '<span class="mode-3d-badge">2 KİŞİ</span><div class="mode-3d-inner"><div class="mode-3d-figure" aria-hidden="true"><svg viewBox="0 0 200 135" fill="none"><ellipse cx="100" cy="112" rx="80" ry="9" fill="#070c17"/><path d="M20 87h165l-25 22H43Z" fill="#247a9c" stroke="#60d7ef" stroke-width="2"/><path d="M58 86V60h65v26m-45-26V40h23v20m12 1h28v25" fill="#1d4d6b" stroke="#60d7ef" stroke-width="2"/><path d="M90 40V18m0 4 29 11H90M36 96h130" stroke="#8de8f5" stroke-width="2"/><path d="M20 117q12-8 24 0t24 0t24 0t24 0t24 0t24 0" stroke="#47bfe5" stroke-width="2"/></svg></div><div class="mode-3d-title">AMİRAL<span>BATTI</span></div><svg class="mode-3d-Origin-stroke" viewBox="0 0 110 12" fill="none" aria-hidden="true"><path d="M3 9C36 3 74 3 107 7" stroke="#48c9f2" stroke-width="4" stroke-linecap="round"/></svg></div>',
    '</button>',
    '</div>',
    '<div class="home-dots" role="tablist" aria-label="Oyun modları"><button type="button" class="home-dot active" aria-label="1. sayfa" onclick="scrollModes(0)"></button><button type="button" class="home-dot" aria-label="2. sayfa" onclick="scrollModes(2)"></button><button type="button" class="home-dot" aria-label="3. sayfa" onclick="scrollModes(4)"></button></div>',
    '</section>',
  ].join('');
  init3DFox();
}
function scrollModes(idx) {
  const t = document.querySelector('.home-modes-track'),
    c = t?.querySelectorAll('.mode-3d-card');
  if (c && c[idx])
    c[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  document
    .querySelectorAll('.home-dot')
    .forEach((d, i) => d.classList.toggle('active', i === Math.floor(idx / 2)));
}

function goHome() {
  if (!room) {
    resetRoomUrl();
    home();
    return;
  }
  modal(
    room.isHost
      ? '<h2>Odayı kapat?</h2><p>Tüm oyuncular çıkarılır ve ' +
          esc(room.code) +
          ' kodu kalıcı olarak geçersiz olur.</p><button class="btn full" onclick="exitRoom()">Odayı kapat ve çık</button>'
      : '<h2>Odadan ayrıl?</h2><p>Oda açık kalır. Oyun henüz başlamadıysa koduyla tekrar katılabilirsin.</p><button class="btn full" onclick="exitRoom()">Odadan ayrıl</button>'
  );
}
function leaveView(updateUrl = true) {
  clearInterval(poll);
  clearInterval(timer);
  document.body.classList.remove('lobby-mode');
  room = null;
  gameAudio.sync(null);
  closeModal();
  if (updateUrl) resetRoomUrl();
  home();
}
async function exitRoom() {
  if (busy) return;
  busy = true;
  try {
    await call(room.isHost ? 'close' : 'leave');
    leaveView();
    toast('Odadan ayrıldın.');
  } catch (e) {
    if (e.closed) {
      leaveView();
      toast(e.message);
    } else toast(e.message);
  } finally {
    busy = false;
  }
}

function modal(body) {
  $('#overlay').innerHTML =
    '<div class="modalback"><section class="modal" role="dialog" aria-modal="true"><button class="close" aria-label="Kapat" onclick="closeModal()">×</button>' +
    body +
    '</section></div>';
  setTimeout(() => $('#overlay input')?.focus(), 50);
}
function closeModal() {
  $('#overlay').innerHTML = '';
  afterProfile = null;
}
function requireProfile(fn) {
  if (!validProfile(profile)) {
    afterProfile = fn;
    profileModal();
  } else fn();
}
function profileModal() {
  if (room) {
    toast('Profilini oyun bittikten sonra düzenleyebilirsin.');
    return;
  }
  selected = profile?.avatar || 'a0';
  editingProfile = true;
  modal(
    '<span class="tag">SENİN OYUNUN, SENİN KARAKTERİN</span><h2>' +
      (profile ? 'Profilini düzenle' : 'Önce seni tanıyalım.') +
      '</h2><p>Oda oluşturmak veya bir odaya katılmak için profilini tamamla.</p><form onsubmit="saveProfile(event)"><label for="username">Kullanıcı adın</label><input class="input" id="username" minlength="2" maxlength="20" required placeholder="Örn. TurboOgz" value="' +
      esc(profile?.name || '') +
      '"><label>Karakterini seç</label><div class="avatars">' +
      Array.from(
        { length: 10 },
        (_, i) =>
          '<button type="button" class="avbtn ' +
          (selected === 'a' + i ? 'selected' : '') +
          '" onclick="selectAvatar(\'a' +
          i +
          '\',this)" aria-label="' +
          characterNames[i] +
          '"><img src="' +
          avatar('a' + i) +
          '" alt="' +
          characterNames[i] +
          '"></button>'
      ).join('') +
      '</div><input type="file" accept="image/png,image/jpeg,image/webp" id="uploadfile" class="hidden" onchange="uploadPhoto(event)"><button type="button" class="upload" onclick="$(\'#uploadfile\').click()">↥ &nbsp; Ya da kendi fotoğrafını yükle</button><div id="uploadpreview">' +
      (selected.startsWith('data:')
        ? '<img class="avatar" alt="Yüklenen fotoğraf" src="' + selected + '">'
        : '') +
      '</div><button class="btn full" type="submit">' +
      (profile ? 'Profili kaydet' : 'Hazırım, başlayalım') +
      ' &nbsp; →</button></form>'
  );
}
function selectAvatar(a, el) {
  selected = a;
  document.querySelectorAll('.avbtn').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  $('#uploadpreview').innerHTML = '';
}
function uploadPhoto(e) {
  const f = e.target.files[0];
  if (!f) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 5000000) {
    toast('En fazla 5 MB boyutunda JPG, PNG veya WebP seç.');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = 180;
      const ctx = c.getContext('2d'),
        s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 180, 180);
      selected = c.toDataURL('image/jpeg', 0.8);
      document.querySelectorAll('.avbtn').forEach(x => x.classList.remove('selected'));
      $('#uploadpreview').innerHTML =
        '<img class="avatar" alt="Yüklenen fotoğraf" src="' + selected + '">';
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(f);
}
function saveProfile(e) {
  e.preventDefault();
  const name = $('#username').value.trim();
  if (name.length < 2) {
    toast('Kullanıcı adın en az 2 karakter olmalı.');
    return;
  }
  profile = { name, avatar: selected };
  localStorage.setItem('ogz-profile', JSON.stringify(profile));
  const fn = afterProfile;
  afterProfile = null;
  $('#overlay').innerHTML = '';
  user();
  if (fn) fn();
  toast('Profilin hazır, ' + name + '!');
}
function syncDuration(value, fromNumber = false) {
  const n = Number(value);
  if (Number.isInteger(n) && n >= 10 && n <= 120) {
    guessSeconds = n;
    if ($('#guess-slider')) $('#guess-slider').value = n;
    if (!fromNumber && $('#guess-seconds')) $('#guess-seconds').value = n;
    if ($('#guess-slider')) $('#guess-slider').style.setProperty('--fill', ((n - 10) / 110) * 100 + '%');
    const disp = $('#lobby-duration-display');
    if (disp) disp.textContent = n + ' Saniye';
    if (typeof updateLobbyMilestones === 'function') updateLobbyMilestones(n);
    if (typeof updateLobbySummary === 'function') updateLobbySummary();
  }
}
function createModal(initialMode = 'car-price', changeMode = false) {
  if (!changeMode) {
    openModeRoom(typeof initialMode === 'string' ? initialMode : 'car-price');
    return;
  }
  const mode = typeof initialMode === 'string' ? initialMode : 'car-price';
  rounds = changeMode ? room.rounds || 10 : settings.rounds;
  guessSeconds = changeMode ? room.guessSeconds || 30 : 30;
  modal(
    '<span class="tag">' +
      (changeMode ? 'AYNI ODADA YENİ OYUN' : 'YENİ ODA') +
      '</span><h2>' +
      (changeMode ? 'Sırada ne oynayalım?' : 'Oyununu kur.') +
      '</h2>' +
      (changeMode
        ? '<p class="notice">Oda ' +
          esc(room.code) +
          ' ve tüm oyuncular korunur. Yeni oyunda puanlar sıfırlanır. Açık artırma en fazla 2 oyuncuyla oynanır.</p>'
        : '') +
      '<form class="room-create-form" onsubmit="event.preventDefault();enterRoom(\'' +
      (changeMode ? 'change-mode' : 'create') +
      '\')">' +
      modeCardChooser(mode) +
      productCategoryChooser(mode) +
      (typeof auctionChooser === 'function' ? auctionChooser() : '') +
      numberRaceOptions() +
      battleshipOptions() +
      '<p class="notice" id="game-mode-description">' +
      (mode === 'product-price'
        ? 'Ürün detaylarını incele, fiyata en yakın tahminle puan topla.'
        : mode === 'auction'
          ? '20 TL ile en güzel tabağı sen kur. Teklif ver, rakibini geç, ürünü kap.'
          : 'Araç detaylarını incele, fiyata en yakın tahminle puan topla.') +
      '</p><div id="guess-mode-settings"><label for="room-rounds">Tur sayısı</label><select class="input" id="room-rounds">' +
      [10, 15, 20]
        .map(
          n =>
            '<option value="' +
            n +
            '" ' +
            (n === rounds ? 'selected' : '') +
            '>' +
            n +
            ' tur</option>'
        )
        .join('') +
      '</select><label for="guess-seconds">Tur başına tahmin süresi</label><div class="duration-control"><input id="guess-slider" class="duration-slider" type="range" min="10" max="120" step="1" value="30" aria-label="Tahmin süresini kaydırarak ayarla" oninput="syncDuration(this.value)"><div class="duration-value"><input class="input" id="guess-seconds" type="number" min="10" max="120" step="1" value="30" required oninput="syncDuration(this.value,true)"><span>saniye</span></div></div><div class="duration-limits"><span>10 saniye</span><span>120 saniye</span></div><p class="notice">1–8 oyuncu · Süre dolunca tahmin yapmayanlar 0 puan alır.<br>' +
      (changeMode
        ? 'Mevcut oda kodunla devam edersin.'
        : 'Odan için özel kod oluşturulur. Odayı kapattığında kod geçersiz olur.') +
      '</p></div><button class="btn full" type="submit">' +
      (changeMode ? 'Aynı odada devam et →' : 'Odayı oluştur →') +
      '</button></form>'
  );
  syncDuration(guessSeconds);
  if (mode === 'product-price') toggleProductCategories();
  if (mode === 'auction' && typeof toggleAuctionOptions === 'function') toggleAuctionOptions();
  toggleNumberRaceOptions();
  toggleBattleshipOptions();
}

let settings = { rounds: 10, motion: true, sound: true, soundVolume: 0.35 };
try {
  const saved = JSON.parse(localStorage.getItem('ogz-settings'));
  if (saved) {
    if ([10, 15, 20].includes(saved.rounds)) settings.rounds = saved.rounds;
    if (typeof saved.motion === 'boolean') settings.motion = saved.motion;
    if (typeof saved.sound === 'boolean') settings.sound = saved.sound;
    if (Number.isFinite(saved.soundVolume))
      settings.soundVolume = Math.max(0, Math.min(1, saved.soundVolume));
  }
} catch {}
document.body.classList.toggle('no-motion', !settings.motion);
gameAudio.configure(settings.sound, settings.soundVolume);
function settingsModal() {
  if (!profile) {
    afterProfile = settingsModal;
    profileModal();
    return;
  }
  modal(
    '<span class="tag">OYUN AYARLARI</span><h2>Oyunu kendine göre ayarla.</h2><form onsubmit="saveSettings(event)"><label for="default-rounds">Yeni odalar için tur sayısı</label><select class="input" id="default-rounds">' +
      [10, 15, 20]
        .map(
          n =>
            '<option value="' +
            n +
            '" ' +
            (settings.rounds === n ? 'selected' : '') +
            '>' +
            n +
            ' tur</option>'
        )
        .join('') +
      '</select><p class="notice">Bu tercih kuracağın yeni odalarda varsayılan olarak seçilir. Mevcut odanın kurallarını değiştirmez.</p><label class="motion-setting" for="motion-toggle"><span>Logo ve buton animasyonları</span><input id="motion-toggle" type="checkbox" ' +
      (settings.motion ? 'checked' : '') +
      '></label><label class="motion-setting" for="sound-enabled"><span>Oyun sesleri</span><input id="sound-enabled" type="checkbox" ' +
      (settings.sound ? 'checked' : '') +
      '></label><label for="sound-volume">Ses seviyesi</label><input id="sound-volume" type="range" min="0" max="100" step="5" value="' +
      Math.round(settings.soundVolume * 100) +
      '" style="width:100%;accent-color:var(--a)"><button class="btn full" type="submit">Ayarları kaydet</button></form>'
  );
}
function toggleGameSound() {
  settings.sound = !settings.sound;
  localStorage.setItem('ogz-settings', JSON.stringify(settings));
  gameAudio.configure(settings.sound, settings.soundVolume);
  if (settings.sound) {
    gameAudio.unlock();
    gameAudio.play('submit');
  }
  updateSoundControls();
  toast(settings.sound ? 'Oyun sesleri açık' : 'Oyun sesleri kapalı');
}
function updateSoundControls() {
  for (const button of document.querySelectorAll('.game-sound-toggle')) {
    button.setAttribute('aria-pressed', String(settings.sound));
    button.setAttribute(
      'aria-label',
      settings.sound ? 'Oyun seslerini kapat' : 'Oyun seslerini aç'
    );
    button.textContent = settings.sound ? '♫' : '♪';
    button.style.opacity = settings.sound ? '1' : '.55';
  }
}
function saveSettings(e) {
  e.preventDefault();
  settings = {
    rounds: Number($('#default-rounds').value),
    motion: $('#motion-toggle').checked,
    sound: $('#sound-enabled').checked,
    soundVolume: Number($('#sound-volume').value) / 100,
  };
  localStorage.setItem('ogz-settings', JSON.stringify(settings));
  document.body.classList.toggle('no-motion', !settings.motion);
  gameAudio.configure(settings.sound, settings.soundVolume);
  updateSoundControls();
  closeModal();
  toast('Oyun ayarların kaydedildi.');
}
function joinModal() {
  modal(
    '<span class="tag">EKİBİN SENİ BEKLİYOR</span><h2>Hemen oyuna katıl.</h2><p>Arkadaşının paylaştığı 6 karakterli oda kodunu gir ya da kendi odanı kur.</p><form onsubmit="event.preventDefault();enterRoom(\'join\')"><label for="roomcode">Oda kodu</label><input class="input" id="roomcode" placeholder="ÖRN. A3F8B2" pattern="[A-Fa-f0-9]{6}" minlength="6" maxlength="6" required style="text-transform:uppercase;letter-spacing:5px"><button class="btn full">Odaya katıl &nbsp; →</button><button type="button" class="btn secondary full" style="margin-top:10px" onclick="openModeRoom()">Yeni oda kur &nbsp; +</button></form>'
  );
}
const preloadedGameImages = new Map();
function prefetchGameImages(urls, priority = 'low') {
  for (const url of urls.filter(u => typeof u === 'string' && u.startsWith('https://'))) {
    if (preloadedGameImages.has(url)) continue;
    const img = new Image();
    img.decoding = 'async';
    img.fetchPriority = priority;
    preloadedGameImages.set(url, img);
    img.src = url;
    while (preloadedGameImages.size > 4)
      preloadedGameImages.delete(preloadedGameImages.keys().next().value);
  }
}
async function call(action, extra = {}) {
  const controller = new AbortController(),
    timeout = setTimeout(
      () => controller.abort(),
      action === 'mark-cells' ? 4000 : action === 'get' ? 8000 : 12000
    );
  try {
    const res = await fetch('/api/room', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ action, token, code: room?.code, gameId: room?.gameId, ...extra }),
    });
    const data = await res.json();
    if (!res.ok) {
      const error = Error(data.error || 'İşlem tamamlanamadı.');
      error.closed = !!data.closed;
      error.status = res.status;
      throw error;
    }
    if (data.car) prefetchGameImages([data.car[9], data.car[10]?.damageImage], 'high');
    if (data.nextImages) prefetchGameImages(data.nextImages);
    if (data.serverNow) clockOffset = data.serverNow - Date.now();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw Error('Bağlantı gecikti. Tekrar deneniyor…');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
async function enterRoom(action, linkCode = null) {
  if (!validProfile(profile)) {
    afterProfile = linkCode
      ? () => enterRoom('join', linkCode)
      : action === 'create'
        ? createModal
        : joinModal;
    profileModal();
    toast('Önce profilini oluşturmalısın.');
    return;
  }
  if (busy) return;
  busy = true;
  try {
    const configure = action === 'create' || action === 'change-mode';
    if (configure) {
      rounds = Number($('#room-rounds').value);
      guessSeconds = Number($('#guess-seconds').value);
    }
    const chosenMode = configure ? $('#game-mode')?.value || 'car-price' : undefined;
    let chosenCategory = undefined;
    if (chosenMode === 'auction') {
      const ch = document.querySelector('input[name="auction-category"]:checked');
      chosenCategory = ch ? ch.value : undefined;
    }
    room = await call(action, {
      profile,
      rounds,
      mode: chosenMode,
      category: chosenCategory,
      gridSize:
        chosenMode === 'number-race'
          ? Number(document.querySelector('[name=number-size]:checked')?.value || 6)
          : undefined,
      categories:
        configure && chosenMode === 'product-price' ? selectedProductCategories() : undefined,
      guessSeconds,
      code: action === 'join' ? linkCode || $('#roomcode').value.trim().toUpperCase() : room?.code,
    });
    $('#overlay').innerHTML = '';
    renderRoom();
    clearInterval(poll);
    poll = setInterval(refresh, ['number-race', 'battleship'].includes(room.mode) ? 500 : 2000);
  } catch (e) {
    if (linkCode)
      modal(
        '<h2>Odaya katılamadın</h2><p>' +
          esc(e.message) +
          '</p><button class="btn full" onclick="leaveView()">Ana sayfaya dön</button>'
      );
    else toast(e.message);
  } finally {
    busy = false;
  }
}
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) refresh();
});
window.addEventListener('online', () => refresh());
let refreshInFlight = false;
async function refresh() {
  if (!room || busy || refreshInFlight || document.hidden || (room.state === 'lobby' && room.isHost && lobbySaveTask)) return;
  refreshInFlight = true;
  try {
    const expectedRoom = room;
    const next = await call('get');
    if (busy || room !== expectedRoom) return;
    if (
      room.gameId === next.gameId &&
      room.mode === 'battleship' &&
      (next.battleVersion || 0) < (room.battleVersion || 0)
    )
      return;
    if (
      room.gameId === next.gameId &&
      room.mode === 'number-race' &&
      (next.raceVersion || 0) < (room.raceVersion || 0)
    )
      return;
    const previous = { ...room };
    delete previous.serverNow;
    const updated = { ...next };
    delete updated.serverNow;
    if (JSON.stringify(updated) !== JSON.stringify(previous)) {
      room = next;
      renderRoom();
    }
  } catch (e) {
    if (e.closed) {
      leaveView();
      toast(e.message);
    } else if ($('#connection')) $('#connection').textContent = 'Bağlantı yenileniyor…';
  } finally {
    refreshInFlight = false;
  }
}
function tickTimer() {
  clearInterval(timer);
  const update = () => {
    const el = $('#round-timer');
    if (!el || !room || room.state !== 'playing') return;
    const left = Math.max(0, Math.ceil((room.deadline - Date.now() - clockOffset) / 1000));
    gameAudio.countdown(room, left);
    el.textContent = left + ' sn';
    el.classList.toggle('urgent', left <= 10);
    if (left === 0) {
      $('#guessbtn') && ($('#guessbtn').disabled = true);
      $('#guess') && ($('#guess').disabled = true);
      document.querySelectorAll('.guess-multiplier').forEach(button => (button.disabled = true));
    }
  };
  update();
  if (room?.state === 'playing') timer = setInterval(update, 250);
}

function playersHtml() {
  return room.players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map(
      (p, i) =>
        '<div class="player"><img class="avatar" src="' +
        avatar(p.avatar) +
        '" alt="' +
        esc(p.name) +
        ' profil resmi"><div><strong>' +
        esc(p.name) +
        (p.id === room.me ? ' <span style="color:var(--gold)">(sen)</span>' : '') +
        '</strong><small>' +
        (room.isHost && p.id === room.me ? 'Oda sahibi' : 'Oyuncu') +
        '</small></div><span class="score">' +
        p.score +
        '</span></div>'
    )
    .join('');
}
function changeRoomMode() {
  if (!room?.isHost || !['lobby', 'finished'].includes(room.state)) return;
  createModal(room.mode, true);
}
function roomModeButton() {
  return room.isHost
    ? '<button type="button" class="btn secondary full" style="margin-top:12px" onclick="changeRoomMode()">' +
        (room.state === 'finished' ? 'Farklı oyun seç →' : 'Oyun modunu değiştir') +
        '</button>'
    : '<p class="notice">Oda sahibi bu odada başka bir oyun modu seçebilir.</p>';
}
function lobbyResults(previous = room.lastGame) {
  if (!previous) return '';
  return (
    '<details class="box" style="margin-top:18px"><summary>Son oyunun sonuçları</summary>' +
    previous.players
      .slice()
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .map(
        p =>
          '<div class="player"><img class="avatar" src="' +
          avatar(p.avatar) +
          '" alt=""><strong>' +
          esc(p.name) +
          '</strong><span class="score">' +
          (previous.mode === 'auction'
            ? (p.plate?.length || 0) + ' ürün'
            : (p.score || 0) + ' puan') +
          '</span></div>'
      )
      .join('') +
    '</details>'
  );
}


${lobbyClient}
async function startLobbyGame(event) {
 event.preventDefault();if(busy||!room?.isHost)return;
 busy=true;const button=$('#lobby-start');if(button)button.disabled=true;
 try{await persistLobbySettings();room=await call('start');clearInterval(poll);poll=setInterval(refresh,['number-race','battleship'].includes(room.mode)?500:2000);renderRoom()}
 catch(e){toast(e.message)}finally{busy=false;if($('#lobby-start'))$('#lobby-start').disabled=!room.isHost}
}

function renderRoom() {
  syncRoomUrl();
  gameAudio.sync(room);
  renderRoomContent();
  updateSoundControls();
}
function renderRoomContent() {
  if (room.state !== 'lobby' || shouldShowFinal(room)) document.body.classList.remove('lobby-mode');
  if (room.mode !== 'battleship') document.body.classList.remove('battleship-active');
  if (room.state === 'lobby' && shouldShowFinal(room)) {
    renderFinalStandings();
    return;
  }
  if (room.state === 'lobby') {
    renderLobby();
    return;
  }
  if (room.mode !== 'auction') document.body.classList.remove('auction-active');
  if (room.mode === 'auction') {
    if (typeof renderAuction === 'function') renderAuction();
    return;
  }
  if (room.mode === 'battleship') {
    renderBattleship();
    return;
  }
  if (room.mode === 'number-race') {
    renderNumberRace();
    return;
  }
  if (room.state === 'playing' || room.state === 'reveal') {
    renderGame();
    return;
  }
  resetMobileRoundRanking();
  document.body.classList.remove('game-mode', 'product-game');
  document.body.classList.remove('home-mode', 'lobby-mode');
  const host = room.isHost;
  $('#breadcrumb').textContent = room.state === 'lobby' ? 'Oyun lobisi' : 'Fiyat tahmini';
  let body = '';
  if (room.state === 'lobby') {
    body =
      '<div class="box"><span class="tag">OYUN LOBİSİ</span><h2>Ekibini davet et.</h2><p style="color:var(--muted)">Bu kodu arkadaşlarınla paylaş, oyun başlasın.</p><div class="code num">' +
      room.code +
      '</div><button class="btn secondary" onclick="copyCode()">▣ &nbsp; Kodu kopyala</button><p class="notice">' +
      room.rounds +
      ' tur · ' +
      (room.guessSeconds || 30) +
      ' sn / tur · ' +
      room.players.length +
      '/8 oyuncu · ' +
      (room.mode === 'product-price'
        ? 'Ürün fiyatı tahmini · ' + room.categories.map(key => productCategories[key]).join(', ')
        : 'Araç fiyatı tahmini') +
      '</p><button class="btn full" ' +
      (!host ? 'disabled' : '') +
      ' onclick="act(\'start\')">' +
      (host ? 'Oyunu başlat →' : 'Oda sahibinin başlatması bekleniyor…') +
      '</button><p class="notice">Tek başına pratik yapabilir veya arkadaşlarını bekleyebilirsin.</p>' +
      roomModeButton() +
      '</div>';
  } else if (room.state === 'finished') {
    const win = room.players.slice().sort((a, b) => b.score - a.score)[0];
    body =
      '<div class="box" style="text-align:center;padding:50px 20px"><span style="font-size:55px">🏆</span><h2>Tahmin ustası: ' +
      esc(win.name) +
      '</h2><div class="price">' +
      win.score +
      ' puan</div><p>' +
      room.rounds +
      ' tur, bolca rekabet. Eline sağlık!</p><button class="btn full" ' +
      (!host ? 'disabled' : '') +
      ' onclick="act(\'restart\')">' +
      (host ? 'Tekrar oyna →' : 'Oda sahibinin yeniden başlatması bekleniyor…') +
      '</button>' +
      roomModeButton() +
      '<p class="notice">Aynı oda ve oyuncularla yeni oyun. Puanlar sıfırlanır, ilanlar yeniden karıştırılır.</p><button class="btn secondary" onclick="goHome()">' +
      (host ? 'Odayı kapat' : 'Odadan ayrıl') +
      '</button></div>';
  } else {
    const c = room.car;
    const info = c[10];
    body =
      '<div class="box"><div class="progress"><i style="width:' +
      ((room.round + 1) / room.rounds) * 100 +
      '%"></i></div><span class="tag">TUR ' +
      (room.round + 1) +
      ' / ' +
      room.rounds +
      ' · ' +
      (info ? 'GÖNDERİLEN İLAN' : 'ÖRNEK İLAN') +
      '</span><h2>' +
      esc(c[0] + ' ' + c[1]) +
      '</h2><img class="carphoto ' +
      (info ? 'listing-photo' : '') +
      '" src="' +
      (info ? c[9] : 'https://images.unsplash.com/' + c[9] + '?auto=format&fit=crop&w=1000&q=85') +
      '" alt="' +
      (info ? esc(c[0] + ' ' + c[1]) + ' ilan fotoğrafı' : 'Temsili otomobil fotoğrafı') +
      '"><div class="specs">' +
      [
        ['Model yılı', c[2]],
        ['Kilometre', new Intl.NumberFormat('tr-TR').format(c[3]) + ' km'],
        ['Yakıt / Vites', c[4] + ' / ' + c[5]],
        ['Boya durumu', c[6]],
        ['Değişen', c[7]],
        ['Kaza / Hasar', c[8]],
        ...(info?.details || []),
      ]
        .map(x => '<div><small>' + x[0] + '</small><b>' + esc(x[1]) + '</b></div>')
        .join('') +
      '</div>' +
      (info
        ? '<section class="damage-section"><h3>Boya ve değişen durumu</h3><img class="damage-image" src="' +
          info.damageImage +
          '" alt="' +
          esc(c[0] + ' ' + c[1]) +
          ' boya ve değişen parça şeması" loading="lazy"><p class="notice">' +
          esc(info.note) +
          '</p></section><p class="notice">Gönderilen ilan ekran görüntüsündeki bilgiler esas alınmıştır. Fiyat, ilan tarihindeki tutardır.</p>'
        : '<p class="notice">Bu ilan oyun için hazırlanmış örnek veridir; fotoğraf temsilidir. Sahibinden ile bağlantılı değildir.</p>') +
      (room.state === 'playing'
        ? (room.submitted && room.submitted === room.players.length
            ? ''
            : room.hasGuessed
              ? ''
              : '<form onsubmit="submitGuess(event)"><label for="guess">Sence bu araç kaç para?</label><div style="display:flex;gap:10px;margin-top:10px"><input id="guess" class="input" type="text" inputmode="numeric" oninput="formatGuessInput(this,event)" oncompositionend="formatGuessInput(this,event)" autocomplete="off" maxlength="32" placeholder="Tahminin (₺)" required><button class="btn" id="guessbtn">Gönder →</button></div></form>') +
          '<p class="notice">' +
          room.submitted +
          ' / ' +
          room.players.length +
          ' tahmin alındı. Herkes gönderince veya süre dolunca fiyat açılır.</p>'
        : '<p style="color:var(--muted)">İlanın fiyatı</p><div class="price">' +
          money(room.price) +
          '</div><div>' +
          room.results
            .slice()
            .sort((a, b) => b.points - a.points)
            .map(
              r =>
                '<div class="player"><strong>' +
                esc(room.players.find(p => p.id === r.id).name) +
                '</strong><span style="margin-left:auto">' +
                (r.guess == null ? 'Tahmin yok' : money(r.guess)) +
                '</span><b style="color:var(--gold)">+' +
                r.points +
                '</b></div>'
            )
            .join('') +
          '</div><button class="btn full" ' +
          (!host ? 'disabled' : '') +
          ' onclick="act(\'next\')">' +
          (host
            ? room.round + 1 === room.rounds
              ? 'Final sıralamasını gör →'
              : 'Sonraki tur →'
            : 'Oda sahibi bekleniyor…') +
          '</button>') +
      '</div>';
  }
  $('#content').innerHTML =
    '<div class="pagehead"><div><h1>' +
    (room.state === 'lobby'
      ? 'Aynı oda, tatlı rekabet.'
      : room.state === 'finished'
        ? 'Oyun tamamlandı.'
        : 'Tahminin konuşsun.') +
    '</h1><p id="connection">Oda ' +
    room.code +
    ' · ' +
    room.rounds +
    ' tur · ' +
    (room.guessSeconds || 30) +
    ' sn / tur</p></div><div class="room-tools">' +
    (room.state === 'playing'
      ? '<span id="round-timer" class="round-timer" role="timer" aria-label="Kalan tahmin süresi"></span>'
      : '') +
    '<button class="btn secondary" onclick="goHome()">' +
    (host ? 'Odayı kapat' : 'Odadan ayrıl') +
    ' ↗</button></div></div><div class="roomlayout">' +
    body +
    '<div><div class="box"><div class="sectiontitle" style="margin-top:0"><h2>' +
    (room.state === 'lobby' ? 'Oyuncular' : 'Puan tablosu') +
    '</h2><span>' +
    room.players.length +
    '/8</span></div>' +
    playersHtml() +
    '<p class="notice">Puan = 1.000 × (1 − oransal fiyat farkı). Negatif puan verilmez. Eşit tahminler eşit puan alır.</p></div></div></div>';
  tickTimer();
  if (room.state === 'playing' && room.hasGuessed) {
    const form = $('#guess')?.closest('form');
    if (form)
      form.innerHTML =
        '<div class="pill" style="margin:15px 0">✓ Tahminin alındı. Diğer oyuncular bekleniyor.</div>';
  }
}

function renderGame() {
  const guessWasFocused = document.activeElement?.id === 'guess',
    guessCaret = $('#guess')?.selectionStart;
  document.body.classList.remove('home-mode', 'lobby-mode');
  document.body.classList.add('game-mode');
  document.body.classList.toggle('product-game', room.mode === 'product-price');
  const c = room.car,
    info = c[10],
    revealed = room.state !== 'playing',
    mine = room.results?.find(r => r.id === room.me),
    details = info?.details || [];
  const field = key => details.find(x => x[0].toLowerCase().includes(key))?.[1] || 'Belirtilmemiş';
  const specs = [
    ['MARKA', c[0]],
    ['MODEL', c[1]],
    ['YIL', c[2]],
    ['KİLOMETRE', new Intl.NumberFormat('tr-TR').format(c[3]) + ' km'],
    ['YAKIT', c[4]],
    ['VİTES', c[5]],
    ['MOTOR GÜCÜ', field('gü')],
    ['KAZA / HASAR', c[8]],
  ];
  const extraSpecs = [
    ['Motor gücü', field('gü')],
    ['Kaza / Hasar', c[8]],
    ...details.filter(x => !['Motor gücü', 'Ağır hasar kaydı'].includes(x[0])),
  ];
  const scores = room.players
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((p, i) => {
      const r = room.results?.find(r => r.id === p.id);
      return (
        '<div class="rank-card ' +
        (p.id === room.me ? 'is-me' : '') +
        '"><span class="rank-number">' +
        (i + 1) +
        '</span><img src="' +
        avatar(p.avatar) +
        '" alt=""><div class="rank-name"><strong>' +
        esc(p.name) +
        (p.id === room.me ? ' <small>(sen)</small>' : '') +
        '</strong><span>' +
        (revealed ? (r?.guess ? money(r.guess) : 'Tahmin yok') : 'Tahminler gizli') +
        '</span></div><div class="rank-points"><b>' +
        p.score +
        '</b><small>toplam puan</small></div></div>'
      );
    })
    .join('');
  const board = $('.game-board');
  if (
    board &&
    board.dataset.roundKey === room.code + '-' + (room.gameId || 'legacy') + '-' + room.round &&
    board.dataset.state === 'playing' &&
    room.state === 'playing' &&
    board.dataset.guessed === String(room.hasGuessed)
  ) {
    const scoreList = $('#game-score-list');
    if (scoreList && scoreList.innerHTML !== scores) scoreList.innerHTML = scores;
    const playerCount = $('.game-scores .panel-heading>span');
    if (playerCount) playerCount.textContent = room.players.length + ' oyuncu';
    const status = $('#guess-status');
    if (status)
      status.textContent =
        room.submitted + ' / ' + room.players.length + ' oyuncu tahminini gönderdi';
    tickTimer();
    return;
  }
  $('#content').innerHTML =
    '<div class="game-top"><button class="game-back" onclick="goHome()" aria-label="Odadan ayrıl">←</button><div class="game-progress"><div><strong>Tur ' +
    (room.round + 1) +
    ' <span>/ ' +
    room.rounds +
    '</span></strong><span>ODA ' +
    room.code +
    '</span></div><div class="progress"><i style="width:' +
    ((room.round + 1) / room.rounds) * 100 +
    '%"></i></div></div><span class="round-timer" id="round-timer">Tur sonucu</span><button type="button" class="game-sound-toggle" onclick="toggleGameSound()" aria-label="Oyun sesleri">♫</button></div>' +
    (revealed ? mobileRoundRankingMarkup(room) : '') +
    '<div class="mobile-game-tabs" role="tablist" aria-label="Araç inceleme" onkeydown="handleMobilePanelKey(event)"><button type="button" role="tab" data-panel="car" aria-selected="true" onclick="setMobileGamePanel(\'car\')">Araç</button><button type="button" role="tab" data-panel="scores" aria-selected="false" tabindex="-1" onclick="setMobileGamePanel(\'scores\')">Puanlar</button></div><div class="game-board" data-mobile-panel="car" data-round-key="' +
    room.code +
    '-' +
    (room.gameId || 'legacy') +
    '-' +
    room.round +
    '" data-state="' +
    room.state +
    '" data-guessed="' +
    String(room.hasGuessed) +
    '"><section class="game-visual"><div class="photo-stage"><span class="photo-badge">ARAÇ FİYATI TAHMİNİ</span><img class="game-photo" src="' +
    (info ? c[9] : 'https://images.unsplash.com/' + c[9] + '?auto=format&fit=crop&w=1000&q=85') +
    '" alt="' +
    esc(c[0] + ' ' + c[1]) +
    '"></div></section><section class="game-details"><div class="game-vehicle-info"><span class="game-eyebrow">SENCE KAÇ LİRA?</span><h1>' +
    esc(c[0] + ' ' + c[1]) +
    '</h1><div class="vehicle-rows">' +
    specs
      .map(
        (x, i) =>
          '<div class="' +
          (i < 2 ? 'vehicle-identity' : i >= 6 ? 'vehicle-secondary' : 'vehicle-primary') +
          '"><span>' +
          x[0] +
          '</span><b>' +
          esc(x[1]) +
          '</b></div>'
      )
      .join('') +
    '</div><div class="vehicle-extra"><div class="vehicle-rows">' +
    extraSpecs
      .map(x => '<div><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>')
      .join('') +
    '</div><p>' +
    esc(info?.note || '') +
    '</p></div></div>' +
    (revealed
      ? '<div class="game-round-result"><div class="reveal-label">✦ FİYAT AÇIKLANDI</div><div class="actual-price"><span>GERÇEK FİYAT</span><strong>' +
        money(room.price) +
        '</strong></div><div class="result-tiles"><div><span>TAHMİNİN</span><b>' +
        (mine?.guess ? money(mine.guess) : '—') +
        '</b></div><div><span>FARK</span><b>' +
        (mine?.guess ? money(Math.abs(mine.guess - room.price)) : '—') +
        '</b></div><div><span>TUR PUANI</span><b>+' +
        (mine?.points || 0) +
        '</b></div></div><button type="button" class="reveal-ranking-link" onclick="showMobileRoundRanking()">Genel sıralamayı göster →</button><div class="round-actions"><button class="btn full" ' +
        (!room.isHost ? 'disabled' : '') +
        ' onclick="act(\'next\')">' +
        (room.isHost
          ? room.round + 1 === room.rounds
            ? 'Final sıralamasını gör →'
            : 'Sonraki tur →'
          : 'Oda sahibinin devam etmesi bekleniyor') +
        '</button></div></div>'
      : '<div class="guess-card"><span class="game-eyebrow">TAHMİN SIRASI SENDE</span><h2>Bu aracın değeri ne kadar?</h2>' +
        (room.hasGuessed
          ? '<div class="guess-confirmed">✓ Tahminin alındı</div>'
          : '<form onsubmit="submitGuess(event)"><label class="guess-label" for="guess">Fiyat tahminin</label><div class="currency-input"><span>₺</span><input id="guess" type="text" inputmode="numeric" oninput="formatGuessInput(this,event)" oncompositionend="formatGuessInput(this,event)" autocomplete="off" maxlength="32" required placeholder="Örn. 1.250.000"></div><div class="guess-shortcuts" aria-label="Tahmin tutarını büyüt"><button type="button" class="guess-multiplier" onclick="multiplyGuess(1000)" aria-label="Tutarı bin ile çarp">Bin <small>×1.000</small></button><button type="button" class="guess-multiplier" onclick="multiplyGuess(1000000)" aria-label="Tutarı milyon ile çarp">Milyon <small>×1.000.000</small></button></div><button class="btn full" id="guessbtn"><span class="guess-submit-desktop">Tahminimi gönder</span><span class="guess-submit-mobile">Gönder</span><span class="guess-arrow" aria-hidden="true">→</span></button></form>') +
        '<p id="guess-status" role="status" aria-live="polite">' +
        room.submitted +
        ' / ' +
        room.players.length +
        ' oyuncu tahminini gönderdi</p></div>') +
    '<p class="game-footnote">Gerçek fiyat tur sonunda açılır. En yakın tahmin, en yüksek puanı alır.</p></section><div class="game-damage"><div class="panel-heading"><h3>HASAR GÖRÜNÜMÜ</h3><span>Boya · Değişen</span></div>' +
    (info ? '<img src="' + info.damageImage + '" alt="Boya ve değişen parça şeması">' : '') +
    '<div class="damage-summary"><span>Boya <b>' +
    esc(c[6]) +
    '</b></span><span>Değişen <b>' +
    esc(c[7]) +
    '</b></span></div></div><section class="game-scores"><div class="panel-heading"><h3>' +
    (revealed ? 'TUR SKORLARI' : 'PUAN TABLOSU') +
    '</h3><span>' +
    room.players.length +
    ' oyuncu</span></div>' +
    '<div id="game-score-list">' +
    scores +
    '</div><div class="score-tip"><span>✦</span><p>Her tahmin yeni bir şans.<br>Tam isabet <b>1.000 puan!</b></p></div></section></div>';
  const guessInput = $('#guess');
  if (
    guessInput &&
    guessDraftKey === room.code + '-' + (room.gameId || 'legacy') + '-' + room.round
  ) {
    guessInput.value = guessDraftValue;
    if (guessWasFocused) {
      guessInput.focus();
      const caret = Math.min(guessCaret ?? guessInput.value.length, guessInput.value.length);
      guessInput.setSelectionRange(caret, caret);
    }
  }
  if (room.mode === 'product-price') setupProductGame();
  tickTimer();
  setupMobileGameViewport();
  setupMobileRoundRanking();
}

async function act(a) {
  if (busy) return;
  busy = true;
  try {
    room = await call(a, room?.mode === 'auction' ? { round: room.round } : {});
    renderRoom();
  } catch (e) {
    toast(e.message);
  } finally {
    busy = false;
  }
}
async function submitGuess(e) {
  e.preventDefault();
  if (busy) return;
  busy = true;
  const guess = parseGuessAmount($('#guess').value, room?.mode === 'product-price');
  if (!Number.isFinite(guess) || guess < 1 || guess > 10000000000) {
    busy = false;
    toast('1 TL ile 10.000.000.000 TL arasında bir tahmin gir.');
    return;
  }
  $('#guessbtn').disabled = true;
  try {
    room = await call('guess', { guess });
    gameAudio.play('submit');
    sessionStorage.setItem(room.code + '-' + (room.gameId || 'legacy') + '-' + room.round, 'yes');
    renderRoom();
  } catch (e) {
    toast(e.message);
    refresh();
    $('#guessbtn') && ($('#guessbtn').disabled = false);
  } finally {
    busy = false;
  }
}
async function copyCode() {
  try {
    await navigator.clipboard.writeText(room.code);
    toast('Oda kodu kopyalandı: ' + room.code);
  } catch {
    toast('Oda kodun: ' + room.code);
  }
}
function showHow() {
  modal(
    '<span class="tag">OYUNUN KURALLARI</span><h2>Yaklaş, puanları topla.</h2><p>1. Bir profil oluştur ve odanı kur ya da kodla bir odaya katıl.</p><p>2. Araç markasını, modelini, yılını, kilometresini ve hasar bilgilerini incele.</p><p>3. Herkes fiyat tahminini gönderir. Ardından gerçek ilan fiyatı açılır.</p><p>4. Tahminin fiyatın yüzde 10 uzağındaysa 900 puan alırsın. Tam isabet 1.000 puan! Eşit sonuçlar aynı puanı alır.</p><p>5. 10, 15 veya 20 tur sonunda toplam puanı en yüksek oyuncu kazanır.</p><p class="notice">İlanlar gönderilen ekran görüntülerinden alınmıştır. Canlı ilan verisi kullanılmaz. Her oyunda farklı ilanlar ve model çeşitliliği gözetilir.</p>'
  );
}
user();
home();
const initialRoomCode = roomCodeFromPath();
if (initialRoomCode) openRoomLink(initialRoomCode);
else if (!profile) setTimeout(profileModal, 500);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && profile) closeModal();
});
</script></body></html>`;
}
