export const mobileGameStyles = String.raw`
.game-vehicle-info,
.game-round-result {
  display: contents;
}
.mobile-game-tabs,
.guess-submit-mobile {
  display: none;
}
.round-actions {
  margin-top: 16px;
}
@media (max-width: 700px) {
  body.game-mode main {
    padding: 0 10px 12px;
  }
  .game-mode header.topbar {
    display: none;
  }
  .game-top {
    position: sticky;
    top: 0;
    z-index: 35;
    gap: 12px;
    height: 58px;
    padding: 8px 2px;
    background: #111520;
  }
  .game-back {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    font-size: 22px;
  }
  .game-progress > div:first-child {
    margin-bottom: 7px;
  }
  .game-progress > div:first-child > strong {
    font-size: 14px;
  }
  .game-progress .progress {
    height: 4px;
  }
  .game-top .round-timer {
    font-size: 17px;
    padding: 8px 10px;
    border-radius: 9px;
  }
  .mobile-game-tabs {
    position: sticky;
    top: 58px;
    z-index: 34;
    display: flex;
    gap: 5px;
    padding: 4px 0 10px;
    background: #111520;
  }
  .mobile-game-tabs button {
    flex: 1;
    min-height: 39px;
    border: 1px solid #283040;
    border-radius: 10px;
    background: #1c222e;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 600;
  }
  .mobile-game-tabs button[aria-selected="true"] {
    background: #2b1d26;
    border-color: #e24046;
    color: #ffffff;
  }
  .game-board {
    display: block;
    min-height: 0;
    overflow: visible;
    border-radius: 16px;
    padding-bottom: var(--guess-dock-height, 185px);
  }
  .game-visual {
    padding: 10px 12px 0;
    border: 0;
    background: transparent;
  }
  .photo-stage {
    height: clamp(145px, 24svh, 205px);
    padding-top: 0;
  }
  .photo-badge {
    display: none;
  }
  .game-photo {
    max-height: 100%;
    width: 100%;
    border-radius: 11px;
  }
  .game-scores {
    display: none;
  }
  .game-board > .game-damage {
    display: block;
    margin: 0 14px 14px;
    padding: 14px;
    border-radius: 12px;
  }
  .game-details {
    padding: 12px 14px 14px;
  }
  .game-vehicle-info > .game-eyebrow {
    display: none;
  }
  .game-details h1 {
    font-size: 21px;
    margin: 0 0 10px;
    letter-spacing: -0.5px;
  }
  .game-vehicle-info > .vehicle-rows {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px 12px;
  }
  .game-vehicle-info > .vehicle-rows > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    min-height: 0;
    padding: 7px 0;
    border-color: #252b37;
  }
  .game-vehicle-info > .vehicle-rows span {
    font-size: 9px;
    width: auto;
  }
  .game-vehicle-info > .vehicle-rows b {
    font-size: 14px;
    line-height: 1.3;
  }
  .game-vehicle-info > .vehicle-rows > .vehicle-identity,
  .game-vehicle-info > .vehicle-rows > .vehicle-secondary {
    display: none;
  }
  .vehicle-extra {
    margin-top: 10px;
    font-size: 12px;
  }
  .vehicle-extra summary {
    padding: 8px 0;
    color: #f0ad5f;
  }
  .vehicle-extra .vehicle-rows {
    display: block;
  }
  .vehicle-extra .vehicle-rows > div {
    min-height: 0;
    gap: 14px;
    padding: 8px 0;
  }
  .vehicle-extra .vehicle-rows b {
    font-size: 12px;
  }
  .vehicle-extra p {
    font-size: 11px;
    line-height: 1.6;
  }
  .game-footnote {
    display: none;
  }
  .guess-card,
  .round-actions {
    position: fixed;
    left: 0;
    right: 0;
    bottom: var(--keyboard-gap, 0px);
    z-index: 40;
    margin: 0;
    padding: 12px 16px calc(10px + env(safe-area-inset-bottom));
    border: 1px solid #333d50;
    border-bottom: 0;
    border-radius: 18px 18px 0 0;
    background: #1c222e;
    box-shadow: 0 -10px 35px #0007;
  }
  .guess-card > .game-eyebrow,
  .guess-card > h2 {
    display: none;
  }
  .guess-card form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 100px;
    grid-template-areas: "label label" "input submit" "shortcuts shortcuts";
    gap: 7px 10px;
  }
  .guess-label {
    grid-area: label;
    font-size: 10px;
    margin: 0;
    color: #94a3b8;
  }
  .currency-input {
    grid-area: input;
    padding: 0 12px;
    gap: 9px;
    border-radius: 10px;
  }
  .currency-input > span {
    font-size: 19px;
  }
  .currency-input input {
    font-size: 20px;
    padding: 12px 0;
    line-height: 24px;
  }
  .guess-card .btn.full {
    grid-area: submit;
    width: auto;
    margin: 0;
    padding: 12px 8px;
    min-height: 48px;
    justify-content: center;
    border-radius: 10px;
    font-size: 14px;
  }
  .guess-submit-desktop,
  .guess-card .btn > .guess-arrow {
    display: none;
  }
  .guess-submit-mobile {
    display: inline;
  }
  .guess-shortcuts {
    grid-area: shortcuts;
    gap: 8px;
    margin: 0;
  }
  .guess-multiplier {
    padding: 8px;
    min-height: 34px;
    font-size: 12px;
  }
  .guess-multiplier small {
    display: inline;
    font-size: 9px;
    margin-left: 6px;
  }
  .guess-card p {
    font-size: 9px;
    margin: 7px 0 0;
  }
  .guess-confirmed {
    padding: 8px;
    font-size: 13px;
  }
  .game-board[data-mobile-panel="damage"] .photo-stage {
    display: none;
  }
  .game-board[data-mobile-panel="damage"] .game-damage {
    display: block;
    margin: 0;
    padding: 14px;
    border-radius: 12px;
  }
  .game-board[data-mobile-panel="damage"] .game-visual {
    padding: 12px;
  }
  .game-damage .panel-heading {
    margin-bottom: 12px;
  }
  .game-damage > img {
    height: min(43svh, 360px);
  }
  .damage-summary {
    font-size: 10px;
    gap: 12px;
  }
  .damage-summary b {
    font-size: 11px;
    line-height: 1.5;
  }
  .game-board[data-mobile-panel="scores"] .game-visual,
  .game-board[data-mobile-panel="scores"] > .game-damage {
    display: none;
  }
  .game-board[data-mobile-panel="scores"] .game-scores {
    display: block;
    padding: 14px;
    border: 0;
    background: transparent;
  }
  .game-scores .panel-heading {
    margin-bottom: 12px;
  }
  .rank-card {
    padding: 9px;
    margin-bottom: 7px;
  }
  .score-tip {
    display: none;
  }
  .game-board[data-mobile-panel="damage"] .game-details,
  .game-board[data-mobile-panel="scores"] .game-details {
    padding: 0;
  }
  .game-board[data-mobile-panel="damage"]
    .game-details
    > :not(.guess-card):not(.round-actions):not(.game-round-result),
  .game-board[data-mobile-panel="scores"]
    .game-details
    > :not(.guess-card):not(.round-actions):not(.game-round-result) {
    display: none;
  }
  .game-board[data-mobile-panel="scores"] .game-round-result > :not(.round-actions) {
    display: none;
  }
  .actual-price {
    padding: 14px;
    margin-top: 10px;
    border-radius: 12px;
  }
  .actual-price strong {
    font-size: 29px;
    margin-top: 7px;
  }
  .reveal-label {
    margin-top: 14px;
  }
  .result-tiles {
    margin-top: 10px;
  }
  .result-tiles > div {
    padding: 10px 8px;
  }
  .result-tiles b {
    margin-top: 7px;
  }
  .round-actions .btn {
    margin: 0;
    min-height: 46px;
  }
  .game-board[data-state="reveal"] {
    padding-bottom: var(--guess-dock-height, 85px);
  }
}
@media (max-width: 700px) and (max-height: 650px) {
  .photo-stage {
    height: 135px;
  }
  .game-details h1 {
    font-size: 18px;
  }
  .game-vehicle-info > .vehicle-rows > div {
    padding: 5px 0;
  }
}
`;
export const mobileGameClient = String.raw`
let gameDockObserver = null,
  observedGameDock = null;
function updateMobileGameViewport() {
  const mobile = window.matchMedia('(max-width:700px)').matches,
    viewport = window.visualViewport;
  const gap =
    mobile && viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
  document.documentElement.style.setProperty('--keyboard-gap', Math.round(gap) + 'px');
  const dock = document.querySelector('.guess-card,.round-actions');
  document.documentElement.style.setProperty(
    '--guess-dock-height',
    mobile && dock ? Math.ceil(dock.getBoundingClientRect().height + 14) + 'px' : '0px'
  );
}
function setupMobileGameViewport() {
  const dock = document.querySelector('.guess-card,.round-actions');
  if (dock !== observedGameDock) {
    gameDockObserver?.disconnect();
    observedGameDock = dock;
    if (dock && typeof ResizeObserver !== 'undefined') {
      gameDockObserver = new ResizeObserver(updateMobileGameViewport);
      gameDockObserver.observe(dock);
    }
  }
  updateMobileGameViewport();
}
function setMobileGamePanel(panel) {
  if (!['car', 'damage', 'scores'].includes(panel)) return;
  const board = document.querySelector('.game-board');
  if (!board) return;
  board.dataset.mobilePanel = panel;
  for (const button of document.querySelectorAll('.mobile-game-tabs button')) {
    const selected = button.dataset.panel === panel;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  updateMobileGameViewport();
}
function handleMobilePanelKey(event) {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const tabs = [...event.currentTarget.querySelectorAll('button')],
    index = tabs.indexOf(document.activeElement),
    next = (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[next].click();
  tabs[next].focus();
}
window.addEventListener('resize', updateMobileGameViewport);
window.visualViewport?.addEventListener('resize', updateMobileGameViewport);
window.visualViewport?.addEventListener('scroll', updateMobileGameViewport);
`;
