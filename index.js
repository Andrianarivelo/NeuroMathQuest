// Polyfill SharedArrayBuffer for web (required by Reanimated v4 worklets)
// On native platforms this is already available; on web it requires COOP/COEP
// headers which dev servers don't always provide. Falls back to ArrayBuffer
// so Reanimated uses JS-thread animations instead of worklet-thread.
if (typeof SharedArrayBuffer === 'undefined') {
  globalThis.SharedArrayBuffer = ArrayBuffer;
}

// Boot Expo Router
require('expo-router/entry');
