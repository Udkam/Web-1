---
version: 1.0.0
name: Pixel Precision
description: A premium design system focusing on extreme clarity, high-contrast monochrome palettes, and atmospheric depth.
colors:
  background: "#080808"
  foreground: "#FFFFFF"
  neutral-100: "#F5F5F5"
  neutral-200: "#E5E5E5"
  neutral-400: "#A3A3A3"
  neutral-500: "#737373"
  neutral-600: "#525252"
  neutral-800: "#262626"
  neutral-900: "#171717"
  accent-silver: "linear-gradient(135deg, #f5f5f5, #737373)"
typography:
  display:
    family: "Inter"
    weight: "100"
    letterSpacing: "-0.05em"
  body:
    family: "Inter"
    weight: "200"
    lineHeight: "1.8"
  mono:
    family: "JetBrains Mono"
    weight: "400"
    letterSpacing: "0.02em"
  nav:
    family: "JetBrains Mono"
    weight: "400"
    size: "12px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  section: "128px"
rounded:
  none: "0px"
  sm: "4px"
  md: "12px"
  lg: "24px"
  full: "999px"
  card: "32px"
components:
  nav:
    position: "fixed"
    blendMode: "difference"
    padding: "32px"
  hero:
    alignment: "center"
    max-width: "896px"
    stack: "z-index 10"
  button-primary:
    background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))"
    border: "1px solid transparent"
    padding: "14px 32px"
  card-work:
    background: "rgba(23, 23, 23, 0.4)"
    backdropBlur: "12px"
    border: "1px solid rgba(38, 38, 38, 0.6)"
  badge:
    background: "rgba(23, 23, 23, 0.4)"
    border: "1px solid rgba(38, 38, 38, 0.6)"
    rounded: "999px"
motion:
  duration-slow: "500ms"
  duration-entrance: "1200ms"
  ease: "power4.out"
---
## Overview
The Pixel Precision system is built for high-end digital agency portfolios. It relies on a dark-mode first architecture, utilizing procedural noise and WebGL-driven ambient backgrounds to create a sense of infinite digital space.

## Colors
- Core palette is strictly monochrome (Black #080808 to White #FFFFFF).
- Use Neutral-800 for structural borders.
- Use Neutral-400 for secondary descriptive text.
- Accent gradients are reserved for metrics and hero-level emphasize words.

## Typography
- **Inter**: Primary typeface for headlines (Thin/100) and body (ExtraLight/200).
- **JetBrains Mono**: Functional typeface for labels, navigation, and technical metadata.
- Headline masks: Use linear gradients (White to Neutral-600) on specific keywords to simulate metallic lighting.

## Spacing
- Standard 8px grid system.
- Generous vertical padding (128px) between major sections to allow the background WebGL effects to breathe.

## Layout
- **Z-Index Layers**:
  - 0: WebGL Canvas
  - 1: Ambient Vignette Overlay
  - 10: Main Content
  - 50: Fixed Navigation
  - 100: Noise Texture Overlay
- Max-width containers for content should not exceed 1024px for readability.

## Elevation & Depth
- Avoid box-shadows on cards; use border-gradients and backdrop-blurs (12px-20px) to imply depth.
- Primary buttons utilize a 30px spread shadow at low opacity (30%) to lift off the background.

## Shapes
- Use `rounded-full` for interactive CTAs and status badges.
- Use `32px` (2rem) for content containers and portfolio cards to create a modern, soft-tech aesthetic.

## Components
- **Precision Badge**: Pill-shaped indicator with a pulsing status dot (#neutral-300).
- **Work Cards**: Large radius cards with an inner image container (rounded-3xl) and hover-scale transforms (1.02x).
- **Metric Stacks**: Vertical alignment with 1px gradient dividers and animated text backgrounds.

## Motion
- **Entrance**: Use GSAP to stagger words into view from `translateY(110%)` with a `power4.out` ease.
- **Parallax**: Background canvas should scale down (1.0 to 0.4) and rotate based on scroll progress via ScrollTrigger.
- **Micro-interactions**: Links should transition color over 500ms.

## Do's and Don'ts
### Do's
- Use `mix-blend-difference` for navigation over high-contrast backgrounds.
- Maintain extreme tracking-tighter on large headlines.
- Use thin 1px borders to define sections.

### Don'ts
- Do not use vibrant colors; the system is strictly neutral.
- Do not use heavy font weights (stay below 400).
- Do not disable the noise overlay, as it prevents banding in gradients.

## Accessibility
- Maintain text-neutral-400 as the minimum contrast level for small text.
- Ensure navigation links have a clear `hover:text-neutral-200` state.
- All interactive elements must have a minimum scale of 0.98 on active click to provide tactile feedback.