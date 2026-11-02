---
target: worker/ui/app-shell.js
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
target_identity: "file:c:\\Users\\user\\Documents\\GitHub\\OGZ_Game\\worker\\ui\\app-shell.js"
target_fingerprint: "sha256:e4418d986556696e5d401a4329583d9a95cf84a4b51c15259500dc00abbc0e1d"
target_path: "c:\\Users\\user\\Documents\\GitHub\\OGZ_Game\\worker\\ui\\app-shell.js"
timestamp: 2026-11-02T18-44-38Z
slug: worker-ui-app-shell-js
---
Method: dual-agent (A: 20e402e2-93d7-4134-b4b0-3105cf59fedb · B: deterministic CLI scan)

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|:---:|---|
| 1 | Visibility of System Status | 3/4 | Active round timer with urgent threshold (≤10s) and progress bar work well. However, `#connection` element is absent during active gameplay (`renderGame()`), causing silent connection failure if WebSocket/polling drops. |
| 2 | Match Between System and Real World | 4/4 | Flawless domain resonance for Turkish automotive trivia: Sahibinden-grade damage schematics (`Boya ve değişen durumu`), Turkish currency (`₺`), and quick magnitude multipliers (`Bin ×1.000`, `Milyon ×1.000.000`). |
| 3 | User Control and Freedom | 1/4 | **Hostage Onboarding Trap**: Forced `profileModal` launches at 500ms on first load; `closeModal()` outright blocks dismissal if `!profile`. No guest browsing. Furthermore, submitted guesses cannot be edited/undone during the active countdown. |
| 4 | Consistency and Standards | 3/4 | Cohesive dark-theme palette (`#111520`, `#1c222e`, crimson `#e24046`, gold `#f0ad5f`) and type pairing. Minor inconsistency: floating uncontained topbar on home vs. hidden in game mode vs. static in lobby. |
| 5 | Error Prevention | 2/4 | Inputs sanitize non-numeric values and format thousands separators nicely. However, locking guesses immediately on submit without a confirmation or 3-second grace window causes irreversible fat-finger errors during high-speed trivia. |
| 6 | Recognition Rather Than Recall | 3/4 | Technical specs, vehicle photos, and damage reports are front-and-center. Downside: Mobile tabs hide vehicle details when viewing live scores, and coming-soon cards look actionable despite being dead ends. |
| 7 | Flexibility and Efficiency of Use | 2/4 | Multiplier buttons (`×1.000`, `×1.000.000`) accelerate input, but party workflow is crippled by lacking shareable invite URLs (`?join=CODE`) and lacking in-lobby settings adjustment or player kick controls. |
| 8 | Aesthetic and Minimalist Design | 3/4 | High-craft visual execution with custom SVG art and slanted 3D cards (`skewX(-6deg)`). Deducted for visual pretense: 3 static carousel dots that don't paginate, and non-functional coming-soon cards masquerading as playable games. |
| 9 | Help Users Recognize, Diagnose, and Recover from Errors | 2/4 | Generic bottom toasts with 4.5s timeout. No inline field validation in modals. When connection drops in-game, there is no manual "Yeniden Bağlan" recovery action. |
| 10 | Help and Documentation | 1/4 | A comprehensive 5-step rule modal (`showHow()`) exists in JavaScript, but is **completely orphaned**: there is not a single button, link, or help icon anywhere in the DOM to trigger it. |
| **Total** | | **24/40** | **Acceptable (60%)** |

---

### Design Specificity Verdict

**Verdict**: **Authored specifically for OGZ Game, but weighed down by generic party-game tropes and dead-end teasers.**

- **LLM Assessment**: The core game surface is deeply rooted in Turkish car marketplace culture. The Sahibinden-style vehicle damage matrix (boya/değişen parts schema), the Turkish lira formatting with period group separators, the quick `Bin` / `Milyon` multipliers, and the relative scoring formula `1.000 × (1 − fark)` are custom-crafted specifically for this game. However, the hero illustration uses a generic neon console gamepad floating with speed lines (alien to a web/mobile price trivia game), the avatars are generic sci-fi/fantasy tropes rather than localized consumer archetypes, and 3 out of 5 mode cards are non-functional teasers.
- **Deterministic Scan**: The `detect.mjs` scan identified 10 warnings across `worker/ui/app-shell.js`:
  - 9 instances of `overused-font` (`Space Grotesk`), noting that it is heavily saturated in AI-generated templates.
  - 1 instance of `layout-transition` on `.home-dot` (`transition: width .2s`), which triggers browser layout recalculation and repaint instead of compositor-only transforms.
- **Visual Overlays**: No browser automation tool is attached to this session; skipped overlay injection (fallback: deterministic CLI scan and code inspection).

---

### Overall Impression
OGZ Game has a distinctive visual world with tactile slanted 3D mode cards, a rich dark palette (obsidian navy, cherry red, and golden amber), and authentic automotive trivia mechanics. The single biggest opportunity is transforming it from a rigid demo into a frictionless multiplayer party game by removing the forced profile gate, linking direct WhatsApp room invitations, and letting players fix accidental guess typos before the clock runs out.

---

### What's Working
1. **The FLIP Mobile Leaderboard Transition (`round-ranking.js`)**: Smooth score tallying with cubic-bezier easing and animated position reordering (`↑ 2 sıra` in green, `↓ 1 sıra` in red) delivers authentic gameshow dopamine.
2. **Authentic Turkish Marketplace Information Architecture**: Specs are prioritized logically (Marka → Model → Yıl → KM → Yakıt/Vites → Hasar), mirroring what Turkish car enthusiasts actually inspect.
3. **Resilient Mobile Keyboard & Viewport Docking (`mobile-game.js`)**: Using `visualViewport` events to calculate `--keyboard-gap` and `--guess-dock-height` ensures the input and submit button remain visible above virtual keyboards.

---

### Priority Issues

#### [P0] Inescapable Onboarding Hostage Modal
- **Why It Matters**: Visiting the site without a profile triggers `profileModal()` after 500ms. Attempting to click "×", click the backdrop, or press Escape fails with `toast('Devam etmek için önce bir profil oluştur.')`. Casual visitors cannot preview game modes or explore the site, creating an immediate bounce hazard.
- **Fix**: Remove `setTimeout(profileModal, 500)`. Only trigger profile creation just-in-time when a user clicks "Hemen Oyna", "Oda Kur", or a mode card. Allow closing the modal to return to guest preview mode.
- **Suggested Command**: `$impeccable onboard worker/ui/app-shell.js`

#### [P1] Orphaned Game Rules (`showHow` is Dead Code)
- **Why It Matters**: `showHow()` contains an excellent 5-step guide explaining the game's unique relative scoring formula (`1.000 × (1 - fark)`), but it is never rendered, linked, or referenced in the UI. Players have no discoverable way to learn how scoring works.
- **Fix**: Add a persistent "Nasıl Oynanır?" button in the top navigation bar next to "Ayarlar" (`onclick="showHow()"`) and a subtle "Kurallar" link inside the room lobby card.
- **Suggested Command**: `$impeccable clarify worker/ui/app-shell.js`

#### [P2] Irreversible Guess Submission (No Edit / Grace Period)
- **Why It Matters**: In high-speed trivia, fat-finger errors on mobile numeric pads happen constantly (e.g. typing 120000 instead of 1200000). Tapping "Gönder" immediately disables the form permanently. Players must endure the remaining 20+ seconds knowing their score is ruined.
- **Fix**: Keep the input editable until the countdown reaches 0 or all players have submitted. Change the button to "Tahmini Güncelle" after initial submission.
- **Suggested Command**: `$impeccable harden worker/ui/app-shell.js`

#### [P3] Absence of Direct Shareable Room Links (WhatsApp Friction)
- **Why It Matters**: The lobby only offers "Kodu kopyala" (a raw 6-character string). In real party settings over WhatsApp/Discord, friends must navigate to the site manually, endure profile creation, tap "Hemen Oyna", and type the code.
- **Fix**: Add "Davet Linkini Kopyala" (`${window.location.origin}/?join=${room.code}`). Read `?join=CODE` on mount to automatically open the join flow with the code pre-filled.
- **Suggested Command**: `$impeccable polish worker/ui/app-shell.js`

#### [P3] Misleading Non-Functional Mode Cards & Static Carousel Dots
- **Why It Matters**: "Açık Arttırma" and "Kelime Tahmini" look like playable 3D cards, but clicking them triggers a dead-end toast. The three `home-dots` underneath mimic a carousel indicator, but clicking or swiping does nothing.
- **Fix**: Give "Yakında" cards a distinct muted visual treatment (e.g. `opacity: 0.65`, no pointer hover lift, explicit "Yapım Aşamasında" badge) or distill them into a single roadmap teaser. Remove the decorative fake carousel dots.
- **Suggested Command**: `$impeccable distill worker/ui/app-shell.js`

---

### Persona Red Flags
- **"Can" (The Party Host — Fast Room Setup)**:
  - *Red Flag*: In the lobby, Can copies the code to WhatsApp. Friends ask: "Which website? Where do I enter this?" There is no 1-click invite link.
  - *Red Flag*: Can cannot adjust the round timer or round count once the room is created; if friends want a longer timer, Can must destroy the room and generate a new code.
- **"Zeynep" (Casual Mobile Player — Joining via WhatsApp Link)**:
  - *Red Flag*: Opens the link, gets interrupted after 500ms by a profile modal she cannot dismiss, and almost leaves before realizing she must pick an avatar just to look around.
  - *Red Flag*: Submits an extra zero by mistake on mobile; locked out of editing for 25 seconds with 0 points awarded.
- **"Burak" (Competitive Auto Trivia Enthusiast)**:
  - *Red Flag*: Wins 1st place after 15 rounds of intense bidding, but the final screen is a static single-box card with no podium, no 2nd/3rd place recognition, and no stats highlight (e.g., closest guess of the match).

---

### Minor Observations
- Header topbar is `position: fixed; top: 22px; right: 28px;` without a unified background, floating awkwardly across different responsive breakpoints.
- `#connection` status is present in the lobby (`<p id="connection">`), but removed in `renderGame()`, leaving players blind if their connection drops during a live round.
- Layout transition warning in `.home-dot`: animating `width` causes layout thrash.
- Custom uploaded photo avatar uses client canvas 180x180 JPEG data URI stored in localStorage, which can bloat profile state if not constrained.

---

### Questions to Consider
1. *What if avatars were localized Turkish car and shopping archetypes (e.g. "Galirici", "Ekspertiz Ustası", "Pazarlıkçı Dayı", "Kuponcu") instead of generic sci-fi/fantasy characters?*
2. *What if room links carried invite state directly (`ogz.game/?join=CODE`), allowing guests to join from WhatsApp with a single tap and configure their nickname right in the lobby?*
3. *What if the round reveal featured a visual price axis showing everyone's guesses relative to the real listing price, letting players instantly see who underbid or overbid the most?*
