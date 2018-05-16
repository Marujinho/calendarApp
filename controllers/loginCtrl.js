angularApp.controller('loginCtrl', function($scope, $rootScope) {
    $rootScope.local = "";
    $scope.titulo = "LOGIN";


    //ATIVA AS TABS DO LOGIN
    $(document).ready(function(){
        $('.tabs').tabs({
            "swipeable" : true
        });
        //ANIMAÇÃO FORMULARIO
        $('input#input_text, textarea#textarea2').characterCounter();
    });
});