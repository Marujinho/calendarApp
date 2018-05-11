angularApp.controller('insertProjectsCtrl', function ($scope, projectsAPIService, customersAPIService, usersAPIService, $timeout, $state, $stateParams, $rootScope) {

    usersAPIService.login(WCMAPI.userCode).then(
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

                if($rootScope.global.permission.project != 1){
                    $state.go('agenda');
                }

                $scope.changeMask= function(myData, myData2){
                    $scope[myData][myData2] = formatMoney($scope[myData][myData2]);
                }

                //timepicker
                $('.timepicker').pickatime({
                    format: "HH:ii",
                    fromnow: 0,
                    twelvehour: false,
                    donetext: 'Salvar',
                    cleartext: 'Limpar',
                    canceltext: 'Cancelar',
                    ampmclickable: true,
                    aftershow: function () {}
                });

                $rootScope.local = "";
                $scope.sp = $stateParams;
                $('.select2').select2({placeholder: 'Selecione'});
                $scope.customer = {};
                if ($scope.sp.id) {
                    $rootScope.titulo = 'Editar Projetos';
                    projectsAPIService.getByIdProject($scope.sp.id) //pegar id
                        .then(function (response) {
                            $scope.project = response.data[0];
                            $scope.project.expense = $scope.project.expense.replaceAll(".", ",");
                            $scope.project.hourConsultantCost = $scope.project.hourConsultantCost.replaceAll(".", ",");
                            $scope.project.hourGPCost = $scope.project.hourGPCost.replaceAll(".", ",");
                            $scope.project.projectCost = $scope.project.projectCost.replaceAll(".", ",");
                            $scope.project.expenseType = $scope.project.expenseType.toString();
                            $scope.project.projectType = $scope.project.projectType.toString();
                            $scope.project.customerId = response.data[0].customerId.idCustomer;
                            $timeout(function () {
                                Materialize.updateTextFields();
                                $('#customer').change();
                            }, 0);
                        });
                } else {
                    $rootScope.titulo = 'Cadastrar Projetos';

                    $scope.project = {
                        
                        projectType:"0",
                        expenseType:"0",
                        projectCost: "0,00", 
                        expense: "0,00",
                        hourGPCost: "0,00", 
                        hourConsultantCost: "0,00"
                    }
                    
                }
                $timeout(function () {
                    Materialize.updateTextFields();
                }, 0);

                customersAPIService.getall().then(function (response) {
                    $scope.customer = response.data;
                });
                
                
                $scope.insertProjects = function () {
                    if ($scope.project.complement == undefined) {
                        $scope.project.complement = "";
                    }
                    if ($scope.project.expense == undefined || $scope.project.expense == '') {
                        $scope.project.expense = "0.00";
                    }else{
                        $scope.project.expense = $scope.project.expense.replaceAll(".", "").replaceAll(",", ".")
                    }
                    if ($scope.project.transfer == undefined || $scope.project.transfer == '') {
                        $scope.project.transfer = "0.00";
                    }else{
                        $scope.project.transfer = $scope.project.transfer.replaceAll(".", "").replaceAll(",", ".")
                    }
                    if ($scope.project.projectCost == undefined || $scope.project.projectCost == '') {
                        $scope.project.projectCost = "0.00";
                    }else{
                        $scope.project.projectCost = $scope.project.projectCost.replaceAll(".", "").replaceAll(",", ".")
                    }
                    if ($scope.project.hourGPCost == undefined || $scope.project.hourGPCost == '') {
                        $scope.project.hourGPCost = "0.00";
                    }else{
                        $scope.project.hourGPCost = $scope.project.hourGPCost.replaceAll(".", "").replaceAll(",", ".")
                    }
                    if ($scope.project.hourConsultantCost == undefined || $scope.project.hourConsultantCost == '') {
                        $scope.project.hourConsultantCost = "0.00";
                    }else{
                        $scope.project.hourConsultantCost = $scope.project.hourConsultantCost.replaceAll(".", "").replaceAll(",", ".")
                    }

                    projectsAPIService.save($scope.project).then(function () {
                        Materialize.toast('Projeto cadastrado!', 1500, 'toast-container');
                        $state.reload('listProjects');
                    });
                };

                $scope.buscaCep = function(){
                    var cep = $scope.project.zipCode.replaceAll("-", "");
                    if(cep.length == 8){
                        var endereco = buscaCep(cep,
                            function(response){
                                if(response == "Erro"){
                                    Alert("Erro ao consultar CEP!")
                                }else{
                                    $scope.project.district = response.bairro;
                                    $scope.project.address = response.logradouro;
                                    $scope.project.city = response.localidade;
                                    $scope.project.state = response.uf;
                                    $timeout(function () {
                                        Materialize.updateTextFields();
                                    }, 0);
                                }
                            }
                        );
                    }
                }
            }
        }
    )
});