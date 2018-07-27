angularApp.controller('insertCustomersCtrl', function ($scope, customersAPIService, $stateParams, $state, $timeout, $rootScope, usersAPIService ) {

    //necessario para remover o search customizado
    // $.fn.dataTable.ext.search.splice(0, 2);
    //---
    $scope.param = $stateParams;
    $rootScope.theParam = localStorage.getItem('param');

    if(localStorage.getItem("userCode") === null){
  
      var hash = $scope.param.param.split('Y2lqZXZqZWRvYnJh'); 
      var hashCode = hash[0];
      var hashToken = hash[1].replace('cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg','');

      var userCode = atob(hashCode);
      var userToken = atob(hashToken);

      localStorage.setItem('userCode', userCode);
      localStorage.setItem('userToken', userToken);

      setTimeout(() => {
      }, 1500);
    
  }    



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

                if($rootScope.global.permission.customer != 1){
                    $state.go('agenda', {param: localStorage.getItem('param')});
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
                    $rootScope.titulo = 'Cadastro';

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
                    console.log('entrou na merda do save Customer');
                    $scope.customer.contact;
                    $scope.token = localStorage.getItem('userToken');
                    $scope.customer.token = $scope.token;
                    customersAPIService.save($scope.customer).then(function (response) {
                        console.log('entrou mais ainda, agr eh pra salvar essa porra. Entrou na API ');
                        Materialize.toast('Cliente cadastrado!', 1500, 'toast-container');
                        $state.go('listCustomers', {param: localStorage.getItem('param')});
                    });
                };
            }

            function buscaCep2(cep, callback){
                $.ajax({
                    type: "GET",
                    async: false,
                    url: "https://viacep.com.br/ws/"+cep+"/json/",
                    contentType: "application/json; charset=utf-8",
                    data: "",
                    dataType: "json",
                    success: function(data) { callback(data); },
                    error: function(data) { callback("Erro"); }
                });
            }

            $scope.buscaCep = function(){
                // var cep = $scope.customer.zipCode.replaceAll("-", "")
                var cep = $scope.customer.zipCode;
                if(cep.length == 8){
                    var endereco = buscaCep2(cep,
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