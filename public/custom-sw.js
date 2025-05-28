importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'ONESIGNAL_NOTIFICATION') {
    importScripts(event.data.script);
  }
});