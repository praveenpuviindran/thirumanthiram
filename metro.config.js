const { getDefaultConfig } = require('expo/metro-config');

// macOS 26 (Tahoe) alpha has a broken fs.watch({recursive:true}) that causes
// NativeWatcher to emit events in a tight infinite loop. Force FallbackWatcher
// (polling) instead.
try {
  const NativeWatcher = require('metro-file-map/src/watchers/NativeWatcher');
  if (NativeWatcher && NativeWatcher.default) {
    NativeWatcher.default.isSupported = () => false;
  }
} catch (_) {}

const config = getDefaultConfig(__dirname);

module.exports = config;
