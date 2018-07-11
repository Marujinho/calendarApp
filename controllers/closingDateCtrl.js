angularApp.controller('closingDateCtrl', function ($scope, usersAPIService, $timeout, $state, $stateParams, $rootScope, closingDateAPIService) {

    //necessario para remover o search customizado
    $.fn.dataTable.ext.search.splice(0, 2);
    //---
    usersAPIService.login(localStorage.getItem('userCode')).then(
        function(responseUser) {
            if (responseUser.data[0] == "" || responseUser.data[0] == null) {
                alert("Você não tem acesso ao Easy Calendar");
                $state.go('welcome');
            } else {
                
                $('.button-collapse').sideNav({
                    menuWidth: 300, // Default is 240
                    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
                });

                $rootScope.global.idUser = responseUser.data[0].idUser;
                $rootScope.global.code = responseUser.data[0].code;
                $rootScope.global.permission = {
                    profile: responseUser.data[0].profileId.profile,
                    user: responseUser.data[0].profileId.user,
                    customer: responseUser.data[0].profileId.customer,
                    project: responseUser.data[0].profileId.project,
                    agenda: responseUser.data[0].profileId.agenda, 
                    requestConsultant: responseUser.data[0].profileId.requestConsultant, 
                    appointment: responseUser.data[0].profileId.appointment, 
                    report: responseUser.data[0].profileId.report,  
                    closure: responseUser.data[0].profileId.closure
                }

                if($rootScope.global.permission.project != 1){
                    $state.go('agenda');
                }

                $rootScope.local = "";

                $rootScope.titulo = 'Alterar data de corte';
                closingDateAPIService.getall().then(function (response) {
                    $scope.closingDateval = response.data[0];
                    $timeout(function () {
                        Materialize.updateTextFields();
                    }, 0);
                });
                
                $scope.closingDateSave = function () {
                    if($scope.closingDateval.date < 29){
                        closingDateAPIService.save($scope.closingDateval).then(function () {
                            Materialize.toast('Data de corte salva com sucesso!', 3000, 'toast-container');
                            $state.reload();
                        });
                    }else{
                        alert("Dia deve ser menor ou igual que 28!")
                    }
                };
            }
        }
    )
});