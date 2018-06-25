angularApp.controller('insertProjectsCtrl', function ($scope, projectsAPIService, customersAPIService, usersAPIService, $timeout, $state, $stateParams, $rootScope) {

    //necessario para remover o search customizado
    // $.fn.dataTable.ext.search.splice(0, 2);
    //---
    usersAPIService.login(localStorage.getItem('userCode')).then(
        function (responseUser) {
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

                if ($rootScope.global.permission.project != 1) {
                    $state.go('agenda');
                }

                function formatMoney(val){
                    var value = val.toString().replace(/\D/g,'').replace(/^[0]+/, '');
                    switch(value.length) {
                        case 0:
                            value = '0.00';
                            break;
                
                        case 1:
                            value = '0.0' + value;
                            break;
                
                        case 2:
                            value = '0.' + value;
                            break;
                
                        default:
                            value = value.slice(0, -2) + '.' + value.slice(-2);
                            break;
                    }
                
                    return value.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
                }
                

                $scope.changeMask = function (myData, myData2) {
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
                $('.select2').select2({
                    placeholder: 'Selecione'
                });
                $scope.customer = {};
                if ($scope.sp.id) {
                    $rootScope.titulo = 'Editar Projetos';
                    projectsAPIService.getByIdProject($scope.sp.id) //pegar id
                        .then(function (response) {
                            $scope.project = response.data[0];
                            $scope.project.expense = $scope.project.expense.replace(".", ",");
                            $scope.project.hourConsultantCost = $scope.project.hourConsultantCost.replace(".", ",");
                            $scope.project.hourGPCost = $scope.project.hourGPCost.replace(".", ",");
                            $scope.project.projectCost = $scope.project.projectCost.replace(".", ",");
                            $scope.project.expenseType = $scope.project.expenseType.toString();
                            $scope.project.projectType = $scope.project.projectType.toString();
                            $scope.project.customerId = response.data[0].customerId.idCustomer;
                            $timeout(function () {
                                Materialize.updateTextFields();
                                $('#customer').change();
                            }, 0);
                        });
                } else {
                    $rootScope.titulo = 'Projetos';

                    $scope.project = {

                        projectType: "0",
                        expenseType: "0",
                        projectCost: "0,00",
                        expense: "0,00",
                        hourGPCost: "0,00",
                        hourConsultantCost: "0,00"
                    }

                }
                $timeout(function () {
                    Materialize.updateTextFields();
                }, 0);
                var customers = [{}];
                customersAPIService.getall().then(function (response) {
                    $scope.customer = response.data;
                    
                    for(var i = 0; i < $scope.customer.length; i++){
                        customers.push($scope.customer[i]);
                    }
                    // $scope.project.customerId = $scope.customer.idCustomer; 
                });
                $scope.isCustomerAddress = function () {
                    if ($scope.project.isCustomerAddress == true) {
                        $scope.getIdSelected = $scope.project.customerId;
                        var itenArray = [{}];
                        for (var i = 0; i < $scope.customer.length; i++) {
                            var itens = $scope.customer;
                            if($scope.getIdSelected == itens[i].idCustomer){
                                itenArray = itens[i];
                            }
                        }
                        $scope.project.zipCode = itenArray.zipCode;
                        $scope.project.district = itenArray.district;
                        $scope.project.address = itenArray.address;
                        $scope.project.number = itenArray.number;
                        $scope.project.city = itenArray.city;
                        $scope.project.state = itenArray.state;
                        $scope.project.complement = itenArray.complement;
                        $timeout(function () {
                            Materialize.updateTextFields();
                        }, 0);
                    }else{
                        $scope.project.zipCode = "";
                        $scope.project.district = "";
                        $scope.project.address = "";
                        $scope.project.number = "";
                        $scope.project.city = "";
                        $scope.project.state = "";
                        $scope.project.complement = "";
                        $timeout(function () {
                            Materialize.updateTextFields();
                        }, 0);
                    }
                };
                $scope.insertProjects = function () {
                    if ($scope.project.isCustomerAddress == undefined) {
                        $scope.project.isCustomerAddress = "false";
                    }
                    if ($scope.project.complement == undefined) {
                        $scope.project.complement = "";
                    }
                    if ($scope.project.expense == undefined || $scope.project.expense == '') {
                        $scope.project.expense = "0.00";
                    } else {
                        $scope.project.expense = $scope.project.expense.replace(".", "").replace(",", ".")
                    }
                    if ($scope.project.transfer == undefined || $scope.project.transfer == '') {
                        $scope.project.transfer = "0.00";
                    } else {
                        $scope.project.transfer = $scope.project.transfer.replace(":", "")
                    }
                    if ($scope.project.projectCost == undefined || $scope.project.projectCost == '') {
                        $scope.project.projectCost = "0.00";
                    } else {
                        $scope.project.projectCost = $scope.project.projectCost.replace(".", "").replace(",", ".")
                    }
                    if ($scope.project.hourGPCost == undefined || $scope.project.hourGPCost == '') {
                        $scope.project.hourGPCost = "0.00";
                    } else {
                        $scope.project.hourGPCost = $scope.project.hourGPCost.replace(".", "").replace(",", ".")
                    }
                    if ($scope.project.hourConsultantCost == undefined || $scope.project.hourConsultantCost == '') {
                        $scope.project.hourConsultantCost = "0.00";
                    } else {
                        $scope.project.hourConsultantCost = $scope.project.hourConsultantCost.replace(".", "").replace(",", ".")
                    }
                    
                    console.log(JSON.stringify($scope.project));
                    projectsAPIService.save($scope.project).then(function () {

                        Materialize.toast('Projeto cadastrado!', 1500, 'toast-container');
                        $state.reload('listProjects');
                        // console.log(JSON.stringify($scope.project));
                        
                    });
                };

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
                    // var cep = $scope.customer.zipCode.replace("-", "")
                    var cep = $scope.project.zipCode;
                    if(cep.length == 8){
                        var endereco = buscaCep2(cep,
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