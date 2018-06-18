angularApp.controller('insertCustomersCtrl', function ($scope, customersAPIService, $stateParams, $state, $timeout, $rootScope, usersAPIService ) {

    //necessario para remover o search customizado
    // $.fn.dataTable.ext.search.splice(0, 2);
    //---
    usersAPIService.login(localStorage.getItem('userCode')).then(
        function(responseUser) {
            if (responseUser.data[0] == "" || responseUser.data[0] == null) {
                var local = window.location.href;
                local = local.split("portal");
                alert("Você não tem acesso ao Easy Calendar");
                window.location.href = local[0];
            } else {
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

                if($rootScope.global.permission.customer != 1){
                    $state.go('agenda');
                }

                $rootScope.local = "";
                $('.collapsibleContact').collapsible({});
                $scope.sp = $stateParams;

                if ($scope.sp.id) {
                    $rootScope.titulo = 'Editar Cliente';
                    customersAPIService.getByIdCust($scope.sp.id)
                        .then(function (response) {
                            $scope.customer = response.data[0];
                            $timeout(function () {
                                Materialize.updateTextFields();
                            }, 0);
                        });
                        
                } else {
                    $rootScope.titulo = 'Cadastrar Cliente';

                    $scope.customer = {
                        complement: "",
                    };

                    $scope.customer.contact = [{
                        name: "",
                        position: "",
                        telephone: [{
                            type: "",
                            number: ""
                        }],
                        email: [{
                            email: "",
                        }]
                    }];
                    $timeout(function () {
                        Materialize.updateTextFields();
                    }, 0);
                }
                

                $scope.removeContacts =  function(){
                    
                }
                $scope.moreContacts = function () {
                    $scope.customer.contact.push({
                        name: "",
                        position: "",
                        telephone: [{
                            type: "",
                            number: ""
                        }],
                        email: [{
                            email: "",
                        }]
                    });
                };

                $scope.removeContact = function(item){
                    $scope.customer.contact.splice(item, 1);
                    if($scope.customer.contact.length == 0){
                        $scope.moreContacts();
                    }
                }

                $scope.moreEmails = function (index) {
                    $scope.customer.contact[index].email.push({email: ""});
                };

                $scope.removeEmail = function(contactId, item){
                    $scope.customer.contact[contactId].email.splice(item, 1);
                    if($scope.customer.contact[contactId].email.length == 0){
                        $scope.moreEmails(contactId);
                    }
                }

                $scope.moreTelephones = function (index) {
                    $scope.customer.contact[index].telephone.push({type: "", number: ""});
                };

                $scope.removeTel = function(contactId, item){
                    $scope.customer.contact[contactId].telephone.splice(item, 1);
                    if($scope.customer.contact[contactId].telephone.length == 0){
                        $scope.moreTelephones(contactId);
                    }
                }

                $scope.insertCustomers = function () {
                    $scope.customer.contact;
                    customersAPIService.save($scope.customer).then(function (response) {
                        Materialize.toast('Cliente cadastrado!', 1500, 'toast-container');
                        $state.reload('listCustomers');
                    });
                };
            }

            $scope.buscaCep = function(){
                var cep = $scope.customer.zipCode.replaceAll("-", "")
                if(cep.length == 8){
                    var endereco = buscaCep(cep,
                        function(response){
                            if(response == "Erro"){
                                Alert("Erro ao consultar CEP!")
                            }else{
                                $scope.customer.district = response.bairro;
                                $scope.customer.address = response.logradouro;
                                $scope.customer.city = response.localidade;
                                $scope.customer.state = response.uf;
                                $timeout(function () {
                                    Materialize.updateTextFields();
                                }, 0);
                            }
                        }
                    );
                }
            }
        }
    );
});