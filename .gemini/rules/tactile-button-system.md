---
description: Mandatory Tactile Button Architecture across all UI in OGZ Game
globs: worker/ui/**/*.js, public/**/*.html
---

# Tactile Button Design System Rule

All buttons across the OGZ Game project MUST follow the physical 3D "Tactile Button" architecture (as established in `home-cta`):

## 1. Structure
Every primary, secondary, or major actionable button must have a two-layer structure:
```html
<button type="button" class="btn-tactile [variant]">
  <span class="btn-tactile-base"></span>
  <span class="btn-tactile-face">
    <!-- Icon and Label -->
    <svg ...></svg>
    <span>Label</span>
  </span>
</button>
```

## 2. Core Behavior
- **Base layer (`.btn-tactile-base`)**: Absolute positioned chassis sitting `5px` below the face, providing the physical extruded thickness and depth. Has darker color + bottom inset shadow (`inset 0 -1px 0 rgba(0,0,0,0.4)`).
- **Face layer (`.btn-tactile-face`)**: Relative positioned surface that accepts interaction. Features a top light-bevel highlight (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.25)`).
- **Physical Press Interaction**:
  - `hover`: `transform: translateY(1.5px)`
  - `active` / click: `transform: translateY(5px)` (pushes completely flush into base).
  - Smooth timing: `transition: transform 0.12s cubic-bezier(0.23, 1, 0.32, 1)`.

## 3. Aesthetic Constraints
- **NO NEON GLOWS**: Strictly avoid fuzzy colored glow drop-shadows or saturated outer halos (`0 0 20px #e24046`). Depth comes from the physical base and clean ambient drop shadows (`0 2px 8px rgba(0, 0, 0, 0.25)`).
- **Variants**:
  - **Primary (OGZ Accent)**: Face `#e24046`, Base `#9f1c22`, White text.
  - **Secondary (Navy/Steel)**: Face `#1c2333` with 1px border `#303c54`, Base `#10141e`, Light slate text `#f1f5f9`.
  - **Gold / Accent**: Face `#f0ad5f`, Base `#a16f32`, Dark/White text.

