var cacheName = 'calendarAppV1';
var filesToCache = [
	// HTML
	'./',
	'js/angular.js',
	'lib/angular/angular-ui-router.js',
	'lib/angular/ngMask.js',
	'config/routeRun.js',
	'config/routeConfig.js',
	//'jquery.min.js',
	'js/fastclick.js',
	'lib/materialize/css/materialize.min.css',
	'css/easy_calendar.css',
	'lib/fullcalendar/css/fullcalendar.min.css',
	'lib/select2/css/select2.min.css',
	'css/select2-materialize.css',
	'lib/materialize/js/materialize.min.js',
	'lib/select2/js/select2.min.js',
	'lib/moment/js/moment.min.js',
	'lib/fullcalendar/js/fullcalendar.min.js',
	'lib/fullcalendar/js/pt-br.js',
	//CONTROLLERS
	'controllers/agendaCtrl.js',
	'controllers/insertAppointmentCtrl.js',
	'controllers/insertProfilesCtrl.js',
	'controllers/insertProjectsCtrl.js',
	'controllers/insertUsersCtrl.js',
	'controllers/insertCustomersCtrl.js',
	'controllers/closingDateCtrl.js',
	'controllers/listCustomersCtrl.js',
	'controllers/listAppointmentCtrl.js',
	'controllers/listProfilesCtrl.js',
	'controllers/listProjectsCtrl.js',
	'controllers/listUsersCtrl.js',
	'controllers/reportsCtrl.js',
	'controllers/loginCtrl.js',
	'factorys/controleDeLogin.js',
	'index.html',
	'./css/style.css',
	'app.js'
];

self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('[ServiceWorker] Caching filesToCache');
			return cache.addAll(filesToCache);
		})
	);
});


self.addEventListener('activate',  event => {
	event.waitUntil(self.clients.claim());
});


self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request, {ignoreSearch:true}).then(response => {
			return response || fetch(event.request);
		})
	);
});