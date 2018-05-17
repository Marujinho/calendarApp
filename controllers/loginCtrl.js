angularApp.controller('loginCtrl', function($scope, $rootScope, $state) {
    $rootScope.local = "";
    $rootScope.titulo = "LOGIN";
    $scope.login = {};
 
    

    //ATIVA AS TABS DO LOGIN
    $scope.initTab = function(){
        $('.tabs').tabs({swiplable: true});
    }

    $scope.initTab();
});