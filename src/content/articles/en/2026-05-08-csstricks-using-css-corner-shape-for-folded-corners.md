---
id: "https://css-tricks.com/?p=393431"
tool: "csstricks"
title: "Using CSS corner-shape For Folded Corners"
link: "https://css-tricks.com/using-css-corner-shape-for-folded-corners/"
pubDate: 2026-05-08T13:54:10.000Z
summary: "Learn how to create realistic folded corner effects using the CSS corner-shape property, offering a modern alternative to complex clipping paths. This technique provides better maintainability and cleaner code for paper-like UI elements."
---

## Introduction to CSS corner-shape Property

The **CSS corner-shape** property represents a modern approach to creating sophisticated corner effects without relying on complex background images or intricate clipping paths. Originally inspired by **Kitty Giraudel's folded corners technique**, this method demonstrates how `corner-shape` can achieve the same visual results with significantly cleaner code.

Traditional folded corner implementations often require multiple pseudo-elements, complex gradients, or even SVG graphics. The `corner-shape` property simplifies this process by providing native CSS support for corner modifications, making it an ideal solution for creating **paper-like interfaces** and **document-style layouts**.

## Understanding the corner-shape Syntax

The `corner-shape` property accepts various values that define how corners should be modified. For folded corners, the most relevant syntax involves the **cut** and **fold** keywords:

```css
.folded-corner {
  corner-shape: cut 20px;
  /* or */
  corner-shape: fold 20px at 45deg;
}
```

The **cut** value removes a triangular section from the corner, creating the appearance of a folded-back corner. The size parameter controls how much of the corner is "cut away," while the optional angle parameter determines the direction of the fold.

Key syntax components include:

- **Size values**: Accept pixels, percentages, or relative units
- **Angle values**: Define the fold direction (default is 45 degrees)
- **Corner targeting**: Apply to specific corners using logical properties
- **Multiple values**: Combine different corner shapes on the same element

## Implementation Examples and Code Patterns

Here's a practical implementation of folded corners using `corner-shape`:

```css
.document-card {
  width: 300px;
  height: 400px;
  background: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  corner-shape: cut 25px;
  position: relative;
}

.document-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 25px;
  height: 25px;
  background: linear-gradient(-45deg, #e0e0e0 50%, transparent 50%);
  corner-shape: none;
}
```

For more advanced folded effects, you can combine `corner-shape` with **CSS transforms** and **gradients**:

```css
.advanced-fold {
  corner-shape: fold 30px at 135deg;
  background: 
    linear-gradient(135deg, #f5f5f5 0%, #ffffff 50%),
    #ffffff;
  box-shadow: 
    inset 0 0 0 1px #e0e0e0,
    0 2px 4px rgba(0, 0, 0, 0.05);
}
```

This creates a more realistic folded appearance with subtle shading and depth.

## Browser Support and Fallback Strategies

Currently, `corner-shape` has **limited browser support** as it's still an experimental CSS feature. It's important to implement proper fallbacks for production environments:

```css
.folded-corner {
  /* Fallback for unsupported browsers */
  clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
  
  /* Modern implementation */
  corner-shape: cut 20px;
}

/* Feature detection with CSS @supports */
@supports (corner-shape: cut 20px) {
  .folded-corner {
    clip-path: none;
    corner-shape: cut 20px;
  }
}
```

For **progressive enhancement**, consider using JavaScript feature detection:

```javascript
if (CSS.supports('corner-shape', 'cut 20px')) {
  document.body.classList.add('supports-corner-shape');
} else {
  // Load polyfill or apply alternative styling
  document.body.classList.add('fallback-corner-shape');
}
```

## Performance Benefits and Best Practices

Using `corner-shape` for folded corners offers several **performance advantages** over traditional methods:

- **Reduced DOM complexity**: No need for multiple pseudo-elements
- **Better painting performance**: Native CSS rendering is more efficient
- **Simplified animations**: Corner shapes can be animated directly
- **Maintainable code**: Single property instead of complex clip-path calculations

Best practices for implementation include:

- Always provide fallbacks for unsupported browsers
- Use relative units for responsive designs
- Consider accessibility implications for users with visual impairments
- Test across different screen densities and zoom levels
- Combine with appropriate ARIA labels for screen readers

When animating corner shapes, use **CSS transitions** for smooth effects:

```css
.animated-fold {
  corner-shape: cut 0px;
  transition: corner-shape 0.3s ease-in-out;
}

.animated-fold:hover {
  corner-shape: cut 20px;
}
```

This creates an engaging interaction where the folded corner effect appears on hover, enhancing user experience while maintaining performance efficiency.