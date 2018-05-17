angularApp.controller('loginCtrl', function($scope, $rootScope, $state) {
    $rootScope.local = "";
    $rootScope.titulo = "LOGIN";
    $scope.login = [{server: "123"},
                    {cnpj: "1234342"},
                    {access: "joao"},
                    {password:"999"}];
 
    

    //ATIVA AS TABS DO LOGIN
    
    $scope.initTab = function(){
        $('.tabs').tabs();
        //ANIMAÇÃO FORMULARIO
        //$('input#input_text, textarea#textarea2').characterCounter();

    }
    $scope.initTab();
    
    /*
    $('.tabs').tabs({swipeable: true});
    //ANIMAÇÃO FORMULARIO
    $('input#input_text, textarea#textarea2').characterCounter();
    */

});