const cacheName = 'v1';

const cacheAsset = ['index.html', 'about.html', 'js/main.js'];

// call install event
self.addEventListener('install', e => {
  console.log('service worker installed');

  e.waitUntil(
    caches
      .open(cacheName)
      .then(cache => {
        console.log('caching files');
        cache.addAll(cacheAsset);
      })
      .then(() => self.skipWaiting())
  );
});

// call activate event
self.addEventListener('activate', e => {
  // Remove unwanted cache
  e.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('clearing old cache');
            return caches.delete(cache);
          }
        })
      )
    )
  );
  console.log('service worker activated');
});

// call fetch event
self.addEventListener('fetch', e => {
  console.log('fetching');
  console.log(e);
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
