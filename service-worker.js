var cacheName = 'calendarAppVersion-1.0.0';
var filesToCache = [
	// HTML
	'./',
	'./index.html'
	// './config/routeConfig.js',
	// './config/routeRun.js',
	// './config/routeConfig.js',

	// //CONTROLLERS
	// './controllers/agendaCtrl.js',
	// './controllers/closingCtrl.js',
	// './controllers/insertAppointmentCtrl.js',
	// './controllers/insertCustomersCtrl.js',
	// './controllers/insertProfilesCtrl.js',
	// './controllers/insertProjectsCtrl.js',
	// './controllers/insertUsersCtrl.js',
	// './controllers/listAppointmentCtrl.js',
	// './controllers/listCustomersCtrl.js',
	// './controllers/listProfilesCtrl.js',
	// './controllers/listProjectsCtrl.js',
	// './controllers/listUsersCtrl.js',
	// './controllers/loginCtrl.js',
	// './controllers/logOutCtrl.js',
	// './controllers/mobileCtrl.js',
	// './controllers/reportsCtrl.js',
	// './controllers/welcomeCtrl.js',
	// './controllers/agendaCtrl.js',

	// //CSS
	// './css/easy_calendar.css',
	// './css/icon.css',
	// './css/style.css',
	// './css/selct2-materialize.css',
	
	// //IMG
	// './img/48x48.png',
	// './img/48x64.png',
	// './img/96x96.png',
	// './img/144x144b.png',
	// './img/192x192.png',
	// './img/540x540.png',
	// './img/540x720.png',
	// './img/640x1136.png',
	// './img/750x1294.png',
	// './img/1125x2436.png',
	// './img/1242x2208.png',
	// './img/1536x2048.png',
	// './img/1668x2224.png',
	// './img/2048x2732.png',
	// './img/48x48.png',
	// //ANGULAR
	// './js/angular.min.js',
	// './js/fastclick.min.js',
	// './js/init.js',
	// //LIB

	// //SERVICES
	// './services/agendaAPIService.js',
	// './services/appointmentAPIService.js',
	// './services/calendarRequestAPIService.js',
	// './services/closingDateAPIService.js',
	// './services/customerAPIService.js',
	// './services/expenseTypeOpenAPIService.js',
	// './services/holidayAPIService.js',
	// './services/profilesAPIService.js',
	// './services/projectsAPIService.js',
	// './services/usersAPIService.js',

	// //VIEWS
	// './views/agenda.html',
	// './views/closingDate.html',
	// './views/insertAppointment.html',
	// './views/insertCustomers.html',
	// './views/insertProfiles.html',
	// './views/insertProjects.html',
	// './views/insertUsers.html',
	// './views/listAppointment.html',
	// './views/listCustomers.html',
	// './views/listProfiles.html',
	// './views/listProjects.html',
	// './views/listUsers.html',
	// './views/login.html',
	// './views/logOut.html',
	// './views/reports.html',
	// './views/welcome.html'

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
	console.log('[ServiceWorker] activated');

});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request, {ignoreSearch:true}).then(response => {
			return response || fetch(event.request);
			console.log('[ServiceWorker] fetching');
		})
	);
});
