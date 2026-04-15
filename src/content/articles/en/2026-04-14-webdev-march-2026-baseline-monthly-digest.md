---
id: "https://web.dev/blog/baseline-digest-mar-2026?hl=en"
tool: "webdev"
title: "March 2026 Baseline monthly digest"
link: "https://web.dev/blog/baseline-digest-mar-2026?hl=en"
pubDate: 2026-04-14T07:00:00.000Z
summary: "March 2026 brought significant updates to web platform features achieving Baseline status, including new CSS capabilities and JavaScript APIs. This digest covers the latest features that are now safely available across all modern browsers for production use."
---

## Overview of March 2026 Baseline Updates

March 2026 marked another milestone month for web platform standardization, with several key features achieving **Baseline** status. These updates represent a significant step forward for cross-browser compatibility, allowing developers to confidently implement new capabilities without worrying about browser support inconsistencies.

The **Baseline** initiative continues to provide clarity on which web platform features are ready for production use. When a feature reaches Baseline status, it means it's supported across all major browsers and has been stable for at least 30 months, giving developers the confidence to adopt these technologies in their projects.

This month's updates focus primarily on advanced CSS layout capabilities, modern JavaScript APIs for better user experiences, and enhanced security features that strengthen web application development.

## New CSS Features Achieving Baseline Status

### CSS Container Queries Level 1

**Container queries** have finally achieved Baseline status, marking a revolutionary change in responsive design patterns. This feature allows developers to apply styles based on the size of a containing element rather than the viewport, enabling truly modular and reusable components.

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 300px) {
  .card-title {
    font-size: 1.5rem;
    grid-column: 1 / -1;
  }
}

@container card (min-width: 500px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1rem;
  }
}
```

### CSS Cascade Layers

**Cascade layers** provide developers with explicit control over CSS specificity, solving long-standing issues with style ordering and component isolation. This feature is particularly valuable for design systems and third-party widget integration.

```css
@layer reset, base, components, utilities;

@layer base {
  body {
    font-family: system-ui;
    line-height: 1.6;
  }
}

@layer components {
  .button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
}
```

## Enhanced JavaScript APIs for Better User Experience

### Navigation API

The **Navigation API** replaces the older History API with a more powerful and intuitive interface for handling single-page application navigation. This API provides better control over navigation events and improved integration with modern web application patterns.

```javascript
navigation.addEventListener('navigate', (event) => {
  const url = new URL(event.destination.url);
  
  if (url.pathname.startsWith('/app/')) {
    event.intercept({
      handler: () => handleAppNavigation(url),
      scroll: 'after-transition'
    });
  }
});

async function handleAppNavigation(url) {
  // Custom navigation logic
  const content = await loadPageContent(url.pathname);
  document.querySelector('#main').innerHTML = content;
}
```

### Web Locks API

The **Web Locks API** enables coordination between different tabs, workers, and frames of the same origin, preventing race conditions in complex web applications. This is particularly useful for applications that need to synchronize data across multiple contexts.

```javascript
// Acquire a lock before performing critical operations
await navigator.locks.request('my-resource', async (lock) => {
  // Critical section - only one context can execute this at a time
  const data = await fetchCriticalData();
  await processCriticalOperation(data);
  await saveCriticalResults(data);
});

// Check if a lock is available
const lockState = await navigator.locks.query();
console.log('Held locks:', lockState.held);
console.log('Pending locks:', lockState.pending);
```

## Security Enhancements and Privacy Features

### Trusted Web Activity

**Trusted Web Activity** support has reached Baseline status, providing a bridge between web and native app experiences while maintaining security boundaries. This feature is particularly important for progressive web apps that need deeper system integration.

The implementation requires specific manifest configurations and security validations:

```json
{
  "name": "My PWA",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2196F3",
  "background_color": "#ffffff",
  "digital_goods_api": {
    "enabled": true
  },
  "trusted_web_activity": {
    "enabled": true,
    "splash_screens": [
      {
        "src": "/splash-320x568.png",
        "sizes": "320x568",
        "type": "image/png"
      }
    ]
  }
}
```

### Enhanced Permissions API

The **Permissions API** has been expanded with new permission types and better granular control. Developers can now query and request permissions more effectively, improving user consent flows and application reliability.

```javascript
// Query multiple permissions at once
const permissions = await Promise.all([
  navigator.permissions.query({ name: 'camera' }),
  navigator.permissions.query({ name: 'microphone' }),
  navigator.permissions.query({ name: 'geolocation' })
]);

permissions.forEach((permission, index) => {
  const permissionName = ['camera', 'microphone', 'geolocation'][index];
  console.log(`${permissionName}: ${permission.state}`);
  
  permission.addEventListener('change', () => {
    handlePermissionChange(permissionName, permission.state);
  });
});
```

## Migration Guide and Best Practices

### Adopting Container Queries

When migrating existing responsive designs to use **container queries**, start with component-level responsiveness rather than replacing all media queries at once:

```css
/* Legacy approach */
@media (min-width: 768px) {
  .sidebar .widget {
    display: flex;
  }
}

/* Modern container query approach */
.sidebar {
  container-type: inline-size;
}

@container (min-width: 300px) {
  .widget {
    display: flex;
  }
}
```

### Navigation API Migration

For applications currently using the **History API**, the migration to the Navigation API should be gradual:

1. Start by listening to `navigate` events without intercepting them
2. Gradually replace `pushState` calls with `navigation.navigate()`
3. Implement proper error handling for navigation failures
4. Test thoroughly across different navigation scenarios

### Breaking Changes and Considerations

Several important considerations when adopting these new Baseline features:

- **Container queries** may affect existing layout calculations in complex grid systems
- **Cascade layers** change specificity behavior and may require CSS architecture updates  
- **Navigation API** deprecates some History API patterns, requiring code updates
- **Web Locks API** introduces new async patterns that may impact application flow

Developers should thoroughly test these implementations in staging environments and consider progressive enhancement strategies for older browser support where necessary.