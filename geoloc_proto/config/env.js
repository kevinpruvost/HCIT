import Constants from 'expo-constants';
const { manifest } = Constants;

const host = `http://${typeof manifest.packagerOpts === 'object' && manifest.packagerOpts.dev ? manifest.hostUri.split(`:`).shift() : 'https://production-url.com/api'}`;