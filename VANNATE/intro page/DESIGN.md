---
name: Epic Modernism
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#ffb4a8'
  on-secondary: '#690000'
  secondary-container: '#920703'
  on-secondary-container: '#ff9a8a'
  tertiary: '#d0cdcd'
  on-tertiary: '#313030'
  tertiary-container: '#b4b2b2'
  on-tertiary-container: '#454544'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#920703'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-desktop: 80px
  margin-tablet: 40px
  margin-mobile: 20px
  max-width: 1440px
---

## Brand & Style

The design system is built upon the concept of "Epic Modernism"—a visual philosophy that bridges the mythic scale of ancient humanitarian epics with the surgical precision of advanced AI technology. It is designed to evoke a sense of "Divine Duty" (Dharma), positioning the platform as a powerful, respectful, and technologically superior entity.

The aesthetic direction is a sophisticated fusion of **Minimalism** and **Glassmorphism**, leaning heavily into cinematic depth. It avoids the clutter of traditional dashboards, favoring high-impact whitespace, ultra-refined typography, and tactile surfaces. The interface should feel like a high-end physical artifact—part ancient scroll, part futuristic terminal. Key visual motifs include 3D Sudarsan Chakra-inspired loaders, DNA-patterned masking, and fluid, water-like transitions that represent the flow of humanitarian aid.

## Colors

The color palette of this design system is rooted in the "Cosmic Midnight" experience. By utilizing a dark-mode-first approach, we establish a high-contrast environment where critical information shines with "Divine" intensity.

*   **Cosmic Indigo (#050505):** The foundational void. This is not a flat black, but a deep, infinite indigo used for the primary background to create immense depth.
*   **Celestial Gold (#D4AF37):** The color of wisdom and intervention. Reserved for primary actions, branding elements, and highlights of success.
*   **Blood Crimson (#8B0000):** Symbolizing life and urgency. Used strictly for emergency alerts, high-priority humanitarian crises, and critical error states.
*   **Glassmorphic Tints:** Translucent whites and indigos are used to create layers of information without breaking the cinematic immersion.

## Typography

Typography in this design system follows a dual-path hierarchy to balance storytelling with data utility. 

**Playfair Display** is used for all narrative elements, headlines, and high-impact statements. It provides an authoritative, literary, and "noble" tone that reflects the epic scale of the mission. Large headlines should use tighter letter spacing to maintain a cinematic look.

**Hanken Grotesk** serves as the functional workhorse. Its sharp, contemporary grotesque letterforms provide the "ultra-modern" contrast needed for data visualization, UI controls, and body copy. This ensures that even in complex humanitarian logistics, the information remains legible and professional.

## Layout & Spacing

The design system employs a **Fixed Grid** model within a maximum container width of 1440px, ensuring that the cinematic composition is preserved on ultra-wide monitors. On smaller screens, the layout transitions to a fluid behavior with generous safe-area margins.

The spacing rhythm is based on an 8px base unit, but emphasizes large, "breathtaking" gaps between major sections to mimic the scale of epic architecture. 
*   **Desktop:** 12-column grid with 24px gutters and 80px external margins.
*   **Tablet:** 8-column grid with 24px gutters and 40px external margins.
*   **Mobile:** 4-column grid with 16px gutters and 20px external margins.

Layouts should favor verticality and central alignment for storytelling components, while utility dashboards utilize a "module-based" layout with varying column spans.

## Elevation & Depth

Hierarchy is established through "Divine Layering"—a concept that uses light and translucency rather than heavy shadows.

1.  **The Void (Level 0):** The Cosmic Indigo background, acting as the infinite base.
2.  **The Shroud (Level 1):** Semi-transparent surfaces with a heavy backdrop blur (20px-40px). These "Glassmorphic" containers hold secondary content and navigation bars.
3.  **The Artifact (Level 2):** Solid or high-opacity containers with a subtle 1px inner-border (stroke) of Celestial Gold at 20% opacity. 
4.  **The Divine Light (Level 3):** High-priority elements use "Ambient Glows"—soft, ultra-diffused drop shadows tinted with Celestial Gold (#D4AF37) at low opacity (10-15%) to make the element appear as if it is emitting light.

Shadows should be long and soft, avoiding the "muddy" look of standard grey shadows.

## Shapes

The shape language reflects the "Epic Modernism" ethos by combining structural stability with organic flow. 

All primary UI containers and buttons use a **Rounded** (0.5rem) base. This specific radius is used to echo the sophisticated hardware design of modern mobile devices. For larger card components or featured banners, use `rounded-xl` (1.5rem) to soften the "industrial" feel and make the AI platform feel more approachable and humane. 

Interactive elements like chips and tags should utilize a pill-shape to contrast against the more rigid grid-based modules.

## Components

### Buttons
*   **Primary:** Solid Celestial Gold background with dark indigo text. Subtle outer glow on hover.
*   **Secondary:** Glassmorphic fill (white at 10% opacity) with a 1px gold border. 
*   **Urgent:** Solid Blood Crimson with white text, used only for life-critical actions.

### Cards
Cards are the primary vessel for information. They feature a 20px backdrop blur and a thin, "hairline" border. On hover, the border opacity increases, and the background blur intensifies.

### Input Fields
Inputs are minimalist, featuring only a bottom border in the inactive state. Upon focus, a gold "DNA-like" geometric underline animates from the center, and the background gains a faint translucent tint.

### Lists & Navigation
Navigation is handled via a persistent glassmorphic "Dock" at the bottom of the screen or a minimalist top bar. List items feature high-contrast typography with noble serif headers and hanken-grotesk metadata.

### The Chakra Loader
The primary loading state is a 3D silhouette of the Sudarsan Chakra, rotating with variable speed and a gold-to-indigo gradient trail, symbolizing the constant movement of the humanitarian engine.