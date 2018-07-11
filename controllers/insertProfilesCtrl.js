angularApp.controller('insertProfilesCtrl', function($scope, profilesAPIService, $stateParams, $rootScope, $state, $timeout, usersAPIService ) {

    //necessario para remover o search customizado
    // $.fn.dataTable.ext.search.splice(0, 2);
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
    
                if($rootScope.global.permission.profile != 1){
                    $state.go('agenda');
                }

                $rootScope.local = "";  
                $scope.sp = $stateParams;

                // caso venha o id na rota, entra em modo de edi��o
                if ($scope.sp.id) {
                    $scope.titulo = 'Editar Perfil';
                    profilesAPIService.getById($scope.sp.id).then(
                        function(response) {
                            $scope.profile = response.data[0];       
                            $timeout(function() {
                                Materialize.updateTextFields();
                            }, 0);
                        }
                    );
                } else {
                    
                    $rootScope.titulo = 'Cadastrar Perfil';
                    Materialize.updateTextFields();
                    //define a variavel de profile
                    $scope.profile = {
                        name: "",
                        project: 0,
                        customer: 0,
                        user: 0,
                        profile: 0,
                        agenda: 0,
                        requestConsultant: 0,
                        appointment: 0,
                        report: 0,
                        closure: 0
                    };
                }

                //Cadastra o perfil
                $scope.insertProfiles = function() {
                    $scope.profile.name;
                    $scope.token = localStorage.getItem('userToken');
                    $scope.profile.token = $scope.token;
                    profilesAPIService.saveProfile($scope.profile).then(function() {
                        Materialize.toast('Perfil cadastrado!', 1500, 'toast-container');
                        $state.reload('listProfiles')
                    });
                };
            }
        }
    )
});