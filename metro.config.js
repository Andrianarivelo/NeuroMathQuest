// Learn more: https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

for (const extension of ['db', 'wasm']) {
  if (!config.resolver.assetExts.includes(extension)) {
    config.resolver.assetExts.push(extension);
  }
}

// Inject SharedArrayBuffer polyfill before all modules (needed for Reanimated v4 on web)
const originalGetPolyfills = config.serializer.getPolyfills
  ? config.serializer.getPolyfills
  : () => [];

config.serializer = {
  ...config.serializer,
  getPolyfills: () => {
    return [
      path.resolve(__dirname, 'sharedArrayBufferPolyfill.js'),
      ...originalGetPolyfills(),
    ];
  },
};

module.exports = config;
