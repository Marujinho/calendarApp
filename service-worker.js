var theCacheName = 'calendarAppVersion-1.3.3';
var filesToCache = [
	// HTML
	'./index.html',
	'./css/easy_calendar.css',
	'./css/icon.css',
	'./css/select2-materialize.css',
	'./css/style.css',
	'./img/icon.jpg',
	'./img/bell.png2'
];

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(theCacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});

// self.addEventListener('activate',  event => {
// 	// event.waitUntil(self.clients.claim());
// 	// console.log('[ServiceWorker] Yay yay activated');
	
	addEventListener('activate', activateEvent => {
		activateEvent.waitUntil(
		  caches.keys().then(keyList => Promise.all(keyList.map(key => {
			if (key !== theCacheName) {
			  return caches.delete(key);
		}
		  	})))
		);
	});
// });

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
		// new Response('Pipe TOP'),
		// new Response('lalala')	
		fetch(event.request).then(function(response){
			if(response.status == 404){
				return new Response('Essa pagina nao existe cara');
			}
			return response;
		}).catch(function(){
			return new Response('Brother, c ta sem internet');
			
		})
	);
});
