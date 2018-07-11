angularApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('welcome');

    $stateProvider.state('agenda', {
            url: '/agenda',
            templateUrl: 'views/agenda.html',
            controller: 'agendaCtrl'
        })
        .state('login', {
            url: '/login/:id',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .state('listCustomers', {
            url: '/listCustomers',
            templateUrl: 'views/listCustomers.html',
            controller: 'listCustomersCtrl'
        })
        .state('listAppointment', {
            url: '/listAppointment',
            templateUrl: 'views/listAppointment.html',
            controller: 'listAppointmentCtrl'
        })
        .state('insertAppointment', {
            url: '/insertAppointment',
            templateUrl: 'views/insertAppointment.html',
            controller: 'insertAppointmentCtrl'
        })
        .state('insertAppointment/:id', {
            url: '/insertAppointment/:id',
            templateUrl: 'views/insertAppointment.html',
            controller: 'insertAppointmentCtrl'
        })
        .state('listProfiles', {
            url: '/listProfiles',
            templateUrl: 'views/listProfiles.html',
            controller: 'listProfilesCtrl'
        })
        .state('listProjects', {
            url: '/listProjects',
            templateUrl: 'views/listProjects.html',
            controller: 'listProjectsCtrl'
        })
        .state('reports', {
            url: '/reports',
            templateUrl: 'views/reports.html',
            controller: 'reportsCtrl'
        })
        .state('listUsers', {
            url: '/listUsers',
            templateUrl: 'views/listUsers.html',
            controller: 'listUsersCtrl'
        })
        .state('insertCustomers', {
            url: '/insertCustomers',
            templateUrl: 'views/insertCustomers.html',
            controller: 'insertCustomersCtrl'
        })
        .state('insertCustomers/:id', {
            url: '/insertCustomers/:id',
            templateUrl: 'views/insertCustomers.html',
            controller: 'insertCustomersCtrl'
        })
        .state('insertProfiles', {
            url: '/insertProfiles',
            templateUrl: 'views/insertProfiles.html',
            controller: 'insertProfilesCtrl'
        })
        .state('insertProfiles/:id', {
            url: '/insertProfiles/:id',
            templateUrl: 'views/insertProfiles.html',
            controller: 'insertProfilesCtrl'
        })
        .state('insertProjects', {
            url: '/insertProjects',
            templateUrl: 'views/insertProjects.html',
            controller: 'insertProjectsCtrl'
        })
        .state('insertProjects/:id', {
            url: '/insertProjects/:id',
            templateUrl: 'views/insertProjects.html',
            controller: 'insertProjectsCtrl'
        })
        .state('insertUsers', {
            url: '/insertUsers',
            templateUrl: 'views/insertUsers.html',
            controller: 'insertUsersCtrl'
        })
        .state('insertUsers/:id', {
            url: '/insertUsers/:id',
            templateUrl: 'views/insertUsers.html',
            controller: 'insertUsersCtrl'
        })
        .state('closingDate', {
            url: '/closingDate',
            templateUrl: 'views/closingDate.html',
            controller: 'closingDateCtrl'
        })
        .state('logout', {
            url: '/logout',
            templateUrl: 'views/logOut.html',
            controller: 'logOutCtrl'
        })
        .state('welcome', {
            url: '/welcome',
            templateUrl: 'views/welcome.html',
            controller: 'welcomeCtrl'
        })
       


});   

