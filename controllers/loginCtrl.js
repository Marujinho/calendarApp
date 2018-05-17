angularApp.controller('loginCtrl', function($scope, $rootScope, $state) {
    $rootScope.local = "";
    $rootScope.titulo = "LOGIN";
    $scope.login = {};
 
    

    //ATIVA AS TABS DO LOGIN
    $scope.initTab = function(){
        $('.tabs').tabs({
            "swipeable" : true
        });
        //ANIMAÇÃO FORMULARIO
        $('input#input_text, textarea#textarea2').characterCounter();

    }

   

    $scope.initTab();
});