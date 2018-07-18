angularApp.controller('welcomeCtrl', function($scope, $timeout, $rootScope) {

    if (localStorage.getItem("userCode") !== null) {
        $state.go('agenda');
    }


});