var cacheName = 'calendarAppVersion-1.3.1';
var filesToCache = [
	// HTML
	'./index.html',
	'./css/easy_calendar.css',
	'./css/icon.css',
	'./css/select2-materialize.css',
	'./css/style.css'
];

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('activate',  event => {
	event.waitUntil(self.clients.claim());
	console.log('[ServiceWorker] Yay yay activated');

});

// self.addEventListener('fetch', event => {
// 	event.respondWith(
// 		caches.match(event.request, {ignoreSearch:true}).then(response => {
// 			return response || fetch(event.request);
// 			console.log('[ServiceWorker] fetching');
// 		})
// 	);
// });

self.addEventListener('fetch', event => {
	event.respondWith(
		new Response('Pipe TOP')	
	);
});
