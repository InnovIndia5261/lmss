# LMS UI Decorations Guide

Visual enhancements applied across the application for a polished, modern look.

---

## 1. Page Headers

**Gradient header** – Used for main section titles:
- `page-header` – Gradient background (indigo → purple)
- `page-header-subtle` – Light gradient (gray-50 → indigo-50)
- Includes shadow and rounded corners

```jsx
<div className="page-header">
  <h1>Page Title</h1>
  <p>Subtitle</p>
</div>
```

---

## 2. Cards

**Card decorations:**
- `card-decorated` – White card with subtle border, shadow, hover lift
- `card-accent-left` – Left border accent (4px indigo)
- `card-gradient-border` – Gradient border on hover

---

## 3. Buttons

**Button styles:**
- Primary: `btn-primary` – Indigo with hover scale
- Success: `btn-success` – Green
- Secondary: `btn-secondary` – Gray outline
- Icon buttons: `btn-icon` – Circular with hover ring

---

## 4. Badges & Pills

- `badge-easy` – Green (Easy)
- `badge-medium` – Amber (Medium)
- `badge-hard` – Red (Hard)
- `badge-featured` – Indigo with star
- `pill` – Generic rounded pill

---

## 5. Section Dividers

- `divider` – Horizontal line with optional icon
- `section-divider` – Thicker, with gradient fade

---

## 6. Icons & Accents

- `icon-accent` – Icon with colored background circle
- `icon-badge` – Small badge with icon
- Decorative corner ribbons for featured items

---

## 7. Output / Code Panels

- `panel-output` – Dark terminal-style (gray-900, green text)
- `panel-code` – Light editor style (gray-50, monospace)

---

## 8. Sidebar

- Active link: Dark background (#49516F)
- Hover: Light blue (#8EA4D2)
- XP bar: Amber gradient
- Section separators between nav groups

---

## 9. Modals

- Backdrop: `backdrop-blur-sm` + 50% opacity
- Modal: `rounded-lg shadow-xl` + max-width
- Content: Padding, border dividers

---

## 10. Color Palette

| Use | Color | Tailwind |
|-----|-------|----------|
| Primary | Indigo | indigo-500 |
| Success | Green | green-500 |
| Warning | Amber | amber-500 |
| Error | Red | red-500 |
| Info | Blue | blue-500 |

---

## 11. Shadows & Depth

- `shadow-sm` – Subtle
- `shadow` – Default
- `shadow-lg` – Cards
- `shadow-xl` – Modals
- `hover:shadow-lg` – Interactive cards

---

## 12. Transitions

- `transition-all duration-200` – Buttons
- `transition-shadow` – Cards
- `animate-bounce-short` – Modals (existing)
