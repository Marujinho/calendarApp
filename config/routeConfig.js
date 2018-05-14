angularApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('/agenda')

    $stateProvider.state('agenda', {
            url: '/agenda',
            templateUrl: '/easy_calendar/resources/js/views/agenda.html',
            controller: 'agendaCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: '/easy_calendar/resources/js/views/login.html',
            controller: 'loginCtrl'
        })
        .state('listCustomers', {
            url: '/listCustomers',
            templateUrl: '/easy_calendar/resources/js/views/listCustomers.html',
            controller: 'listCustomersCtrl'
        })
        .state('listAppointment', {
            url: '/listAppointment',
            templateUrl: '/easy_calendar/resources/js/views/listAppointment.html',
            controller: 'listAppointmentCtrl'
        })
        .state('insertAppointment', {
            url: '/insertAppointment',
            templateUrl: '/easy_calendar/resources/js/views/insertAppointment.html',
            controller: 'insertAppointmentCtrl'
        })
        .state('insertAppointment/:id', {
            url: '/insertAppointment/:id',
            templateUrl: '/easy_calendar/resources/js/views/insertAppointment.html',
            controller: 'insertAppointmentCtrl'
        })
        .state('listProfiles', {
            url: '/listProfiles',
            templateUrl: '/easy_calendar/resources/js/views/listProfiles.html',
            controller: 'listProfilesCtrl'
        })
        .state('listProjects', {
            url: '/listProjects',
            templateUrl: '/easy_calendar/resources/js/views/listProjects.html',
            controller: 'listProjectsCtrl'
        })
        .state('reports', {
            url: '/reports',
            templateUrl: '/easy_calendar/resources/js/views/reports.html',
            controller: 'reportsCtrl'
        })
        .state('listUsers', {
            url: '/listUsers',
            templateUrl: '/easy_calendar/resources/js/views/listUsers.html',
            controller: 'listUsersCtrl'
        })
        .state('insertCustomers', {
            url: '/insertCustomers',
            templateUrl: '/easy_calendar/resources/js/views/insertCustomers.html',
            controller: 'insertCustomersCtrl'
        })
        .state('insertCustomers/:id', {
            url: '/insertCustomers/:id',
            templateUrl: '/easy_calendar/resources/js/views/insertCustomers.html',
            controller: 'insertCustomersCtrl'
        })
        .state('insertProfiles', {
            url: '/insertProfiles',
            templateUrl: '/easy_calendar/resources/js/views/insertProfiles.html',
            controller: 'insertProfilesCtrl'
        })
        .state('insertProfiles/:id', {
            url: '/insertProfiles/:id',
            templateUrl: '/easy_calendar/resources/js/views/insertProfiles.html',
            controller: 'insertProfilesCtrl'
        })
        .state('insertProjects', {
            url: '/insertProjects',
            templateUrl: '/easy_calendar/resources/js/views/insertProjects.html',
            controller: 'insertProjectsCtrl'
        })
        .state('insertProjects/:id', {
            url: '/insertProjects/:id',
            templateUrl: '/easy_calendar/resources/js/views/insertProjects.html',
            controller: 'insertProjectsCtrl'
        })
        .state('insertUsers', {
            url: '/insertUsers',
            templateUrl: '/easy_calendar/resources/js/views/insertUsers.html',
            controller: 'insertUsersCtrl'
        })
        .state('insertUsers/:id', {
            url: '/insertUsers/:id',
            templateUrl: '/easy_calendar/resources/js/views/insertUsers.html',
            controller: 'insertUsersCtrl'
        })
        .state('closingDate', {
            url: '/closingDate',
            templateUrl: '/easy_calendar/resources/js/views/closingDate.html',
            controller: 'closingDateCtrl'
        })

});