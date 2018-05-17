angularApp.controller('loginCtrl', function($scope, $rootScope, $state) {
    $rootScope.local = "";
    $rootScope.titulo = "LOGIN";
    $scope.login = {server: "123"};
                       

    //ATIVA AS TABS DO LOGIN
    
    $scope.initTab = function(){
        $('.tabs').tabs();
        //ANIMAÇÃO FORMULARIO
        //$('input#input_text, textarea#textarea2').characterCounter();
        //{"swipeable": true}
    }
    $scope.initTab();
    
    /*
    $('.tabs').tabs({swipeable: true});
    //ANIMAÇÃO FORMULARIO
    $('input#input_text, textarea#textarea2').characterCounter();
    */

});