// This file is loaded by Metro as a polyfill, before ANY module evaluation.
// Reanimated v4 + react-native-worklets require SharedArrayBuffer on web,
// which needs COOP/COEP headers browsers don't have in dev.
// Falling back to ArrayBuffer lets Reanimated use JS-thread animations.
if (typeof globalThis.SharedArrayBuffer === 'undefined') {
  globalThis.SharedArrayBuffer = ArrayBuffer;
}
