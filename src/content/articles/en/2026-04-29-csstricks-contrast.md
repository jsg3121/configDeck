---
id: "https://css-tricks.com/?page_id=392899"
tool: "csstricks"
title: "contrast()"
link: "https://css-tricks.com/almanac/functions/c/contrast/"
pubDate: 2026-04-29T14:58:19.000Z
summary: "The contrast() CSS filter function allows developers to dynamically adjust visual contrast of elements without image editing tools. Essential for accessibility improvements, responsive design, and creating interactive visual effects that enhance user experience across different viewing conditions."
---

## Understanding the contrast() Filter Function

The **contrast()** function is a powerful CSS filter that enables developers to programmatically adjust the contrast of HTML elements. This function is part of the CSS Filter Effects specification and provides a way to enhance or reduce the visual distinction between light and dark areas of an element's content.

The function accepts a percentage or decimal value where `1` or `100%` represents the original contrast, values below `1` (or `100%`) reduce contrast, and values above `1` (or `100%`) increase contrast. A value of `0` results in a completely gray appearance, while higher values create more dramatic contrast effects.

```css
/* Basic syntax examples */
.element {
  filter: contrast(150%);  /* Increase contrast by 50% */
  filter: contrast(0.5);   /* Reduce contrast to 50% */
  filter: contrast(2);     /* Double the contrast */
}
```

## Practical Implementation Examples

The **contrast()** function proves invaluable in various real-world scenarios. For image galleries, you can create hover effects that enhance visual appeal:

```css
.gallery-item {
  filter: contrast(80%);
  transition: filter 0.3s ease;
}

.gallery-item:hover {
  filter: contrast(120%);
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .content-image {
    filter: contrast(85%) brightness(0.9);
  }
}
```

For text readability improvements, especially over background images:

```css
.hero-section {
  position: relative;
}

.hero-background {
  filter: contrast(70%) brightness(0.8);
}

.hero-text {
  position: absolute;
  z-index: 2;
  filter: contrast(110%);
}
```

Dynamic contrast adjustments can be controlled via CSS custom properties for theme switching:

```css
:root {
  --contrast-level: 100%;
}

.adjustable-content {
  filter: contrast(var(--contrast-level));
}

/* JavaScript can modify the custom property */
/* document.documentElement.style.setProperty('--contrast-level', '120%'); */
```

## Accessibility and User Experience Benefits

The **contrast()** function plays a crucial role in improving web accessibility. Users with visual impairments often benefit from enhanced contrast ratios, and this function provides a CSS-only solution for such accommodations.

Implementation for accessibility features:

```css
/* High contrast mode toggle */
.high-contrast-mode .content {
  filter: contrast(150%) saturate(0.3);
}

/* Reduced motion users might prefer stable contrast */
@media (prefers-reduced-motion: reduce) {
  .animated-contrast {
    filter: contrast(100%) !important;
    transition: none !important;
  }
}

/* Respecting user's contrast preferences */
@media (prefers-contrast: high) {
  .adaptive-content {
    filter: contrast(130%);
  }
}

@media (prefers-contrast: low) {
  .adaptive-content {
    filter: contrast(80%);
  }
}
```

Consider implementing user controls for contrast adjustment:

```css
.contrast-control {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.contrast-low { filter: contrast(70%); }
.contrast-normal { filter: contrast(100%); }
.contrast-high { filter: contrast(140%); }
.contrast-extra-high { filter: contrast(180%); }
```

## Performance Considerations and Browser Support

The **contrast()** function is well-supported across modern browsers, but performance implications should be considered, especially when applied to large elements or used in animations.

Browser support considerations:

- **Chrome/Edge**: Full support since version 53
- **Firefox**: Supported since version 35
- **Safari**: Supported since version 9.1
- **Mobile browsers**: Generally well-supported on modern devices

Performance optimization strategies:

```css
/* Efficient contrast animations */
.optimized-contrast {
  filter: contrast(100%);
  transition: filter 0.2s ease-out;
  will-change: filter; /* Hint for browser optimization */
}

/* Avoid frequent contrast changes on large elements */
.large-container {
  /* Apply contrast to child elements instead */
}

.large-container > .content-item {
  filter: contrast(110%);
}

/* Use hardware acceleration when possible */
.gpu-accelerated {
  filter: contrast(120%);
  transform: translateZ(0); /* Force GPU layer */
}
```

For better performance with multiple filters:

```css
/* Combine filters efficiently */
.multi-filter {
  filter: contrast(120%) brightness(1.1) saturate(1.2);
}

/* Instead of separate filter declarations */
/* Less efficient approach */
.separate-filters {
  filter: contrast(120%);
  /* Adding more filters requires overriding the entire filter property */
}
```

## Advanced Techniques and Combinations

The **contrast()** function becomes more powerful when combined with other CSS features and filters. Creating sophisticated visual effects requires understanding how contrast interacts with other properties.

Advanced combination examples:

```css
/* Creating dramatic photo effects */
.photo-dramatic {
  filter: contrast(140%) saturate(1.3) brightness(0.95) hue-rotate(5deg);
}

/* Vintage effect with reduced contrast */
.photo-vintage {
  filter: contrast(85%) sepia(20%) brightness(1.05);
}

/* Interactive elements with dynamic contrast */
.interactive-card {
  filter: contrast(95%) blur(0px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-card:hover {
  filter: contrast(115%) blur(0px);
  transform: translateY(-2px);
}

.interactive-card:active {
  filter: contrast(130%) blur(0px);
}
```

Complex responsive contrast adjustments:

```css
/* Viewport-based contrast scaling */
@media (min-width: 1200px) {
  .responsive-contrast {
    filter: contrast(110%);
  }
}

@media (max-width: 768px) {
  .responsive-contrast {
    filter: contrast(105%); /* Slightly less aggressive on mobile */
  }
}

/* Print styles with contrast adjustment */
@media print {
  .print-optimized {
    filter: contrast(120%) !important;
    color-adjust: exact;
  }
}
```

The **contrast()** function represents a essential tool for modern web development, offering developers precise control over visual presentation while supporting accessibility requirements and responsive design principles.