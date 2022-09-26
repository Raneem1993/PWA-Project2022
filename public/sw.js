
const CACHE_VERSION = 3;
const CURRENT_STATIC_CACHE = 'static-v3';
const CURRENT_DYNAMIC_CACHE = 'dynamic-v3';


self.addEventListener('install', function(event) {
    console.log('service worker --> installing ...', event);
    event.waitUntil(
        caches.open('static')
        .then(cache =>{
            console.log('Service-Worker-Cache erzeugt und offen');
            cache.addAll([
                '/',
                '/index.ejs',
                '/edit.ejs',
                '/new.ejs',
                '/show.ejs',
                '/js/index.js',
                '/js/app.js',
                '/css/main.css',
                'https://fonts.googleapis.com/css?family=Roboto:400,700',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css'
                ]);
    })
    );
    })

    self.addEventListener('activate', function(event) {
        console.log('service worker --> activating ...', event);
        event.waitUntil(
            caches.keys()
                .then( keyList => {
                    return Promise.all(keyList.map( key => {
                        if(key !== CURRENT_STATIC_CACHE && key !== CURRENT_DYNAMIC_CACHE) {
                            console.log('service worker --> old cache removed :', key);
                            return caches.delete(key);
                        }
                    }))
                })
        );
        return self.clients.claim();
    })
    self.addEventListener('fetch', event => {
        event.respondWith(
            caches.match(event.request)
                .then( response => {
                    if(response) {
                        return response;
                    } else {
                        return fetch(event.request)
                            .then( res => {     
                                return caches.open('dynamic')     
                                    .then( cache => {
                                        cache.put(event.request.url, res.clone());
                                        return res;
                                    })
                            });
                    }
                })
        );
    })