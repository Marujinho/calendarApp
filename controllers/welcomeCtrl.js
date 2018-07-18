angularApp.controller('welcomeCtrl', function($scope, $timeout, $state,$rootScope) {

    if (localStorage.getItem("userCode") !== null) {
        $state.go('agenda');
    }


});