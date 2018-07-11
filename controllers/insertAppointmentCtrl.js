angularApp.controller('insertAppointmentCtrl', function($scope, $timeout, appointmentAPIService, $state, $rootScope, $stateParams, usersAPIService, customersAPIService, projectsAPIService, usersAPIService ) {

    $rootScope.titulo = 'Apontamentos';
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

                $rootScope.local = "";
                $scope.sp = $stateParams;

                $('#activity').val('New Text');
                $('#activity').trigger('autoresize');
                Materialize.updateTextFields();

                if ($scope.sp.id) {
                    $rootScope.titulo = 'Editar Apontamento';
                    appointmentAPIService.getById($scope.sp.id).then(
                        function(response) {
                            $scope.appointment = response.data[0];
                            $scope.appointment.userId = response.data[0].userId.idUser;
                            $scope.appointment.customerId = response.data[0].customerId.idCustomer;
                            $scope.appointment.projectId = response.data[0].projectId.idProject;
                            $scope.appointment.appointmentStatusId = response.data[0].appointmentStatusId.idAppointmentStatus;

                            $timeout(function() {
                                angular.element('#userId').material_select();
                                angular.element('#projectId').material_select();
                                angular.element('#customerId').material_select();
                                Materialize.updateTextFields();
                            }, 0);

                            $('#activity').val('New Text');
                            $('#activity').trigger('autoresize');

                            var pickdate = $('#initalDate').pickadate({
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
                                onSet: function(context) {
                                    $scope.appointment.initialDate = moment(context.select).format('YYYY-MM-DD');
                                },
                            });
                            var picker = pickdate.pickadate('picker');
                            picker.set('select', $scope.appointment.initialDate, { format: 'yyyy-mm-dd' });
                        }
                    );
                } else {
                    $('#activity').val('New Text');
                    $('#activity').trigger('autoresize');
                    Materialize.updateTextFields();
                    $rootScope.titulo = 'Cadastrar Apontamento';
                }

                //getUser
                usersAPIService.getall().then(function(response) {
                    $scope.user = response.data;
                    $timeout(function() {
                        angular.element('#userId').material_select();
                    }, 0);
                });
                //getProject
                projectsAPIService.getall().then(function(response) {
                    $scope.project = response.data;
                    $timeout(function() {
                        angular.element('#projectId').material_select();
                    }, 0);
                });
                //getCustomer
                customersAPIService.getall().then(function(response) {
                    $scope.customer = response.data;
                    $timeout(function() {
                        angular.element('#customerId').material_select();
                    }, 0);
                });

                var pickdate = $('#initalDate').pickadate({
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
                    onSet: function(context) {
                        $scope.appointment.initialDate = moment(context.select).format('YYYY-MM-DD');
                    },
                });
                //timepicker
                var initialHour = $('#initialHour').pickatime({
                    default: 'now',
                    format: "HH:ii",
                    fromnow: 0,
                    twelvehour: false,
                    donetext: 'Salvar',
                    cleartext: 'Limpar',
                    canceltext: 'Cancelar',
                    ampmclickable: true,
                    aftershow: function() {}
                });
                var hourLunch = $('#hourLunch').pickatime({
                    default: 'now',
                    format: "HH:ii",
                    fromnow: 0,
                    twelvehour: false,
                    donetext: 'Salvar',
                    cleartext: 'Limpar',
                    canceltext: 'Cancelar',
                    ampmclickable: true,
                    aftershow: function() {}
                });
                var lastHour = $('#lastHour').pickatime({
                    default: 'now',
                    format: "HH:ii",
                    fromnow: 0,
                    twelvehour: false,
                    donetext: 'Salvar',
                    cleartext: 'Limpar',
                    canceltext: 'Cancelar',
                    ampmclickable: true,
                    aftershow: function() {}
                });
                var transfer = $('#transfer').pickatime({
                    default: 'now',
                    format: "HH:ii",
                    fromnow: 0,
                    twelvehour: false,
                    donetext: 'Salvar',
                    cleartext: 'Limpar',
                    canceltext: 'Cancelar',
                    ampmclickable: true,
                    aftershow: function() {}
                });
                var unproductiveHours = $('#unproductiveHours').pickatime({
                    default: 'now',
                    format: "HH:ii",
                    fromnow: 0,
                    twelvehour: false,
                    donetext: 'Salvar',
                    cleartext: 'Limpar',
                    canceltext: 'Cancelar',
                    ampmclickable: true,
                    aftershow: function() {}
                });

                $scope.insertAppointment = function() {
                    appointmentAPIService.update($scope.appointment);
                    $state.reload('listAppointment');
                };
            }
        }
    )
});