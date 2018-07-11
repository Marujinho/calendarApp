angularApp.controller('insertUsersCtrl', function ($scope, $http, usersAPIService, customersAPIService, profilesAPIService, $stateParams, $timeout, $state, $rootScope) {

    $rootScope.titulo = 'Inserir usuários';   
    //necessario para remover o search customizado
    //if($.fn.dataTable.ext.search.lenght > 0){
     // $.fn.dataTable.ext.search.splice(0, 2);
    // }
    
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

                if($rootScope.global.permission.user != 1){
                    $state.go('agenda');
                }

                $scope.changeMask= function(myData, myData2){
                    $scope[myData][myData2] = formatMoney($scope[myData][myData2]);
                }

                $scope.user = {};
                $scope.sp = $stateParams;
                $('.select2').select2({placeholder: 'Selecione'});
                $rootScope.local = "";
                if ($scope.sp.id) {
                    $rootScope.titulo = 'Editar Usuários';
                    usersAPIService.getByIdUser($scope.sp.id)
                        .then(function (response) {
                            $scope.user = response.data[0];
                            $scope.user.remunerationType = Number(response.data[0].remunerationType).toString();
                            $scope.user.profileId = response.data[0].profileId.idProfile;

                            var pickdate = $('#dataaniversario').pickadate({
                                monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
                                    'Outubro', 'Novembro', 'Dezembro'
                                ],
                                monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                                weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
                                weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                                today: 'Hoje',
                                clear: 'Limpar',
                                close: 'Pronto',
                                labelMonthNext: 'Próximo mês',
                                labelMonthPrev: 'Mês anterior',
                                labelMonthSelect: 'Selecione um mês',
                                labelYearSelect: 'Selecione um ano',
                                selectMonths: true,
                                selectYears: 80,
                                format: 'dd/mm/yyyy',
                                onSet: function (context) {
                                    $scope.user.birthDay = moment(context.select).format('YYYY-MM-DD');
                                },
                            });
                            var picker = pickdate.pickadate('picker');
                            picker.set('select', $scope.user.birthDay, {
                                format: 'yyyy-mm-dd'
                            });

                            $timeout(function () {
                                Materialize.updateTextFields();
                                $('.select2').change();
                            }, 0);
                        });

                } else {
                    $rootScope.titulo = 'Cadastrar Usuários';
                    $scope.user.remunerationType = '0';
                    $scope.user.remuneration = "0,00"; 
                    $timeout(function () {
                        Materialize.updateTextFields();
                    }, 0);
                }

                $scope.listUser = [];
                usersAPIService.getall().then(
                    function (response) {
                        angular.forEach(response.data, function (value, key) {
                            $scope.listUser.push(value.code);
                        });
                    });
                $scope.codes = null;

                WCMAPI.Create({
                    url: '/api/public/ecm/dataset/datasets', // 
                    contentType: 'application/json',
                    async: false,
                    data: {
                        'name': 'colleague', // aqui fica o nome do dataset que vc quer conectar
                        'fields': [], //os campos vir em objeto
                        'constrSaints': [{ // os tipos de restrições
                            '_field': 'colleagueName', // campo que quero mostrar no select
                            '_initialValue': '104', //valor inicial e final
                            '_finalValue': '104', // valor final
                            '_type': 1, // type of the constraint (1 - MUST, 2 - SHOULD, 3 - MUST_NOT), // tipo dee
                            '_likeSearch': false // if it is a LIKE search // se tiver auto busca
                        }],
                        'order': []
                    },
                    success: function (data) { // se tudo ocorrer bem
                        $scope.codes = data.content.values;
                        $scope.user.name = WCMAPI.user;
                    },
                    error: function (err) {
                        console.log(err); // explode erro se nao entrar
                    }
                });

                $scope.profiles = profilesAPIService.getallProfiles().then(function (response) {
                    $scope.perfil = response.data;
                });

                $('#dataaniversario').pickadate({
                    monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
                        'Outubro', 'Novembro', 'Dezembro'
                    ],
                    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
                    weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                    today: 'Hoje',
                    clear: 'Limpar',
                    close: 'Pronto',
                    labelMonthNext: 'Próximo mês',
                    labelMonthPrev: 'Mês anterior',
                    labelMonthSelect: 'Selecione um mês',
                    labelYearSelect: 'Selecione um ano',
                    selectMonths: true,
                    selectYears: 80,
                    format: 'dd/mm/yyyy',
                    onSet: function (context) {
                        $scope.user.birthDay = moment(context.select).format('YYYY-MM-DD');
                    },
                });
                
                $scope.insertUsers = function () {
                    if ($scope.user.remuneration == undefined || $scope.user.remuneration == '') {
                        $scope.user.remuneration = "0.00";
                    }else{
                        $scope.user.remuneration = $scope.user.remuneration.replaceAll(".", "").replaceAll(",", ".")
                    }
                    usersAPIService.save($scope.user).then(function () {
                        $state.reload('listUsers');
                        Materialize.toast('Usuário cadastrado!', 1500, 'toast-container');
                    });
                };
            }
        }
    )
});