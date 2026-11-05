export const desktopGameStyles = String.raw`
body.game-mode header.topbar {
  display: none;
}
.game-damage .panel-heading,
.game-damage .damage-summary {
  display: none;
}
@media (min-width: 701px) {
  body.game-mode main {
    padding: 0 16px 12px;
    max-width: none;
  }
  .game-mode .game-top {
    height: 64px;
    padding: 8px 0 12px;
    gap: 16px;
    box-sizing: border-box;
  }
  .game-top .game-back {
    width: 40px;
    height: 40px;
    border-radius: 11px;
    font-size: 23px;
  }
  .game-top .game-progress > div:first-child {
    margin-bottom: 7px;
  }
  .game-top .round-timer {
    font-size: 20px;
    padding: 9px 16px;
    min-width: 100px;
    text-align: center;
  }
  .game-board {
    height: calc(100dvh - 76px);
    min-height: 0;
    grid-template-columns: minmax(0, 1.05fr) minmax(310px, 1fr) minmax(210px, 0.65fr);
    grid-template-rows: minmax(0, 1.2fr) minmax(0, 1fr);
    border-radius: 18px;
  }
  .game-board > .game-visual {
    grid-column: 1;
    grid-row: 1;
    padding: 16px;
    min-width: 0;
    min-height: 0;
  }
  .photo-stage {
    height: 100%;
    min-height: 0;
    padding-top: 0;
  }
  .photo-badge {
    display: none;
  }
  .game-photo {
    width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .game-board > .game-details {
    display: contents;
  }
  .game-vehicle-info {
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
    min-height: 0;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
  }
  .game-vehicle-info > .game-eyebrow,
  .game-vehicle-info > .vehicle-extra,
  .game-footnote {
    display: none;
  }
  .game-details h1 {
    font-size: clamp(21px, 1.8vw, 29px);
    line-height: 1.15;
    margin: 0 0 12px;
  }
  .game-vehicle-info > .vehicle-rows {
    display: flex;
    flex: 1;
    min-height: 0;
    flex-direction: column;
  }
  .game-vehicle-info > .vehicle-rows > .vehicle-identity {
    display: none;
  }
  .game-vehicle-info > .vehicle-rows > div {
    flex: 1;
    min-height: 0;
    padding: 5px 0;
    gap: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .game-vehicle-info > .vehicle-rows span {
    width: 110px;
    flex-shrink: 0;
    font-size: 12px;
  }
  .game-vehicle-info > .vehicle-rows b {
    font-size: 17px;
    line-height: 1.25;
    text-align: right;
    overflow-wrap: anywhere;
  }
  .game-round-result {
    grid-column: 2;
    grid-row: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 0;
    margin: 0 18px 14px;
  }
  .game-board .guess-card {
    grid-column: 2;
    grid-row: 2;
    align-self: stretch;
    margin: 0 18px 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .guess-card {
    margin-top: 16px;
    padding: 10px 12px;
    border-radius: 12px;
  }
  .guess-card > .game-eyebrow,
  .guess-card > h2 {
    display: none;
  }
  .guess-card form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 110px;
    grid-template-areas: "label label" "input submit" "shortcuts shortcuts";
    gap: 6px 8px;
  }
  .guess-label {
    grid-area: label;
    margin: 0;
    font-size: 10px;
  }
  .currency-input {
    grid-area: input;
    padding: 0 10px;
    gap: 8px;
  }
  .currency-input input {
    font-size: 20px;
    padding: 10px 0;
  }
  .currency-input > span {
    font-size: 20px;
  }
  .guess-card .btn.full {
    grid-area: submit;
    margin: 0;
    padding: 10px 8px;
    min-height: 44px;
    font-size: 12px;
    justify-content: center;
  }
  .guess-submit-desktop,
  .guess-arrow {
    display: none;
  }
  .guess-submit-mobile {
    display: inline;
  }
  .guess-shortcuts {
    grid-area: shortcuts;
    margin: 0;
    gap: 8px;
  }
  .guess-multiplier {
    padding: 6px;
    font-size: 11px;
  }
  .guess-multiplier small {
    display: inline;
    margin-left: 5px;
    font-size: 9px;
  }
  .guess-card p {
    margin: 6px 0 0;
    font-size: 9px;
  }
  .guess-confirmed {
    padding: 12px;
    font-size: 13px;
  }
  .game-board > .game-damage {
    grid-column: 1;
    grid-row: 2;
    min-height: 0;
    margin: 0 16px 14px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
  }
  .game-damage .panel-heading,
  .damage-summary {
    display: none;
  }
  .game-damage > img {
    width: 100%;
    height: 100%;
    min-height: 0;
    object-fit: contain;
  }

  .game-board > .game-scores {
    grid-column: 3;
    grid-row: 1/3;
    padding: 18px 12px;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    border-top: 0;
    border-left: 1px solid #252b37;
  }
  .game-scores .panel-heading {
    margin-bottom: 14px;
  }
  .game-scores .panel-heading h3 {
    font-size: 10px;
  }
  .rank-card {
    padding: 10px 7px;
    margin-bottom: 7px;
    gap: 6px;
  }
  .rank-card > img {
    width: 26px;
    height: 26px;
  }
  .rank-name strong {
    font-size: 11px;
  }
  .rank-points > b {
    font-size: 18px;
  }
  .score-tip {
    display: none;
  }
  .reveal-label {
    margin-top: 16px;
    font-size: 10px;
  }
  .actual-price {
    padding: 10px 13px;
    margin-top: 7px;
    border-radius: 11px;
  }
  .actual-price strong {
    font-size: 28px;
    margin-top: 4px;
  }
  .result-tiles {
    margin-top: 7px;
    gap: 6px;
  }
  .result-tiles > div {
    padding: 7px 6px;
  }
  .result-tiles span {
    font-size: 8px;
  }
  .result-tiles b {
    margin-top: 5px;
    font-size: 11px;
  }
  .round-actions {
    margin-top: 8px;
  }
  .round-actions .btn {
    min-height: 38px;
    padding: 9px 12px;
    margin: 0;
    font-size: 12px;
  }
}
@media (min-width: 701px) and (max-height: 740px) {
  .game-board {
    grid-template-rows: minmax(0, 1.2fr) minmax(0, 1fr);
  }
  .game-vehicle-info {
    padding: 10px 14px;
  }
  .game-details h1 {
    font-size: 18px;
    margin-bottom: 5px;
  }
  .game-vehicle-info > .vehicle-rows > div {
    padding: 4px 0;
  }
  .guess-card {
    padding: 8px 10px;
  }
  .game-board > .game-damage {
    padding: 9px 12px;
    margin-bottom: 10px;
  }
  .game-damage .panel-heading {
    margin: 0;
  }
}
@media (min-width: 701px) and (max-height: 650px) {
  .game-vehicle-info > .vehicle-rows > div {
    padding: 3px 0;
  }
  .game-vehicle-info > .vehicle-rows span {
    font-size: 11px;
  }
  .game-vehicle-info > .vehicle-rows b {
    font-size: 15px;
  }
  .game-details h1 {
    font-size: 17px;
  }
  .actual-price {
    padding: 7px 10px;
  }
  .actual-price strong {
    font-size: 24px;
  }
  .result-tiles > div {
    padding: 5px;
  }
  .round-actions .btn {
    min-height: 34px;
    padding: 7px 10px;
  }
}
@media (min-width: 701px) {
  .game-board .guess-card {
    padding: clamp(12px, 1.5vw, 22px);
    background: linear-gradient(145deg, #222938, #181d28);
    border-color: #343e52;
    justify-content: flex-start;
    gap: 10px;
    min-height: 0;
  }
  .guess-card form {
    flex: 1;
    min-height: 0;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "label" "input" "shortcuts" "submit";
    grid-template-rows: auto minmax(48px, 1.1fr) minmax(34px, 0.65fr) minmax(40px, 0.8fr);
    gap: 8px;
  }
  .guess-label {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #e2e8f0;
  }
  .currency-input {
    height: 100%;
    min-height: 0;
    padding: 0 16px;
    border-radius: 12px;
    background: #111520;
    border-color: #384256;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;
  }
  .currency-input:focus-within {
    border-color: #e24046;
    box-shadow: 0 0 0 3px #e2404622;
  }
  .currency-input > span {
    font-size: 28px;
  }
  .currency-input input {
    height: 100%;
    box-sizing: border-box;
    padding: 6px 0;
    font-size: clamp(23px, 2.2vw, 34px);
    font-variant-numeric: tabular-nums;
  }
  .currency-input input::placeholder {
    color: #64748b;
  }
  .guess-shortcuts {
    height: 100%;
    gap: 10px;
  }
  .guess-multiplier {
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 14px;
    background: #242b3b;
    border-color: #364156;
    color: #f8fafc;
  }
  .guess-multiplier:hover {
    background: #2d364a;
    border-color: #f0ad5f;
  }
  .guess-multiplier small {
    font-size: 10px;
    color: #f0ad5f;
  }
  .guess-card .btn.full {
    height: 100%;
    min-height: 0;
    padding: 8px 16px;
    border-radius: 11px;
    font-size: 15px;
    font-weight: 700;
    gap: 12px;
    justify-content: space-between;
    box-shadow: 0 4px 18px #e2404628;
  }
  .guess-card .guess-submit-desktop,
  .guess-card .guess-arrow {
    display: inline;
  }
  .guess-card .guess-submit-mobile {
    display: none;
  }
  .guess-card p {
    margin: 0;
    color: #94a3b8;
    font-size: 10px;
    line-height: 1.4;
  }
  .guess-confirmed {
    margin: auto 0;
    padding: 20px;
    font-size: 17px;
  }
}
@media (min-width: 701px) and (max-height: 650px) {
  .game-board .guess-card {
    padding: 10px 12px;
    gap: 6px;
  }
  .guess-card form {
    gap: 5px;
    grid-template-rows: auto minmax(42px, 1.1fr) minmax(30px, 0.65fr) minmax(34px, 0.8fr);
  }
  .guess-label {
    font-size: 11px;
  }
  .currency-input input {
    font-size: 23px;
  }
  .guess-multiplier {
    font-size: 12px;
  }
  .guess-card .btn.full {
    font-size: 13px;
  }
}
`;

// One viewport budget for active games; do not reserve the home/lobby toolbar twice.
export const gameViewportStyles = String.raw`
body:is(.auction-active, .number-active, .battleship-active) > main {
  max-width: none;
  padding: 8px 16px;
}
body.game-mode > main {
  padding: 0 16px 12px;
  max-width: none;
}
.bh-mobile-tabs {
  display: none;
}
@media (min-width: 761px) {
  .auction-page:has(.auction-grid) {
    height: calc(100dvh - 16px);
    padding: 0;
    max-width: 1400px;
    display: flex;
    flex-direction: column;
  }
  .auction-page:has(.auction-grid) .auction-heading {
    flex: none;
    margin: 0 0 10px;
    gap: 12px;
  }
  .auction-page:has(.auction-grid) .auction-heading > div:first-child {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 4px 12px;
  }
  .auction-page:has(.auction-grid) .auction-heading h1 {
    font-size: clamp(20px, 2.2vw, 28px);
    margin: 0;
  }
  .auction-heading .tag {
    font-size: 9px;
    padding: 6px 9px;
  }
  .auction-page:has(.auction-grid) .auction-heading p {
    grid-column: 1/-1;
    font-size: 11px;
    margin: 0;
  }
  .auction-heading .btn {
    padding: 9px 14px;
    min-height: 38px;
    font-size: 12px;
  }
  .auction-page .auction-grid {
    flex: 1;
    min-height: 0;
    gap: 14px;
    grid-template-columns: minmax(0, 1.15fr) minmax(330px, 1fr);
    align-items: stretch;
  }
  .auction-grid .auction-lot {
    min-height: 0;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: stretch;
  }
  .auction-lot > .tag {
    align-self: center;
    padding: 5px 9px;
    font-size: 9px;
    flex: none;
  }
  .auction-lot .auction-plate,
  .auction-lot .auction-plate:has(img) {
    flex: 1;
    min-height: 70px;
    height: auto;
    width: 100%;
    max-width: none;
    margin: 0;
    background: #10201f;
  }
  .auction-lot .auction-image-credit {
    font-size: 9px;
    align-self: center;
  }
  .auction-lot h2 {
    font-size: clamp(21px, 2.4vw, 30px);
    line-height: 1.1;
    margin: 2px 0;
    flex: none;
  }
  .auction-lot .auction-turn {
    margin: 0;
    padding: 7px 12px;
    font-size: 13px;
    flex: none;
  }
  .auction-lot .auction-price {
    font-size: 30px;
    line-height: 1.1;
    margin: 0;
    flex: none;
  }
  .auction-lot .auction-bidder {
    display: none;
  }
  .auction-lot .auction-form {
    margin: 0;
    padding: 10px;
    flex: none;
  }
  .auction-form .auction-hint {
    display: none;
  }
  .auction-form label {
    font-size: 11px;
  }
  .auction-input-row {
    margin-top: 5px;
    gap: 8px;
  }
  .auction-input-row .input {
    font-size: 22px;
    padding: 9px 12px;
  }
  .auction-input-row .btn {
    padding: 9px 14px;
    min-height: 42px;
    font-size: 12px;
  }
  .auction-shortcuts {
    gap: 6px;
    margin: 6px 0;
  }
  .auction-shortcuts button {
    padding: 7px;
    font-size: 12px;
  }
  .auction-form .auction-pass {
    margin-top: 6px;
    padding: 8px;
    font-size: 12px;
  }
  .auction-decision-actions {
    margin-top: 8px;
  }
  .auction-decision-actions .btn {
    min-height: 40px;
    padding: 9px 12px;
    font-size: 13px;
  }
  .auction-lot .auction-sale {
    margin-top: 3px;
    padding: 10px;
    font-size: 13px;
  }
  .auction-lot > .btn.full {
    margin: 0;
    min-height: 40px;
    padding: 10px;
  }
  .auction-sidebar {
    min-height: 0;
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
  }
  .auction-sidebar .auction-rules {
    display: none;
  }
  .auction-sidebar .auction-player {
    margin: 0;
    padding: 14px;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .auction-sidebar .auction-player-header .avatar {
    width: 34px;
    height: 34px;
  }
  .auction-sidebar .auction-player-header strong {
    font-size: 15px;
  }
  .auction-sidebar .auction-wallet b {
    font-size: 22px;
  }
  .auction-sidebar .auction-player-header small {
    font-size: 11px;
  }
  .auction-sidebar .auction-collection {
    flex: 1;
    min-height: 0;
    margin-top: 10px;
    gap: 6px;
  }
  .auction-sidebar .auction-slot,
  .auction-sidebar .auction-slot:has(img) {
    min-height: 0;
    padding: 5px;
    gap: 5px;
  }
  .auction-sidebar .auction-slot img {
    height: clamp(35px, 12dvh, 110px);
    min-height: 0;
    object-fit: cover;
  }
  .auction-sidebar .auction-slot b {
    font-size: 11px;
  }
  .auction-sidebar .auction-slot small {
    font-size: 11px;
  }
  .nr-page:not(:has(.nr-summary)) {
    height: calc(100dvh - 16px);
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .nr-page > .nr-head {
    flex: none;
    margin: 0;
    gap: 12px;
  }
  .nr-head h1 {
    font-size: 24px;
    margin: 3px 0;
  }
  .nr-head p {
    font-size: 11px;
    margin: 3px 0;
  }
  .nr-head .tag {
    font-size: 9px;
    padding: 5px 8px;
  }
  .nr-target,
  .nr-clock {
    padding: 9px 12px;
    font-size: 13px;
  }
  .nr-status .btn {
    padding: 8px 12px;
    min-height: 36px;
    font-size: 12px;
  }
  .nr-page > .nr-note {
    flex: none;
    padding: 7px 12px;
    margin: 0;
    font-size: 11px;
  }
  .nr-page > .nr-layout,
  .nr-page > .nr-prep-layout {
    flex: 1;
    min-height: 0;
    gap: 14px;
    align-items: stretch;
  }
  .nr-page > .notice {
    display: none;
  }
  .nr-panel {
    min-height: 0;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .nr-panel h2 {
    font-size: 13px;
    margin-bottom: 5px;
  }
  .nr-panel p {
    font-size: 11px;
    margin: 3px 0 8px;
  }
  .nr-bar {
    margin: 7px 0 10px;
  }
  .nr-panel > .nr-grid {
    width: min(100%, calc(100dvh - 245px));
    align-self: center;
    gap: 4px;
    padding: 6px;
  }
  .nr-cell {
    font-size: clamp(11px, 1.7vw, 23px);
  }
  .nr-prep {
    min-height: 0;
    padding: 10px;
    align-self: center;
  }
  .nr-prep-label {
    font-size: 10px;
  }
  .nr-prep h2 {
    font-size: 16px;
    margin: 4px 0;
  }
  .nr-prep-status {
    margin: 6px 0;
    font-size: 10px;
  }
  .nr-prep-status span {
    padding: 3px 6px;
  }
  .nr-prep-controls {
    margin: 7px 0;
    font-size: 11px;
  }
  .nr-prep-controls button {
    padding: 6px 9px;
  }
  .nr-prep-tip {
    font-size: 9px;
    line-height: 1.3;
    margin: 5px 0;
  }
  .nr-prep .nr-grid {
    width: min(100%, calc(100dvh - 355px));
    margin: auto;
    padding: 5px;
    gap: 3px;
  }
  .nr-prep .nr-cell {
    font-size: clamp(9px, 1.1vw, 16px);
  }
  .nr-confirm {
    margin-top: 8px;
    padding: 9px 10px;
    min-height: 36px;
    font-size: 12px;
  }
  .bh-page:not(.bh-final) {
    height: calc(100dvh - 16px);
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .bh-page .bh-toolbar {
    flex: none;
    margin: 0 0 8px;
  }
  .bh-anchor {
    width: 28px;
    height: 28px;
  }
  .bh-tools .btn {
    min-height: 32px;
    padding: 7px 12px;
  }
  .bh-head {
    flex: none;
    margin: 0 0 10px;
    gap: 14px;
  }
  .bh-heading h1 {
    font-size: 25px;
    margin: 5px 0;
  }
  .bh-heading p {
    font-size: 11px;
    margin: 3px 0;
  }
  .bh-player {
    padding: 9px;
  }
  .bh-player img {
    width: 34px;
    height: 34px;
  }
  .bh-mini-fleet {
    margin-top: 5px;
  }
  .bh-page .bh-shot-message {
    flex: none;
    min-height: 24px;
    margin: 0 0 8px;
    font-size: 15px;
  }
  .bh-page > .bh-layout {
    flex: 1;
    min-height: 0;
    gap: 14px;
    align-items: stretch;
  }
  .bh-ocean {
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 12px;
  }
  .bh-ocean-title {
    flex: none;
    margin-bottom: 10px;
    font-size: 11px;
  }
  .bh-page .bh-board {
    width: min(100%, calc(100dvh - 360px));
    margin: 0 auto;
  }
  .bh-page:has(.bh-shot-message) .bh-board {
    width: min(100%, calc(100dvh - 240px));
    margin: auto;
  }
  .bh-placement {
    margin-top: 8px;
    padding: 8px;
  }
  .bh-direction {
    padding: 6px;
  }
  .bh-direction small {
    font-size: 8px;
  }
  .bh-direction b {
    font-size: 14px;
  }
  .bh-direction button {
    padding: 6px 10px;
    font-size: 11px;
  }
  .bh-placement .bh-hint {
    display: none;
  }
  .bh-ship-list {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 5px;
    margin-top: 8px;
  }
  .bh-ship-choice {
    padding: 6px;
    font-size: 9px;
  }
  .bh-ship-choice small {
    font-size: 9px;
  }
  .bh-ship-choice svg {
    height: 12px;
    margin-top: 4px;
  }
  .bh-placement-actions {
    gap: 6px;
    margin-top: 8px;
  }
  .bh-placement-actions .btn {
    min-height: 32px;
    padding: 7px 9px;
    font-size: 11px;
  }
  .bh-placement-actions .ready {
    min-width: 110px;
  }
  .bh-radar-wait {
    flex: 1;
    min-height: 0;
    aspect-ratio: auto;
  }
  .bh-final .bh-layout .bh-board {
    width: min(100%, calc(100dvh - 340px));
  }
}
@media (max-width: 760px) {
  body:is(.auction-active, .number-active, .battleship-active) > main {
    padding: 6px 10px;
  }
  .auction-page:has(.auction-grid) {
    height: calc(100dvh - 12px);
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .auction-heading {
    margin-bottom: 7px;
    gap: 8px;
  }
  .auction-heading h1 {
    font-size: 19px;
    margin: 3px 0;
  }
  .auction-heading .tag {
    font-size: 8px;
    padding: 4px 7px;
  }
  .auction-heading p {
    font-size: 10px;
  }
  .auction-heading .btn {
    min-height: 34px;
    padding: 7px 10px;
    font-size: 11px;
  }
  .auction-heading .game-sound-toggle {
    width: 30px;
    height: 30px;
  }
  .auction-grid {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 8px;
  }
  .auction-lot {
    min-height: 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .auction-lot > .tag,
  .auction-lot .auction-image-credit,
  .auction-lot .auction-bidder {
    display: none;
  }
  .auction-lot .auction-plate,
  .auction-lot .auction-plate:has(img) {
    flex: 1;
    min-height: 55px;
    height: auto;
    margin: 0 auto;
    width: 100%;
    max-width: none;
    background: #10201f;
  }
  .auction-lot h2 {
    font-size: 22px;
    margin: 1px 0;
  }
  .auction-lot .auction-turn {
    margin: 0;
    padding: 6px;
    font-size: 12px;
  }
  .auction-lot .auction-price {
    font-size: 24px;
    margin: 0;
  }
  .auction-form {
    padding: 8px;
    margin-top: 0;
  }
  .auction-form label {
    font-size: 10px;
  }
  .auction-form .auction-hint {
    display: none;
  }
  .auction-input-row {
    margin-top: 4px;
    gap: 7px;
  }
  .auction-input-row .input {
    font-size: 20px;
    padding: 8px 10px;
  }
  .auction-input-row .btn {
    min-height: 40px;
    padding: 8px 12px;
    font-size: 12px;
  }
  .auction-shortcuts {
    margin: 5px 0;
    gap: 5px;
  }
  .auction-shortcuts button {
    padding: 6px;
    font-size: 11px;
  }
  .auction-pass {
    margin-top: 5px;
    padding: 7px;
    font-size: 11px;
  }
  .auction-decision-actions {
    flex-direction: row;
    margin-top: 6px;
  }
  .auction-decision-actions .btn {
    min-height: 38px;
    padding: 8px;
    font-size: 12px;
  }
  .auction-lot .auction-sale {
    margin: 0;
    padding: 8px;
    font-size: 12px;
  }
  .auction-lot > .btn.full {
    margin: 0;
    padding: 9px;
    min-height: 38px;
  }
  .auction-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 7px;
    min-height: 0;
  }
  .auction-sidebar .auction-rules {
    display: none;
  }
  .auction-player {
    padding: 8px;
    margin: 0;
    min-width: 0;
  }
  .auction-player-header {
    gap: 5px;
  }
  .auction-player-header .avatar {
    width: 24px;
    height: 24px;
  }
  .auction-player-header strong {
    font-size: 11px;
    overflow-wrap: anywhere;
  }
  .auction-player-header small {
    font-size: 9px;
  }
  .auction-wallet b {
    font-size: 16px;
  }
  .auction-collection {
    gap: 3px;
    margin-top: 7px;
  }
  .auction-slot,
  .auction-slot:has(img) {
    min-height: 48px;
    padding: 3px;
    gap: 3px;
  }
  .auction-slot img {
    height: 30px;
  }
  .auction-slot b,
  .auction-slot:has(img) b {
    font-size: 8px;
  }
  .auction-slot small {
    font-size: 8px;
  }
  .auction-slot span {
    font-size: 20px;
  }
  .nr-page:not(:has(.nr-summary)) {
    height: calc(100dvh - 12px);
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .nr-page > .nr-head {
    flex: none;
    gap: 5px;
    margin: 0;
    align-items: center;
  }
  .nr-head h1 {
    font-size: 18px;
    margin: 3px 0;
  }
  .nr-head .tag {
    font-size: 8px;
    padding: 4px 6px;
  }
  .nr-head p {
    font-size: 10px;
    margin: 2px 0;
  }
  .nr-status {
    gap: 5px;
  }
  .nr-target,
  .nr-clock {
    padding: 6px 9px;
    font-size: 12px;
  }
  .nr-status .btn {
    min-height: 30px;
    padding: 6px 10px;
    font-size: 11px;
  }
  .nr-page > .nr-note {
    margin: 0;
    padding: 6px;
    font-size: 10px;
  }
  .nr-page > .notice {
    display: none;
  }
  .nr-page > .nr-layout {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 7px;
  }
  .nr-panel {
    min-height: 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .nr-panel h2 {
    font-size: 11px;
    margin: 0 0 5px;
  }
  .nr-panel p {
    display: none;
  }
  .nr-panel > .nr-grid {
    width: min(100%, calc((100dvh - 210px) / 2));
    align-self: center;
    gap: 3px;
    padding: 4px;
  }
  .nr-bar {
    margin: 5px 0 7px;
  }
  .nr-count {
    font-size: 11px;
  }
  .nr-cell {
    font-size: clamp(10px, 3vw, 18px);
  }
  .nr-page > .nr-prep-layout {
    flex: 1;
    min-height: 0;
    gap: 7px;
    align-items: center;
  }
  .nr-prep {
    padding: 9px;
  }
  .nr-prep h2 {
    font-size: 16px;
    margin: 3px 0;
  }
  .nr-prep-label,
  .nr-prep-status {
    font-size: 9px;
  }
  .nr-prep-status {
    margin: 5px 0;
  }
  .nr-prep-controls {
    margin: 6px 0;
  }
  .nr-prep-tip {
    font-size: 9px;
    margin: 4px 0;
    line-height: 1.2;
  }
  .nr-prep .nr-grid {
    width: min(100%, calc(100dvh - 450px));
    margin: auto;
    gap: 2px;
    padding: 4px;
  }
  .nr-prep .nr-cell {
    font-size: 10px;
  }
  .nr-confirm {
    margin-top: 6px;
    min-height: 34px;
    padding: 8px;
    font-size: 11px;
  }
  .nr-prep-layout > .nr-panel .nr-grid {
    width: min(100%, calc(100dvh - 470px));
  }
  .bh-page:not(.bh-final) {
    height: calc(100dvh - 12px);
    padding: 0;
    display: flex;
    flex-direction: column;
  }
  .bh-toolbar {
    margin-bottom: 6px;
  }
  .bh-brand {
    font-size: 12px;
  }
  .bh-anchor {
    width: 25px;
    height: 25px;
  }
  .bh-tools .btn {
    min-height: 30px;
    padding: 6px 9px;
    font-size: 10px;
  }
  .bh-head {
    flex: none;
    margin-bottom: 7px;
    gap: 6px;
  }
  .bh-heading h1 {
    font-size: 20px;
    margin: 4px 0;
  }
  .bh-heading p {
    display: none;
  }
  .bh-player {
    padding: 6px;
    gap: 5px;
  }
  .bh-player img {
    width: 24px;
    height: 24px;
  }
  .bh-player strong {
    font-size: 10px;
  }
  .bh-player small {
    font-size: 9px;
  }
  .bh-mini-fleet {
    display: none;
  }
  .bh-stages span {
    padding: 3px 8px;
    font-size: 9px;
  }
  .bh-shot-message {
    min-height: 20px;
    margin: 0 0 6px;
    font-size: 12px;
  }
  .bh-mobile-tabs {
    display: flex;
    gap: 6px;
    margin: 0 0 7px;
  }
  .bh-mobile-tabs button {
    flex: 1;
    padding: 8px;
    border: 1px solid #31556d;
    border-radius: 9px;
    background: #0c2035;
    color: #b5cede;
    font-weight: 700;
    font-size: 11px;
  }
  .bh-mobile-tabs button[aria-selected="true"] {
    background: #175074;
    color: #b3f0ff;
    border-color: #4ebcdb;
  }
  .bh-page:not(.bh-final) > .bh-layout {
    flex: 1;
    min-height: 0;
    display: block;
  }
  .bh-page[data-mobile-panel="own"] > .bh-layout > .enemy,
  .bh-page[data-mobile-panel="enemy"] > .bh-layout > .bh-ocean:not(.enemy) {
    display: none;
  }
  .bh-ocean {
    height: 100%;
    padding: 10px;
  }
  .bh-ocean-title {
    font-size: 10px;
    margin-bottom: 8px;
  }
  .bh-page:not(.bh-final) .bh-board {
    width: min(100%, calc(100dvh - 415px));
    margin: auto;
  }
  .bh-page:has(.bh-shot-message) .bh-board {
    width: min(100%, calc(100dvh - 240px));
  }
  .bh-placement {
    margin-top: 7px;
    padding: 7px;
  }
  .bh-direction {
    padding: 5px;
  }
  .bh-direction small {
    font-size: 8px;
  }
  .bh-direction b {
    font-size: 13px;
  }
  .bh-direction button {
    padding: 6px 9px;
    font-size: 10px;
  }
  .bh-ship-list {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 4px;
    margin-top: 7px;
  }
  .bh-ship-choice {
    font-size: 8px;
    padding: 5px;
  }
  .bh-ship-choice small {
    font-size: 8px;
  }
  .bh-ship-choice svg {
    height: 10px;
    margin-top: 4px;
  }
  .bh-placement .bh-hint {
    display: none;
  }
  .bh-placement-actions {
    gap: 5px;
    margin-top: 7px;
  }
  .bh-placement-actions .btn {
    min-height: 30px;
    padding: 6px 8px;
    font-size: 10px;
  }
  .bh-placement-actions .ready {
    min-width: 100px;
  }
  .bh-radar-wait {
    aspect-ratio: auto;
    height: calc(100% - 25px);
    min-height: 120px;
  }
  .bh-final .bh-ocean {
    height: auto;
  }
}
@media (min-width: 761px) {
  .bh-page:not(:has(.bh-shot-message)) .bh-board {
    width: min(100%, calc(100dvh - 388px));
  }
}
@media (max-width: 760px) {
  .nr-page > .nr-prep-layout {
    grid-template-rows: auto minmax(0, 1fr);
    align-items: stretch;
  }
  .nr-prep .nr-prep-label,
  .nr-prep .nr-prep-status,
  .nr-prep .nr-prep-tip {
    display: none;
  }
  .nr-prep-controls {
    margin: 4px 0;
  }
  .nr-prep-controls button {
    padding: 5px 8px;
  }
  .nr-prep .nr-grid {
    width: min(100%, calc(100dvh - 470px));
  }
  .nr-prep .nr-confirm {
    min-height: 30px;
    margin-top: 4px;
    padding: 6px;
  }
  .nr-prep-layout > .nr-panel {
    align-self: stretch;
    justify-content: flex-start;
  }
  .nr-prep-layout > .nr-panel .nr-grid {
    width: min(100%, calc((100dvh - 460px) * 0.6));
  }
}
@media (max-width: 760px) {
  .nr-prep .nr-cell {
    min-height: 0;
    line-height: 1;
  }
  .nr-prep-layout > .nr-panel .nr-grid {
    grid-template-rows: repeat(var(--size), minmax(0, 1fr));
  }
  .nr-prep-layout > .nr-panel .nr-cell.paper {
    font-size: 0;
    line-height: 0;
    min-height: 0;
    aspect-ratio: auto;
  }
}
@media (max-width: 700px) {
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] {
    height: calc(100dvh - 123px - var(--guess-dock-height, 167px));
    padding: 0;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: minmax(0, 1.1fr) auto minmax(0, 0.8fr);
    min-height: 0;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] > .game-visual {
    grid-row: 1;
    min-height: 0;
    padding: 7px 8px 0;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .photo-stage {
    height: 100%;
    min-height: 0;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .game-photo {
    height: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] > .game-details {
    grid-row: 2;
    min-height: 0;
    padding: 6px 9px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .vehicle-extra {
    display: none;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .game-details h1 {
    font-size: 17px;
    margin: 0 0 5px;
  }
  body.game-mode:not(.product-game)
    .game-board[data-mobile-panel="car"]
    .game-vehicle-info
    > .vehicle-rows {
    gap: 3px 9px;
  }
  body.game-mode:not(.product-game)
    .game-board[data-mobile-panel="car"]
    .game-vehicle-info
    > .vehicle-rows
    > div {
    padding: 3px 0;
    gap: 2px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .vehicle-rows b {
    font-size: 12px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .vehicle-rows span {
    font-size: 8px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] > .game-damage {
    grid-row: 3;
    min-height: 0;
    margin: 0 8px 7px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .game-damage > img {
    width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .actual-price {
    padding: 8px;
    margin-top: 5px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .actual-price strong {
    font-size: 24px;
    margin-top: 4px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .reveal-label {
    margin-top: 5px;
    font-size: 10px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .result-tiles {
    margin-top: 6px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .result-tiles > div {
    padding: 6px;
  }
  body.game-mode:not(.product-game) .game-board[data-mobile-panel="car"] .result-tiles b {
    font-size: 11px;
    margin-top: 4px;
  }
}
`;
