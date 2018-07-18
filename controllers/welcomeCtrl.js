angularApp.controller('welcomeCtrl', function($scope, $timeout, $rootScope) {

    if (localStorage["userCode"]) {
        $state.go('agenda');
      }

});