angularApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

    $urlRouterProvider.otherwise('agenda');

    $stateProvider.state('agenda', {
            url: '/agenda/:param',
            templateUrl: 'views/agenda.html',
            controller: 'agendaCtrl'
        })
        .state('login', {
            url: '/login/:id',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .state('listCustomers', {
            url: '/listCustomers/:param',
            templateUrl: 'views/listCustomers.html',
            controller: 'listCustomersCtrl'
        })
        .state('listAppointment', {
            url: '/listAppointment/:param',
            templateUrl: 'views/listAppointment.html',
            controller: 'listAppointmentCtrl'
        })
        .state('insertAppointment', {           
            url: '/insertAppointment/:param',
            templateUrl: 'views/insertAppointment.html',
            controller: 'insertAppointmentCtrl'
        })
        .state('insertAppointmentEdit', {    //AQUI       
            url: '/insertAppointment/:param/:id',
            templateUrl: 'views/insertAppointment.html',
            controller: 'insertAppointmentCtrl'
        })
        .state('listProfiles', {
            url: '/listProfiles/:param',
            templateUrl: 'views/listProfiles.html',
            controller: 'listProfilesCtrl'
        })
        .state('listProjects', {
            url: '/listProjects/:param',
            templateUrl: 'views/listProjects.html',
            controller: 'listProjectsCtrl'
        })
        .state('reports', {
            url: '/reports/:param',
            templateUrl: 'views/reports.html',
            controller: 'reportsCtrl'
        })
        .state('listUsers', {
            url: '/listUsers/:param',
            templateUrl: 'views/listUsers.html',
            controller: 'listUsersCtrl'
        })
        .state('insertCustomers', {         
            url: '/insertCustomers/:param',
            templateUrl: 'views/insertCustomers.html',
            controller: 'insertCustomersCtrl'
        })
        .state('insertCustomersEdit', {
            url: '/insertCustomers/:param/:id',
            templateUrl: 'views/insertCustomers.html',
            controller: 'insertCustomersCtrl'
        })
        .state('insertProfiles', {          
            url: '/insertProfiles/:param',
            templateUrl: 'views/insertProfiles.html',
            controller: 'insertProfilesCtrl'
        })
        .state('insertProfilesEdit', {         
            url: '/insertProfiles/:param/:id',
            templateUrl: 'views/insertProfiles.html',
            controller: 'insertProfilesCtrl'
        })
        .state('insertProjects', {          
            url: '/insertProjects/:id',
            templateUrl: 'views/insertProjects.html',
            controller: 'insertProjectsCtrl'
        })
        .state('insertProjectsEdit', {         
            url: '/insertProjects/:param/:id',
            templateUrl: 'views/insertProjects.html',
            controller: 'insertProjectsCtrl'
        })
        .state('insertUsers', {         
            url: '/insertUsers/:id',
            templateUrl: 'views/insertUsers.html',
            controller: 'insertUsersCtrl'
        })
        .state('insertUsersEdit', {         
            url: '/insertUsers/:param/:id',
            templateUrl: 'views/insertUsers.html',
            controller: 'insertUsersCtrl'
        })
        .state('closingDate', {
            url: '/closingDate/:param',
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

