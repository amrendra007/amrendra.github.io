const cacheName = 'v3';

// call install event
self.addEventListener('install', e => {
  console.log('service worker installed');
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
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // make copy/clone of response
        const resClone = res.clone();
        caches.open(cacheName).then(cache => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});
