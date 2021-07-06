var CACHE_NAME = 'zircon-inventory-ui-cache-v2';
var OLD_CACHE_NAME = 'zircon-inventory-ui-cache-v1';

var urlsToCache = [
    '/',
    '/build/bundle.css',
    '/global.css',
    '/build/main.js',
    '/build/main-016f4ae7.js',
    'framework/img/zircon.png',
];

// Pre-cacheing app shell
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(event) {

    //Purge old cache
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
            return cacheName === OLD_CACHE_NAME
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );

  });

self.addEventListener('fetch', function (event) {
    console.log('CAPTURED');
    console.log(event.request);
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    console.log('serving from cache');
                    console.log(response);
                    return response;
                }

                return fetch(event.request).then(
                    function (response) {
                        // Check if we received a valid response
                        // if(!response || response.status !== 200 || response.type !== 'basic') {
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();
                        console.log('before caching:');
                        console.log({ req: event.request, resp: responseToCache });
                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                console.log('caching:');
                                console.log({ req: event.request, resp: responseToCache });
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

