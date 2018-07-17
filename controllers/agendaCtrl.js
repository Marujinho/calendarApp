angularApp.controller('agendaCtrl', function($scope, appointmentAPIService, $rootScope, usersAPIService, projectsAPIService, customersAPIService, holidayAPIService, closingDateAPIService, calendarRequestAPIService, expenseTypeOpenAPIService, $timeout, $state, $compile) {

    console.log('lolipop');

    usersAPIService.login(localStorage.getItem('userCode')).then(function(responseUser) {
        
            if (responseUser.data[0] == "" || responseUser.data[0] == null) {   
                
                alert("Você não tem acesso ao Easy Calendar");
                $state.go('welcome');
            } else {

                Materialize.updateTextFields();
                $rootScope.global.idUser = responseUser.data[0].idUser;
                $rootScope.global.code = responseUser.data[0].code;
                $rootScope.global.email = responseUser.data[0].email;
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
                console.log($rootScope.global.permission.agenda);
                $('.button-collapse').sideNav({
                    menuWidth: 300, // Default is 240
                    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
                });

                $scope.filter = {
                    filterConsultores: [$rootScope.global.idUser],
                    filterClientes: [],
                    filterProjetos: []
                }


                $(".toast").fadeOut("slow");
                Materialize.toast('Carregando informações!', 30000, 'toast-container');
                $rootScope.local = "agenda";
                $('.global-alert-popover')
                    .remove();
                $rootScope.titulo = "";
                var date = new Date();
                var thisDate = new Date(date.getFullYear(), date.getMonth(), 1);
                Materialize.updateTextFields();
                $scope.holiday = {};
                $scope.appointment = {};
                $scope.newAppointment = {};
                $scope.request = {};
                $scope.findDates = [];
                var current = moment();
                $scope.findDates.push(moment(current.format()).format("MM") + "/" + moment(current.format()).format("YYYY"));
                $scope.findDates.push(moment(current.format()).add(-1, 'month').format("MM") + "/" + moment(current.format()).format("YYYY"));
                $scope.findDates.push(moment(current.format()).add(1, 'month').format("MM") + "/" + moment(current.format()).format("YYYY"));
                $scope.accept = {};
                $scope.listEvents = [];
                $scope.project = [];
                $scope.freeUsersMonth = [];
                $scope.freeUsers = [];
                $scope.atraso = [];
                $scope.Salvar = "Salvar";
                $scope.blockAccept = false;
                $scope.listBirth = [];
                //cor das letras dos dias

                $scope.changeMask = function(myData, myData2) {
                    $scope[myData][myData2] = formatMoney($scope[myData][myData2]);
                }

                $scope.changeMaskCost = function(myData) {
                    $scope.newAppointment.expense[myData].cost = formatMoney($scope.newAppointment.expense[myData].cost);
                }

                $('.modal').modal({
                    ready: function() {
                        Materialize.updateTextFields();
                    }
                });

                $(window).ready(function() {
                    $('.select2').select2();
                });

                $scope.filterData = function() {
                    $('#calendar').fullCalendar('removeEvents');
                    var clone = angular.copy($scope.listEvents);
                    var cloneNaoApontado = [];
                    var cloneApontado = [];
                    var cloneSolicitacao = [];
                    var cloneFerias = [];
                    var cloneParticular = [];
                    var filtroCheckBox = [];
                    var filtrado = false;


                    if ($("#livres").is(":checked")) {

                        var current = $('#calendar').fullCalendar('getDate');
                        var month = moment(current.format()).format("MM");
                        var year = moment(current.format()).format("YYYY");
                        var dataAtual = moment().format("YYYY/MM/DD");

                        if ($scope.freeUsersMonth.indexOf(month + "/" + year) < 0) {
                            $scope.freeUsersMonth.push(month + "/" + year);
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando informações!', 30000, 'toast-container');
                            appointmentAPIService.getmonthappointment(month, year).then(function(response) {
                                    $.each($scope.user, function(key, obj) {
                                        if (obj.profileId.appointment == 1) {
                                            var lista = response.data.filter(
                                                function(val) {
                                                    return (val.userId.idUser == obj.idUser);
                                                }
                                            );
                                            var lastdayOfMonth = new Date(year, month, 0);
                                            if (lista.length > 0) {
                                                for (i = 1; i <= lastdayOfMonth.getDate(); i++) {
                                                    var day = i <= 9 ? "0" + i.toString() : i;

                                                    if (lista.findIndex(function(element, index, array) {
                                                            var dataElement = moment(element.initialDate, "YYYY-MM-DD").format("DD/MM/YYYY");

                                                            var dataI = moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("DD/MM/YYYY");
                                                            if (dataElement == dataI) {
                                                                return true;
                                                            }
                                                        }) < 0) {

                                                        var eventData = {
                                                            id: obj.idUser + year + month + day,
                                                            title: obj.name + " - Livre",
                                                            start: moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("YYYY-MM-DD"),
                                                            end: moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("YYYY-MM-DD"),
                                                            color: "#FFFFFF",
                                                            textColor: "#000000",
                                                            borderColor: "#000000",
                                                            type: "Livre",
                                                            user: obj.idUser,
                                                            customer: "0",
                                                            project: "0",
                                                            startEditable: false
                                                        };
                                                        $scope.freeUsers.push(eventData);
                                                    }
                                                }
                                            } else {
                                                for (i = 1; i <= lastdayOfMonth.getDate(); i++) {
                                                    var day = i <= 9 ? "0" + i.toString() : i;
                                                    var eventData = {
                                                        id: obj.idUser + year + month + i,
                                                        title: obj.name + " - Livre",
                                                        start: moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("YYYY-MM-DD"),
                                                        end: moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("YYYY-MM-DD"),
                                                        color: "#FFFFFF",
                                                        textColor: "#000000",
                                                        borderColor: "#000000",
                                                        type: "Livre",
                                                        user: obj.idUser,
                                                        customer: "0",
                                                        project: "0",
                                                        startEditable: false
                                                    };
                                                    $scope.freeUsers.push(eventData);
                                                }
                                            }
                                        }
                                    });

                                    var listaLivres = $scope.freeUsers;
                                    if ($scope.filter.filterConsultores.length > 0) {
                                        listaLivres = listaLivres.filter(
                                            function(val) {
                                                return $scope.filter.filterConsultores.indexOf(val.user) != -1;
                                            }
                                        )
                                    }

                                    $(".toast").fadeOut("slow");
                                    if ($("#livres").is(":checked")) {
                                        $('#calendar').fullCalendar('renderEvents', listaLivres, true);
                                    }
                                },
                                function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 04 - contate o administrador', 5500, 'toast-container')

                                });
                        } else {

                            var listaLivres = $scope.freeUsers;
                            if ($scope.filter.filterConsultores.length > 0) {
                                listaLivres = listaLivres.filter(
                                    function(val) {
                                        return $scope.filter.filterConsultores.indexOf(val.user) != -1;
                                    }
                                )
                            }

                            $(".toast").fadeOut("slow");
                            if ($("#livres").is(":checked")) {
                                $('#calendar').fullCalendar('renderEvents', listaLivres, true);
                            }
                        }

                    } else {

                        if ($("#naoApontado").is(":checked")) {
                            filtrado = true;
                            cloneNaoApontado = clone.filter(
                                function(val) {
                                    return (val.type == "apontamentoNaoEfetuado");
                                }
                            );
                        }

                        if ($("#apontado").is(":checked")) {
                            filtrado = true;
                            cloneApontado = clone.filter(
                                function(val) {
                                    return (val.type == "apontamentoEfetuado");
                                }
                            );
                        }

                        if ($("#feriasFilter").is(":checked")) {
                            filtrado = true;
                            cloneFerias = clone.filter(
                                function(val) {
                                    return val.type == "ferias";
                                }
                            );
                        }

                        if ($("#particularFilter").is(":checked")) {
                            filtrado = true;
                            cloneParticular = clone.filter(
                                function(val) {
                                    return val.type == "particular";
                                }
                            );
                        }

                        if ($("#solicitacaoFilter").is(":checked")) {
                            filtrado = true;
                            cloneSolicitacao = clone.filter(
                                function(val) {
                                    return (val.type == "solicitacao");
                                }
                            );
                        }

                        if (filtrado == true) {
                            Array.prototype.push.apply(filtroCheckBox, cloneNaoApontado);
                            Array.prototype.push.apply(filtroCheckBox, cloneApontado);
                            Array.prototype.push.apply(filtroCheckBox, cloneFerias);
                            Array.prototype.push.apply(filtroCheckBox, cloneSolicitacao);
                            Array.prototype.push.apply(filtroCheckBox, cloneParticular);
                        } else {
                            filtroCheckBox = clone;
                        }

                        if ($scope.filter.filterConsultores.length > 0) {
                            filtrado = true;
                            filtroCheckBox = filtroCheckBox.filter(
                                function(val) {
                                    return $scope.filter.filterConsultores.indexOf(parseInt(val.user)) != -1;
                                }
                            )
                        }

                        if ($scope.filter.filterClientes.length > 0) {
                            filtrado = true;
                            filtroCheckBox = filtroCheckBox.filter(
                                function(val) {
                                    return ($scope.filter.filterClientes.indexOf(parseInt(val.customer)) != -1 || val.type == "ferias");
                                }
                            )
                        }

                        if ($scope.filter.filterProjetos.length > 0) {
                            filtrado = true;
                            filtroCheckBox = filtroCheckBox.filter(
                                function(val) {
                                    return ($scope.filter.filterProjetos.indexOf(parseInt(val.project)) != -1 || val.type == "ferias");
                                }
                            )
                        }

                        if (filtrado == true) {
                            Array.prototype.push.apply(filtroCheckBox,
                                clone.filter(
                                    function(val) {
                                        return val.type == "feriado" || val.type == "aniversario";
                                    }
                                )
                            )
                        }

                        $('#calendar').fullCalendar('renderEvents', filtroCheckBox, true);
                    }
                }

                $('#diaSelecionado').modal({
                    ready: function() {
                        $('ul.tabs').tabs({
                            onShow: function() {
                                $scope.$apply();
                            }
                        });
                        if ($rootScope.global.permission.agenda == 1) {
                            if ($scope.localTab == "feriado") {
                                $('ul.tabs').tabs('select_tab', 'feriado');
                                holidayAPIService.getbyid($scope.holiday.idHoliday).then(function(response) {
                                    //$("#nomeFeriado").prop("disabled", "true")
                                    $scope.holiday.name = response.data[0].name;
                                    //$("#dateHoliday").prop("disabled", "true")
                                    $scope.holiday.date = response.data[0].date;
                                    $('#dateHoliday').pickadate('picker').set('select', moment(response.data[0].date).format("DD/MM/YYYY"), {
                                        format: 'dd/mm/yyyy'
                                    }).trigger("change");
                                }, function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 05 - contate o administrador', 5500, 'toast-container')

                                });
                            } else if ($scope.localTab == "new") {
                                $('ul.tabs').tabs('select_tab', 'agenda');
                            }
                        } else {
                            $('ul.tabs').tabs('select_tab', 'solicitacaoAgenda');
                        }
                    },
                    complete: function() {
                        if ($scope.localTab == "feriado") {
                            $('#tabAgenda').removeClass("disabled");
                            $('#tabFerias').removeClass("disabled");
                            $('#tabFeriado').removeClass("disabled");
                            $('#tabSolicitacao').removeClass("disabled");
                            //$("#nomeFeriado").prop("disabled", "false");
                            // $("#dateHoliday").prop("disabled", "false");
                            $scope.holiday = {};
                        }
                    }
                });

                $('#modalAceitarAtraso').modal({
                    ready: function() {
                        $('ul.tabs').tabs({
                            onShow: function() {
                                $scope.$apply();
                            }
                        });
                        appointmentAPIService.getById($scope.atraso.idappointment).then(
                            function(response) {
                                $scope.atual = response.data[0];
                                $scope.atual.expense = response.data[0].appointmentExpense;
                                $scope.atual.initialDate = moment(response.data[0].initialDate, "YYYY-MM-DD").format("DD/MM/YYYY");
                                $scope.solicitado = angular.copy(response.data[0]);
                                appointmentAPIService.getrequestByAppointment($scope.atraso.idappointment).then(
                                    function(responseRequest) {
                                        $scope.solicitado.initialHour = responseRequest.data[0].initialHour;
                                        $scope.solicitado.hourLunch = responseRequest.data[0].hourLunch;
                                        $scope.solicitado.lastHour = responseRequest.data[0].lastHour;
                                        $scope.solicitado.unproductiveHours = responseRequest.data[0].unproductiveHours;
                                        $scope.solicitado.expense = responseRequest.data[0].requestAppointmentExpense;
                                        $scope.solicitado.executed = responseRequest.data[0].executed;

                                        Materialize.updateTextFields();
                                        $(".toast").fadeOut("slow");
                                        Materialize.toast('Informações carregadas com sucesso! ;)', 3000, 'toast-container');
                                    },
                                    function() {
                                        $(".toast").fadeOut("slow");
                                        Materialize.toast('Erro 07 - contate o administrador', 5500, 'toast-container')

                                    }
                                )

                                $(".toast").fadeOut("slow");
                                Materialize.toast('Dados carregados com sucesso.', 2500, 'toast-container');
                            },
                            function() {
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Erro 06 - contate o administrador', 5500, 'toast-container')

                            }
                        );
                    },
                    complete: function() {

                    }
                });

                //calendario para os feriados
                $('.datepicker').pickadate({
                    monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
                    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    weekdaysFull: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabádo'],
                    weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                    today: 'Hoje',
                    clear: "",
                    close: 'Pronto',
                    labelMonthNext: 'Próximo mês',
                    labelMonthPrev: 'Mês anterior',
                    labelMonthSelect: 'Selecione um mês',
                    labelYearSelect: 'Selecione um ano',
                    selectMonths: true,
                    selectYears: 80,
                    format: 'dd/mm/yyyy',
                    default: 'now',
                    editable: false,
                });

                //timepicker
                $('.timepicker').pickatime({
                    format: "HH:ii",
                    fromnow: 0,
                    twelvehour: false,
                    donetext: 'Salvar',
                    cleartext: '',
                    canceltext: 'Cancelar',
                    ampmclickable: true,
                    aftershow: function() {}
                });

                function diffHoras(hora1, hora2, intervalo) {
                    var data1Quebrada = hora1.split(":");
                    var data2Quebrada = hora2.split(":");
                    var dataIntervalo = intervalo.split(":");
                    var horas, minutos, segundos;

                    if (parseInt(data1Quebrada[0]) > parseInt(data2Quebrada[0])) {

                        horas = parseInt(data1Quebrada[0]) - parseInt(data2Quebrada[0]) - parseInt(dataIntervalo[0]);
                        minutos = parseInt(data1Quebrada[1]) - parseInt(data2Quebrada[1]) - parseInt(dataIntervalo[1]);
                        segundos = parseInt(data1Quebrada[2]) - parseInt(data2Quebrada[2]) - parseInt(dataIntervalo[2]);
                    } else {
                        horas = parseInt(data2Quebrada[0]) - parseInt(data1Quebrada[0]) - parseInt(dataIntervalo[0]);
                        minutos = parseInt(data2Quebrada[1]) - parseInt(data1Quebrada[1]) - parseInt(dataIntervalo[1]);
                        segundos = parseInt(data2Quebrada[2]) - parseInt(data1Quebrada[2]) - parseInt(dataIntervalo[2]);
                    }
                    while (parseInt(segundos) < 0) {
                        minutos = minutos - 1;
                        segundos = segundos + 60;
                    }
                    while (parseInt(minutos) < 0) {
                        horas = horas - 1;
                        minutos = minutos + 60;
                    }
                    horas = horas < 10 ? "0" + horas : horas;
                    minutos = minutos < 10 ? "0" + minutos : minutos;
                    segundos = segundos < 10 ? "0" + segundos : segundos;
                    return horas + ":" + minutos + ":" + segundos;
                };

                $scope.addExpense = function() {
                    $scope.newAppointment.expense.push({
                        expenseOpenTypeId: '',
                        description: '',
                        cost: '0,00'
                    });
                };

                $scope.initSelect2 = function() {
                    $timeout(function() {
                        $('.expenseOpenTypeId').select2();
                    }, 1);
                };

                expenseTypeOpenAPIService.getall().then(function(response) {
                    $scope.expenseOpenType = response.data;
                }, function() {
                    $(".toast").fadeOut("slow");
                    Materialize.toast('Erro 09 - contate o administrador', 5500, 'toast-container')

                });

                $('.fc-title').addClass('tooltipped');

                $('.tooltipped').tooltip({
                    delay: 50
                });

                var $calendar = $('#calendar').fullCalendar({
                    
                    header: false,
                    // header: {
                    //     left: '',
                    //     center: 'title',
                    //     right: ''
                    // },
                    height: $(window).height() - 65,
                    windowResizeDelay: true,
                    handleWindowResize: true,
                    showNonCurrentDates: true,
                    fixedWeekCount: false,
                    selectable: true,
                    defaultDate: moment().format("YYYY-MM-DD"),
                    navLinks: true, // can click day/week names to navigate views
                    editable: true,
                    eventLimit: true, // allow "more" link when too many events
                    events: [{}],
                    displayEventTime: false,
                    longPressDelay: 500, //Tempo segurando o botao para aparecer o modal
                    defaultView: 'month',
                    monthNames: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    select: function(start, end, resource) {

                        $scope.localTab = "new";
                        if ($rootScope.global.permission.requestConsultant == 1 || $rootScope.global.permission.agenda == 1) {
                            var getCustomerid;
                            var getProjectId;
                            $('#agendaCustomerId').on("select2:select", function(e) {
                                getCustomerid = $('#agendaCustomerId').val();
                            });
                            $scope.appointment.workplace = "1";
                            $scope.appointment.initialHour = new Date('01/01/1990 08:30');
                            $scope.appointment.hourLunch = new Date('01/01/1990 01:00');
                            $scope.appointment.lastHour = new Date('01/01/1990 17:30');
                            $scope.appointment.unproductiveHours = new Date('01/01/1990 00:00');
                            $("#solinitialHour, #solinitialHourParticular, #solhourLunch, #sollastHour, #sollastHourParticular, #solunproductiveHours").addClass("active");
                            $('#tabs').tabs();

                            $('#inicioFerias').pickadate('picker').set('select', moment(start).format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");

                            $('#inicioParticular').pickadate('picker').set('select', moment(start).format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");

                            $('#fimFerias').pickadate('picker').set('select', moment(end).add(-1, 'days').format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");

                            $('#fimParticular').pickadate('picker').set('select', moment(end).add(-1, 'days').format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");

                            $('#fimAgenda').pickadate('picker').set('select', moment(end).add(-1, 'days').format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");

                            $('#inicioAgenda').pickadate('picker').set('select', moment(start).format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");

                            $('#fimAgenda').pickadate('picker').set('select', moment(end).add(-1, 'days').format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            });

                            $('#initAgendaRequest').pickadate('picker').set('select', moment(start).format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");

                            $('#endAgendaRequest').pickadate('picker').set('select', moment(end).add(-1, 'days').format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");

                            $('#dateHoliday').pickadate('picker').set('select', moment(end).add(-1, 'days').format("DD/MM/YYYY"), {
                                format: 'dd/mm/yyyy'
                            }).trigger("change");
                            $('#diaSelecionado').modal('open');
                        }
                    },
                    eventRender: function( event, element, view ) {
                        var title = element.find('.fc-title');          
                        title.attr("title", title.text());
                    },
                    eventClick: function(calEvent, jsEvent, view) {
                        
                        if (calEvent.type == "apontamentoNaoEfetuado" || calEvent.type == "apontamentoEfetuado") {
                            
                            $scope.newAppointment.idAppointment = calEvent.id;
                            $scope.newAppointment.appointmentDate = moment(calEvent.start._i).format('dd/mm/YYYY');
                            
                           
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando...', 30000, 'toast-container');
                            $('#modalApontar').modal('open');

                        } else if (calEvent.type == "feriado") {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando...', 30000, 'toast-container');
                            $scope.viewFeriado(calEvent.id);
                        } else if (calEvent.type == "solicitacao") {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando...', 30000, 'toast-container');
                            if ($rootScope.global.permission.agenda == 1) {
                                $scope.request.idCalendarRequest = calEvent.id;
                                $('#modalAcceptSolicitação').modal('open');
                                $scope.localTab = "solicitacao";
                            }else{
                                $scope.viewRequest(calEvent.id);
                            }
                        } else if (calEvent.type == "SolicitacaoAtraso" && $rootScope.global.permission.agenda == 1) {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando...', 30000, 'toast-container');
                            $scope.atraso.idappointment = calEvent.id;
                            $('#modalAceitarAtraso').modal('open');
                        } else if (calEvent.type == "particular") {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando...', 30000, 'toast-container');
                            $scope.viewParticular(calEvent.id);
                        } else if (calEvent.type == "ferias") {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando...', 30000, 'toast-container');
                            $scope.viewFerias(calEvent.id);
                        } else if (calEvent.type == "aniversario") {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando...', 30000, 'toast-container');
                            $scope.viewAniversario(calEvent.user);
                        }
                    },
                    eventDragStart: function(calEvent, jsEvent, ui, view) {
                        $("#trash").animate({
                            bottom: "10px"
                        }, 200);
                    },
                    eventDragStop: function(event, jsEvent, ui, view) {
                        $("#trash").animate({
                            bottom: "-56px"
                        }, 200);

                        if (isEventOverDiv(jsEvent.clientX, jsEvent.clientY)) {
                            //method remove appointments/requests/holidat
                            if (event.type == "apontamentoNaoEfetuado") {
                                appointmentAPIService.delete(event.id).then(function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('A agenda foi removida', 1500, 'toast-container');
                                    $('#calendar').fullCalendar('removeEvents', event._id);
                                }, function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 10 - contate o administrador', 5500, 'toast-container')

                                });
                            } else
                            if (event.type == "feriado") {
                                holidayAPIService.delete(event.id).then(function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('O feriado foi removido', 1500, 'toast-container');
                                    $('#calendar').fullCalendar('removeEvents', event._id);
                                }, function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 11 - contate o administrador', 5500, 'toast-container')

                                });
                            } else
                            if (event.type == "ferias") {
                                appointmentAPIService.delete(event.id).then(function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('O dia de férias foi removido', 1500, 'toast-container');
                                    $('#calendar').fullCalendar('removeEvents', event._id);
                                }, function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 12 - contate o administrador', 5500, 'toast-container')

                                });
                            } else
                            if (event.type == "particular") {
                                appointmentAPIService.delete(event.id).then(function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('O dia particular foi removido', 1500, 'toast-container');
                                    $('#calendar').fullCalendar('removeEvents', event._id);
                                }, function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 13 - contate o administrador', 5500, 'toast-container')

                                });
                            } else
                            if (event.type == "apontamentoEfetuado") {
                                appointmentAPIService.delete(event.id).then(function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('O apontamento foi removido', 1500, 'toast-container');
                                    $('#calendar').fullCalendar('removeEvents', event._id);
                                }, function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 14 - contate o administrador', 5500, 'toast-container')

                                });
                            } else
                            if (event.type == "solicitacao") {
                                calendarRequestAPIService.delete(event.id).then(function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('A solicitação foi removida', 1500, 'toast-container');
                                    $('#calendar').fullCalendar('removeEvents', event._id);
                                }, function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 15 - contate o administrador', 5500, 'toast-container')

                                });
                            }

                            var removeThisItem = $scope.listEvents.filter(
                                function(val) {
                                    return val.type == event.type && val.id == event.id;
                                }
                            );

                            $scope.listEvents.splice($scope.listEvents.indexOf(removeThisItem[0]), 1);
                        }
                    }
                });

                var $title 	= $('.brand-logo');
                $title.text($calendar.fullCalendar('getDate').format(($calendar.fullCalendar('getDate').format('YYYY') == new Date().getFullYear()) ? 'MMMM' : 'MMM YYYY'));

                $scope.prev = function(){    
                   $('#calendar').fullCalendar('prev');
                   $title.text($calendar.fullCalendar('getDate').format(($calendar.fullCalendar('getDate').format('YYYY') == new Date().getFullYear()) ? 'MMMM' : 'MMM YYYY'));
                }

                $scope.next = function(){    
                    $('#calendar').fullCalendar('next');
                    $title.text($calendar.fullCalendar('getDate').format(($calendar.fullCalendar('getDate').format('YYYY') == new Date().getFullYear()) ? 'MMMM' : 'MMM YYYY'));
                 }

                 $scope.today = function(){    
                    $('#calendar').fullCalendar('today');
                    $title.text($calendar.fullCalendar('getDate').format(($calendar.fullCalendar('getDate').format('YYYY') == new Date().getFullYear()) ? 'MMMM' : 'MMM YYYY'));
                 }

                 

                $("#my-prev-button, #my-next-button").click(function() {
                    var current = $('#calendar').fullCalendar('getDate');
                    var month = moment(current.format()).format("MM");
                    var year = moment(current.format()).format("YYYY");
                    var dataAtual = moment().format("YYYY/MM/DD");


                    if ($scope.findDates.indexOf(month + "/" + year) < 0) {
                        $scope.findDates.push(month + "/" + year);
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Carregando informações!', 30000, 'toast-container');
                        appointmentAPIService.getmonthappointment(month, year)
                            .then(
                                function(response) {
                                    var color = "";
                                    var textColor = "";
                                    var type = "";
                                    var events = [];
                                    $.each(response.data, function(key, objAppoint) {
                                        switch (parseInt(objAppoint.appointmentStatusId.idAppointmentStatus)) {
                                            case 1:
                                                title = objAppoint.customerId.name + " - " + objAppoint.userId.name;
                                                color = "#00b8d4";
                                                textColor = "#FFFFFF";
                                                borderColor = '#00b8d4'
                                                type = 'apontamentoEfetuado';
                                                break;
                                            case 2:
                                                title = objAppoint.customerId.name + " - " + objAppoint.userId.name;
                                                color = "#FFFFFF";
                                                textColor = "#000000";
                                                if (dataAtual > moment(objAppoint.initialDate).format("YYYY/MM/DD")) {
                                                    borderColor = "#FF0000";
                                                } else {
                                                    borderColor = "#757575";
                                                }
                                                type = 'apontamentoNaoEfetuado';
                                                break;
                                            case 3:
                                                title = objAppoint.userId.name + " - " + objAppoint.projectId.name;
                                                color = "#00FF5B";
                                                textColor = "#000000";
                                                borderColor = "#00FF5B";
                                                type = 'ferias';
                                                break;
                                            case 4:
                                                title = objAppoint.userId.name + " - " + objAppoint.projectId.name;
                                                color = "#eda65e";
                                                textColor = "#FFFFFF";
                                                borderColor = "#eda65e";
                                                type = 'particular';
                                                break;
                                            case 5:
                                                title = objAppoint.customerId.name + " - " + objAppoint.userId.name;
                                                color = "#cddc39";
                                                textColor = "#FFFFFF";
                                                borderColor = "#cddc39";
                                                type = 'SolicitacaoAtraso';
                                                break;
                                        }
                                        if ($rootScope.global.permission.agenda == 1) {
                                            var editavel = true;
                                        } else {
                                            var editavel = false;
                                        }
                                        var eventData = {
                                            id: objAppoint.idAppointment,
                                            title: title,
                                            start: objAppoint.initialDate,
                                            end: objAppoint.lastDate,
                                            color: color,
                                            textColor: textColor,
                                            borderColor: borderColor,
                                            type: type,
                                            user: objAppoint.userId.idUser,
                                            customer: objAppoint.customerId.idCustomer,
                                            project: objAppoint.projectId.idProject,
                                            startEditable: editavel

                                        };

                                        $scope.listEvents.push(eventData);

                                    });
                                    $scope.filterData();
                                    $(".toast").fadeOut("slow");
                                },
                                function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 16 - contate o administrador', 5500, 'toast-container')

                                }
                            );
                    }

                    if ($scope.freeUsersMonth.indexOf(month + "/" + year) < 0 && $("#livres").is(":checked")) {

                        if ($scope.freeUsersMonth.indexOf(month + "/" + year) < 0) {
                            $scope.freeUsersMonth.push(month + "/" + year);
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Carregando informações!', 30000, 'toast-container');
                            appointmentAPIService.getmonthappointment(month, year).then(
                                function(response) {
                                    $.each($scope.user, function(key, obj) {
                                        if (obj.profileId.appointment == 1) {
                                            var lista = response.data.filter(
                                                function(val) {
                                                    return (val.userId.idUser == obj.idUser);
                                                }
                                            );
                                            var lastdayOfMonth = new Date(year, month, 0);
                                            if (lista.length > 0) {
                                                for (i = 1; i <= lastdayOfMonth.getDate(); i++) {
                                                    var day = i <= 9 ? "0" + i.toString() : i;

                                                    if (lista.findIndex(function(element, index, array) {
                                                            var dataElement = moment(element.initialDate, "YYYY-MM-DD").format("DD/MM/YYYY");

                                                            var dataI = moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("DD/MM/YYYY");
                                                            if (dataElement == dataI) {
                                                                return true;
                                                            }
                                                        }) < 0) {

                                                        var eventData = {
                                                            id: obj.idUser + year + month + day,
                                                            title: obj.name + " - Livre",
                                                            start: moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("YYYY-MM-DD"),
                                                            end: moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("YYYY-MM-DD"),
                                                            color: "#FFFFFF",
                                                            textColor: "#000000",
                                                            borderColor: "#000000",
                                                            type: "Livre",
                                                            user: obj.idUser,
                                                            customer: "0",
                                                            project: "0",
                                                            startEditable: false
                                                        };
                                                        $scope.freeUsers.push(eventData);
                                                    }
                                                }
                                            } else {
                                                for (i = 1; i <= lastdayOfMonth.getDate(); i++) {
                                                    var day = i <= 9 ? "0" + i.toString() : i;
                                                    var eventData = {
                                                        id: obj.idUser + year + month + i,
                                                        title: obj.name + " - Livre",
                                                        start: moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("YYYY-MM-DD"),
                                                        end: moment(year.toString() + "-" + month.toString() + "-" + day.toString(), "YYYY-MM-DD").format("YYYY-MM-DD"),
                                                        color: "#FFFFFF",
                                                        textColor: "#000000",
                                                        borderColor: "#000000",
                                                        type: "Livre",
                                                        user: obj.idUser,
                                                        customer: "0",
                                                        project: "0",
                                                        startEditable: false
                                                    };
                                                    $scope.freeUsers.push(eventData);
                                                }
                                            }
                                        }
                                    });

                                    $scope.filterData();
                                },
                                function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 17 - contate o administrador', 5500, 'toast-container')

                                }
                            );
                        }
                    }

                    if ($scope.listBirth.indexOf(year) < 0) {
                        $scope.listBirth.push(year);
                        $.each($scope.user, function(key, obj) {
                            var eventData = {
                                title: "Aniversário - " + obj.name,
                                start: year + "-" + moment(obj.birthDay, "YYYY-MM-DD").format("MM-DD"),
                                end: year + "-" + moment(obj.birthDay, "YYYY-MM-DD").format("MM-DD"),
                                color: "#990099",
                                textColor: "#FFFFFF",
                                borderColor: "#990099",
                                type: "aniversario",
                                user: obj.idUser,
                                customer: "0",
                                project: "0",
                                startEditable: false
                            };

                            $scope.listEvents.push(eventData);
                        });
                        $scope.filterData();
                        
                    }
                });

                //getUsers
                usersAPIService.getall()
                    .then(function(response) {
                        var year = moment().format("YYYY");
                        $scope.listBirth.push(year);
                        $scope.user = response.data;
                        $.each($scope.user, function(key, obj) {
                            var eventData = {
                                title: "Aniversário - " + obj.name,
                                start: year + "-" + moment(obj.birthDay, "YYYY-MM-DD").format("MM-DD"),
                                end: year + "-" + moment(obj.birthDay, "YYYY-MM-DD").format("MM-DD"),
                                color: "#990099",
                                textColor: "#FFFFFF",
                                borderColor: "#990099",
                                type: "aniversario",
                                user: obj.idUser,
                                customer: "0",
                                project: "0",
                                startEditable: false
                            };

                            $scope.listEvents.push(eventData);
                        });
                        $scope.filterData();
                    }, function() {
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 18 - contate o administrador', 5500, 'toast-container')

                    });

                // //getProject
                // $scope.getProjects = function(id) {
                //     if (id != undefined) {
                //         projectsAPIService.getbyCustomer(id).then(function(response) {
                //             $scope.project = response.data;
                //         }, function() {
                //             $(".toast").fadeOut("slow");
                //             Materialize.toast('Erro 19 - contate o administrador', 5500, 'toast-container')

                //         });
                //     } else {
                //         $scope.project = [];
                //     }
                // }

                //getProject
                $scope.getProjects = function(id) {
                    if (id != undefined) {
                        projectsAPIService.getbyCustomer(id).then(function(response) {
                            $scope.project = response.data;
                        }, function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 19 - contate o administrador', 5500, 'toast-container')

                        });
                    } else {
                        $scope.project = [];
                    }
                }

                projectsAPIService.getall().then(function(response) {
                    $scope.allProjects = response.data;
                }, function() {
                    $(".toast").fadeOut("slow");
                    Materialize.toast('Erro 1900 - contate o administrador', 5500, 'toast-container')
                });


                //getCustomer
                customersAPIService.getall().then(function(response) {
                    $scope.customer = response.data;
                }, function() {
                    $(".toast").fadeOut("slow");
                    Materialize.toast('Erro 20 - contate o administrador', 5500, 'toast-container')

                });

                //insert agenda
                $scope.insertAgenda = function() {
                    $(".toast").fadeOut("slow");
                    Materialize.toast('Inserindo itens', 5000, 'toast-container');
                    var dia = moment($("#inicioAgenda").val().trim(), "DD/MM/YYYY");
                    var dataFinal = moment($("#fimAgenda").val().trim(), "DD/MM/YYYY");
                    var weekDay = "";
                    var arrayAppointments = [];
                    var itens = [];

                    while (dia <= dataFinal) {
                        save = false;
                        weekDay = dia.format("e");
                        switch (weekDay) {
                            case "0":
                                if ($("#agendaDomingo").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "1":
                                if ($("#agendaSegunda").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "2":
                                if ($("#agendaTerca").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "3":
                                if ($("#agendaQuarta").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "4":
                                if ($("#agendaQuinta").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "5":
                                if ($("#agendaSexta").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "6":
                                if ($("#agendaSabado").is(":checked")) {
                                    save = true;
                                }
                                break;
                        }

                        $scope.user.forEach(function(v) {
                            if (v.idUser == $scope.appointment.userId) {
                                $scope.appointment.name = v.name;
                            }
                        });

                        $scope.project.forEach(function(v) {
                            if (v.idProject == $scope.appointment.projectId) {
                                $scope.appointment.name = v.name;
                            }
                        });

                        $scope.customer.forEach(function(v) {
                            if (v.idCustomer == $scope.appointment.customerId) {
                                $scope.appointment.nameCustomer = v.name;
                            }
                        });

                        if (save == true) {
                            if ($rootScope.global.permission.agenda == 1) {
                                var editavel = true;
                            } else {
                                var editavel = false;
                            }
                            eventData = {
                                id: "",
                                title: $scope.appointment.nameCustomer + ' - ' + $scope.appointment.name,
                                start: dia,
                                end: dia,
                                color: "#FFFFFF",
                                textColor: "#000000",
                                borderColor: "#000000",
                                type: 'apontamentoNaoEfetuado',
                                startEditable: editavel
                            };

                            itens.push(angular.copy(eventData));

                            if (!$scope.appointment.transfer || $scope.appointment.workplace == 1) {
                                $scope.appointment.transfer = 0;
                            }
                            $scope.appointment.initialDate = moment(dia).format('YYYY-MM-DD');
                            $scope.appointment.executed = "";
                            $scope.appointment.appointmentStatusId = 2;

                            var clone = angular.copy($scope.appointment);

                            arrayAppointments.push(clone);
                        }
                        dia = dia.add(1, "days");
                    };

                    appointmentAPIService.saveAgenda(arrayAppointments).then(
                        function(response) {
                            $.each(response.data, function(key, obj) {

                                itens[key].id = obj.idAppointment;
                                itens[key].user = obj.userId.idUser;
                                itens[key].customer = obj.customerId.idCustomer;
                                itens[key].project = obj.projectId.Idproject;
                                $scope.listEvents.push(itens[key]);

                                var positionItem = $scope.freeUsers.findIndex(function(element, index, array) {
                                    if (element.id == obj.userId.idUser + moment(itens[key].start).format("YYYYMMDD")) {

                                        return true;
                                    }
                                })
                                if (positionItem != -1) {
                                    $scope.freeUsers.splice(positionItem, 1);
                                }
                            });
                            $scope.filterData();
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Agenda inserida de ' + moment(itens[0].start._d).format("DD/MM/YYYY") + " até " + moment(itens[itens.length - 1].start._d).format("DD/MM/YYYY"), 5000, 'toast-container');
                        },
                        function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 21 - contate o administrador', 5500, 'toast-container')

                        }
                    );
                    $('.modal').modal('close');
                };

                // insertar ferias
                $scope.vacation = function() {
                    var dia = moment($("#inicioFerias").val().trim(), "DD/MM/YYYY");
                    var dataFinal = moment($("#fimFerias").val().trim(), "DD/MM/YYYY");
                    var weekDay = "";
                    var arrayItens = [];
                    var list = [];
                    var itens = [];

                    while (dia <= dataFinal) {
                        save = false;
                        weekDay = dia.format("e");
                        switch (weekDay) {
                            case "0":
                                if ($("#agendaDomingoFerias").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "1":
                                if ($("#agendaSegundaFerias").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "2":
                                if ($("#agendaTercaFerias").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "3":
                                if ($("#agendaQuartaFerias").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "4":
                                if ($("#agendaQuintaFerias").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "5":
                                if ($("#agendaSextaFerias").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "6":
                                if ($("#agendaSabadoFerias").is(":checked")) {
                                    save = true;
                                }
                                break;
                        };

                        $scope.user.forEach(function(v) {
                            if (v.idUser == $scope.appointment.userId) {
                                $scope.appointment.name = v.name;
                            }
                        });

                        $scope.project.forEach(function(v) {
                            if (v.idProject == $scope.appointment.projectId) {
                                $scope.appointment.name = v.name;
                            }
                        });

                        if (save == true) {

                            if ($rootScope.global.permission.agenda == 1) {
                                var editavel = true;
                            } else {
                                var editavel = false;
                            }

                            eventData = {
                                id: "",
                                title: 'Férias - ' + $scope.appointment.name,
                                start: dia,
                                end: dia,
                                color: "#00FF5B",
                                textColor: "#000000",
                                borderColor: "#00FF5B",
                                type: 'ferias',
                                startEditable: editavel
                            };
                            $scope.appointment.projectId = 1;
                            $scope.appointment.customerId = 1;
                            $scope.appointment.transfer = 0;
                            $scope.appointment.initialHour = "00:00:00";
                            $scope.appointment.hourLunch = "00:00:00";
                            $scope.appointment.lastHour = "00:00:00";
                            $scope.appointment.unproductiveHours = "00:00:00";
                            $scope.appointment.activity = "Férias";
                            $scope.appointment.executed = "Férias";
                            $scope.appointment.appointmentStatusId = 3;
                            $scope.appointment.initialDate = moment(dia).format('YYYY-MM-DD');

                            var clone = angular.copy($scope.appointment);
                            arrayItens.push(clone);
                            itens.push(angular.copy(eventData))
                        }
                        dia = dia.add(1, "days");
                    };
                  
                    appointmentAPIService.saveAgenda(arrayItens)
                        .then(
                            function(response) {
                                $.each(response.data, function(key, obj) {
                                    itens[key].id = obj.idAppointment;
                                    itens[key].user = obj.userId.idUser;
                                    itens[key].customer = obj.customerId.idCustomer;
                                    itens[key].project = obj.projectId.Idproject;
                                    $scope.listEvents.push(itens[key]);
                                });
                                $scope.filterData();
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Agenda inserida de ' + moment(itens[0].start._d).format("DD/MM/YYYY") + " até " + moment(itens[itens.length - 1].start._d).format("DD/MM/YYYY"), 5000, 'toast-container');
                                $('.modal').modal('close');
                            },
                            function() {
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Erro 22 - contate o administrador', 5500, 'toast-container')

                            }
                        );
                };

                // insertar particular
                $scope.insertParticular = function() {
                    var dia = moment($("#inicioParticular").val().trim(), "DD/MM/YYYY");
                    var dataFinal = moment($("#fimParticular").val().trim(), "DD/MM/YYYY");
                    var weekDay = "";
                    var arrayItens = [];
                    var list = [];
                    var itens = [];

                    while (dia <= dataFinal) {
                        save = false;
                        weekDay = dia.format("e");
                        switch (weekDay) {
                            case "0":
                                if ($("#agendaDomingoParticular").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "1":
                                if ($("#agendaSegundaParticular").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "2":
                                if ($("#agendaTercaParticular").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "3":
                                if ($("#agendaQuartaParticular").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "4":
                                if ($("#agendaQuintaParticular").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "5":
                                if ($("#agendaSextaParticular").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "6":
                                if ($("#agendaSabadoParticular").is(":checked")) {
                                    save = true;
                                }
                                break;
                        };

                        $scope.user.forEach(function(v) {
                            if (v.idUser == $scope.appointment.userId) {
                                $scope.appointment.name = v.name;
                            }
                        });

                        if (save == true) {
                            if ($rootScope.global.permission.agenda == 1) {
                                var editavel = true;
                            } else {
                                var editavel = false;
                            }
                            eventData = {
                                id: "",
                                title: $scope.appointment.name + " - " + 'Particular',
                                start: dia,
                                end: dia,
                                color: "#eda65e",
                                textColor: "#FFFFFF",
                                borderColor: "#eda65e",
                                type: 'particular',
                                startEditable: editavel
                            };
                            $scope.appointment.projectId = 2;
                            $scope.appointment.customerId = 1;
                            $scope.appointment.transfer = 0;
                            $scope.appointment.hourLunch = "00:00:00";
                            $scope.appointment.unproductiveHours = "00:00:00";
                            $scope.appointment.executed = "Particular";
                            $scope.appointment.appointmentStatusId = 4;
                            $scope.appointment.initialDate = moment(dia).format('YYYY-MM-DD');

                            var clone = angular.copy($scope.appointment);
                            arrayItens.push(clone);
                            itens.push(angular.copy(eventData))
                        }
                        dia = dia.add(1, "days");
                    };
                    appointmentAPIService.saveAgenda(arrayItens)
                        .then(
                            function(response) {
                                $.each(response.data, function(key, obj) {
                                    itens[key].id = obj.idAppointment;
                                    itens[key].user = obj.userId.idUser;
                                    itens[key].customer = obj.customerId.idCustomer;
                                    itens[key].project = obj.projectId.Idproject;
                                    $scope.listEvents.push(itens[key]);
                                });
                                $scope.filterData();
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Agenda inserida de ' + moment(itens[0].start._d).format("DD/MM/YYYY") + " até " + moment(itens[itens.length - 1].start._d).format("DD/MM/YYYY"), 5000, 'toast-container');
                                $('.modal').modal('close');
                            },
                            function() {
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Erro 23 - contate o administrador', 5500, 'toast-container')

                            }
                        );
                };

                $scope.insertHoliday = function() {
                    //add feriado
                    $scope.holiday.date = moment($("#dateHoliday").val().trim(), "DD/MM/YYYY").format('YYYY-MM-DD');

                    holidayAPIService.save($scope.holiday).then(
                        function(response) {

                            if ($rootScope.global.permission.agenda == 1) {
                                var editavel = true;
                            } else {
                                var editavel = false;
                            }

                            var eventData = {
                                id: response.data,
                                title: $scope.holiday.name,
                                start: $scope.holiday.date,
                                end: $scope.holiday.date,
                                color: "#B1FFFF",
                                textColor: "#000000",
                                borderColor: "#B1FFFF",
                                type: 'feriado',
                                user: "0",
                                customer: "0",
                                project: "0",
                                startEditable: editavel
                            };
                            $scope.listEvents.push(eventData);
                            $scope.filterData();
                        },
                        function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 24 - contate o administrador', 5500, 'toast-container')

                        }
                    )
                    $('.modal').modal('close');
                };

                //getallFeriados
                holidayAPIService.getall()
                    .then(
                        function(response) {
                            var list = [];
                            if ($rootScope.global.permission.agenda == 1) {
                                var editavel = true;
                            } else {
                                var editavel = false;
                            }
                            $.each(response.data, function(key, object) {
                                var eventData = {
                                    id: object.idHoliday,
                                    title: object.name,
                                    start: object.date,
                                    end: object.date,
                                    color: '#B1FFFF',
                                    textColor: '#000000',
                                    borderColor: '#B1FFFF',
                                    type: 'feriado',
                                    user: "0",
                                    customer: "0",
                                    project: "0",
                                    startEditable: editavel
                                };
                                $scope.listEvents.push(eventData);
                                list.push(eventData);
                            });
                            $scope.filterData();
                        },
                        function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 25 - contate o administrador', 5500, 'toast-container')

                        }
                    );

                closingDateAPIService.getall().then(function(response) {
                    $scope.closingDate = moment().date(response.data[0].date).format("YYYY-MM-DD")
                }, function() {
                    $(".toast").fadeOut("slow");
                    Materialize.toast('Erro 26 - contate o administrador', 5500, 'toast-container')

                });

                // // getAllNew Agendas
                // appointmentAPIService.getallAppointment().then(
                //     function(response) {
                //         var color = "";
                //         var textColor = "";
                //         var type = "";
                //         var dataAtual = moment().format("YYYY/MM/DD");
                //         var list = [];

                //         $.each(response.data, function(key, obj) {
                //             switch (parseInt(obj.appointmentStatusId.idAppointmentStatus)) {
                //                 case 1:
                //                     title = obj.customerId.name + " - " + obj.userId.name,
                //                         color = "#00b8d4";
                //                     textColor = "#FFFFFF";
                //                     borderColor = '#00b8d4'
                //                     type = 'apontamentoEfetuado';
                //                     break;
                //                 case 2:
                //                     title = obj.customerId.name + " - " + obj.userId.name,
                //                         color = "#FFFFFF";
                //                     textColor = "#000000";
                //                     if (dataAtual > moment(obj.initialDate).format("YYYY/MM/DD")) {
                //                         borderColor = "#FF0000";
                //                     } else {
                //                         borderColor = "#757575";
                //                     }
                //                     type = 'apontamentoNaoEfetuado';
                //                     break;
                //                 case 3:
                //                     title = obj.userId.name + " - " + obj.projectId.name;
                //                     color = "#00FF5B";
                //                     textColor = "#000000";
                //                     borderColor = "#00FF5B";
                //                     type = 'ferias';
                //                     break;
                //                 case 4:
                //                     title = obj.userId.name + " - " + obj.projectId.name;
                //                     color = "#eda65e";
                //                     textColor = "#FFFFFF";
                //                     borderColor = "#eda65e";
                //                     type = 'particular';
                //                     break;
                //                 case 5:
                //                     title = obj.customerId.name + " - " + obj.userId.name;
                //                     color = "#cddc39";
                //                     textColor = "#FFFFFF";
                //                     borderColor = "#cddc39";
                //                     type = 'SolicitacaoAtraso';
                //                     break;
                //             }

                //             if ($rootScope.global.permission.agenda == 1) {
                //                 var editavel = true;
                //             } else {
                //                 var editavel = false;
                //             }

                //             var eventData = {
                //                 id: obj.idAppointment,
                //                 title: title,
                //                 start: obj.initialDate,
                //                 end: obj.lastDate,
                //                 color: color,
                //                 textColor: textColor,
                //                 borderColor: borderColor,
                //                 type: type,
                //                 user: obj.userId.idUser,
                //                 customer: obj.customerId.idCustomer,
                //                 project: obj.projectId.idProject,
                //                 startEditable: editavel
                //                 //className : "cursorPointer"
                //             };
                //             $scope.listEvents.push(eventData);
                //             list.push(eventData);

                //         });
                //         $scope.filterData();
                //         $(".toast").fadeOut("slow");
                //         Materialize.toast('Dados carregados com sucesso. :)', 3000, 'toast-container')
                //     },
                //     function() {
                //         $(".toast").fadeOut("slow");
                //         Materialize.toast('Erro 27 - contate o administrador', 5500, 'toast-container')

                //     }
                // );

                // getAllNew Agendas
                appointmentAPIService.getallAgenda().then(
                    function (response) {
                        var color = "";
                        var textColor = "";
                        var type = "";
                        var dataAtual = moment().format("YYYY/MM/DD");
                        var list = [];

                        $.each(response.data, function (key, obj) {
                            switch (parseInt(obj.idAppointmentStatus)) {
                                case 1:
                                    title = obj.customerName + " - " + obj.userName,
                                        color = "#00b8d4";
                                    textColor = "#FFFFFF";
                                    borderColor = '#00b8d4'
                                    type = 'apontamentoEfetuado';
                                    break;
                                case 2:
                                    title = obj.customerName + " - " + obj.userName,
                                        color = "#FFFFFF";
                                    textColor = "#000000";
                                    if (dataAtual > moment(obj.initialDate).format("YYYY/MM/DD")) {
                                        borderColor = "#FF0000";
                                    } else {
                                        borderColor = "#757575";
                                    }
                                    type = 'apontamentoNaoEfetuado';
                                    break;
                                case 3:
                                    title = obj.userName + " - " + obj.projectName;
                                    color = "#00FF5B";
                                    textColor = "#000000";
                                    borderColor = "#00FF5B";
                                    type = 'ferias';
                                    break;
                                case 4:
                                    title = obj.userName + " - " + obj.projectName;
                                    color = "#eda65e";
                                    textColor = "#FFFFFF";
                                    borderColor = "#eda65e";
                                    type = 'particular';
                                    break;
                                case 5:
                                    title = obj.customerName + " - " + obj.userName;
                                    color = "#cddc39";
                                    textColor = "#FFFFFF";
                                    borderColor = "#cddc39";
                                    type = 'SolicitacaoAtraso';
                                    break;
                            }

                            if ($rootScope.global.permission.agenda == 1) {
                                var editavel = true;
                            } else {
                                var editavel = false;
                            }

                            var eventData = {
                                id: obj.idAppointment,
                                title: title,
                                start: obj.initialDate,
                                end: obj.initialDate,
                                color: color,
                                textColor: textColor,
                                borderColor: borderColor,
                                type: type,
                                user: obj.idUser,
                                customer: obj.idCustomer,
                                project: obj.idProject,
                                startEditable: editavel
                                //className : "cursorPointer"
                            };
                            $scope.listEvents.push(eventData);
                            list.push(eventData);

                        });
                        $scope.filterData();
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Dados carregados com sucesso. :)', 3000, 'toast-container')
                    },
                    function () {
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 27 - contate o administrador', 5500, 'toast-container')

                    }
                );

                //preenche o apontamento
                $scope.insertAppointment = function() {

                    if ($scope.newAppointment.workplace == 1) {
                        $scope.newAppointment.expense = [];
                    } else {
                        $.each($scope.newAppointment.expense, function(key, obj) {
                            obj.cost = obj.cost.replaceAll(".", "").replaceAll(",", ".");
                        })
                    }

                    appointmentAPIService.insertAppointment($scope.newAppointment).then(
                        function() {

                            var initialHR = $scope.newAppointment.initialHour + ':00';
                            var lunchHR = $scope.newAppointment.hourLunch + ':00';
                            var finalHR = $scope.newAppointment.lastHour + ':00';
                            var totalHoras = diffHoras(initialHR, finalHR, lunchHR);
                            var itensApontamento = $scope.newAppointment;

                            var event = $("#calendar").fullCalendar('clientEvents', [$scope.newAppointment.idAppointment]);

                            if (moment($scope.closingDate, "YYYY-MM-DD") > moment($scope.newAppointment.appointmentDate, "DD/MM/YYYY")) {
                                event[0].textColor = "#FFFFFF";
                                event[0].borderColor = "#cddc39";
                                event[0].color = "#cddc39";
                                event[0].type = "SolicitacaoAtraso";
                                var mensagem = "Solicitação de apontamento salva com sucesso!"
                            } else {

                                var relatorio =
                                    '<style>\
                                    td { border: 1px solid black; border-bottom: none font-family: Arial, Helvetica, sans-serif;}\
                                    table { border: 0.5px solid black; border-bottom: none font-family: Arial, Helvetica, sans-serif;}\
                                    table { border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; }\
                                    section{ page-break-after: always; font-family: Arial, Helvetica, sans-serif; }\
                                </style>\
                                <section>\
                                    <table  width="700">\
                                        <tr>\
                                            <td width="100%" valign="middle" align="center" style="font-size:20px"><strong>ORDEM DE SERVIÇO</strong></td>\
                                            <<!-- <td width="400" height="50" valign="middle">\
                                                <div><img src="http://iv2.com.br/assets/img/logo.png" width="50px" heigth="50px"></div>\
                                            </td> -->\
                                        </tr>\
                                    </table>\
                                    <table width="700" >\
                                        <tr>\
                                            <td width="500px" height="50px" valign="top"><span style="font-size:14px">Cliente</span><br><br><b>' + itensApontamento.appointmentCustomer + '</b></td>\
                                            <td width="80px" height="50px" valign="top"><span style="font-size:14px">Data</span><br><br><p style="font-size: 14px; margin-left: 25px; margin-top: 0px;">' + moment($scope.newAppointment.initialDate, "DD/MM/YYYY").format('DD/MM/YYYY') + '</p></td>\
                                        </tr>\
                                        <tr>\
                                            <td  height="50" valign="top"><span style="font-size:12px">Projeto</span><br><br>' + itensApontamento.appointmentProject + '</td>\
                                        </tr>\
                                    </table>\
                                    <table width="700">\
                                        <tr>\
                                            <td  height="50" valign="top"><span style="font-size:12px">Recurso</span><br><br>' + $scope.newAppointment.user.name + '</td>\
                                        </tr>\
                                    </table>\
                                    <table width="700">\
                                        <tr>\
                                            <td width="570" height="50" valign="top"><span style="font-size:12px">Atividade</span><br><br>' + itensApontamento.activity + '</td>\
                                        </tr>\
                                    </table>\
                                    <table width="700">\
                                        <tr>\
                                            <td width="140" valign="top"><span style="font-size:12px">Entrada</span><br><br>' + initialHR + '</td>\
                                            <td width="140" valign="top"><span style="font-size:12px">Intervalo</span><br><br>' + lunchHR + '</td>\
                                            <td width="140" valign="top"><span style="font-size:12px">Saída</span><br><br>' + finalHR + '</td>\
                                            <td width="140" valign="top"><span style="font-size:12px">Improdutividade</span><br><br>' + itensApontamento.unproductiveHours + ':00' + '</td>\
                                            <td width="138" valign="top"><span style="font-size:12px">Total</span><br><br>' + totalHoras + '</td>\
                                        </tr>\
                                    </table>\
                                    <table width="700">\
                                        <tr>\
                                            <td width="100%" height="50" valign="top"><span style="font-size:12px">Executado </span><br><br><p style="font-size: 12px;"><b>' + itensApontamento.executed + '</b></p>\
                                            </td>\
                                        </tr>\
                                    </table>\
                                    <table width="700"  style="border: 1px solid black;">\
                                        <tr>\
                                            <td width="160" height="50" valign="top">\
                                                <span style="font-size:12px">\
                                                    <span style="font-size:13px;">Assinatura</span> \
                                                    <br>\
                                                    <br>\
                                                    <br>\
                                                    <br>\
                                                    <div> \
                                                        <span>Cliente ______________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Recurso ______________________________ </span>\
                                                    </div>\
                                                    <br>\
                                                    <br>\
                                                </span>\
                                                <div style="margin-top: 5px;"></div>\
                                            </td>\
                                        </tr>\
                                        <tr>\
                                            <td width="160" height="50" valign="top">\
                                                <span style="font-size:11px">\
                                                    <b>\
                                                        <p>Este documento tem a finalidade de:</p>\
                                                        <p>- Acompanhar o desenvolvimento do Cliente;</p>\
                                                        <p>- Relatar os serviços executados;</p>\
                                                        <p>- Veículo de comunicação Cliente/IV2;</p>\
                                                        <p>- Autorização para faturamento dos serviços prestados.</p>\
                                                        <p>Alertamos que caso o cliente não se pronuncie, concordando ou não com o exposto, no prazo de 48 horas da emissão desta, seja via telefone e-mail ou fax, perderá o direito de reclamação.</p>\
                                                    </b>\
                                                </span>\
                                            </td>\
                                        </tr>\
                                    </table>\
                                </section>';

                                var html = Mustache.render(relatorio, null);
                                var emails = [$rootScope.global.email, 'kelvin.musselli@iv2.com.br'];//,'comercial@iv2.com.br','os@iv2.com.br'];
                                var destinatarioNome = 'Grupo IV2';
                                var descricaoOS = 'Prezado(a) Cliente Segue no anexo OS referente ao atendimento realizado. Dúvidas estamos à disposição para maiores esclarecimentos. Grupo IV2 - (11) 2448-5611';
                                var nomeArquivoOS = 'Ordem de serviço';
                                var tituloOS = 'Grupo IV2 - OS ' +  moment($scope.newAppointment.initialDate, "DD/MM/YYYY").format('DD/MM/YYYY') + ' - ' + $scope.newAppointment.user.name;

                                $.ajax({
                                    method: 'POST',
                                    url: 'https://easyboxx.iv2.com.br/EasyBoxx/WS/gerarPDFBase64.php',
                                    data: {
                                        PDF: html,
                                        fileName: "Ordem_de_Servico.pdf"
                                    },
                                    success: function(result64) {


                                        var val = {
                                            nomeArquivo: nomeArquivoOS,
                                            base64: result64,
                                            descricao: descricaoOS,
                                            destinatario: emails,
                                            nomeDestinatario: destinatarioNome,
                                            titulo: tituloOS,
                                            mensagem: 'Prezado(a) Cliente Segue no anexo OS referente ao atendimento realizado. Dúvidas estamos à disposição para maiores esclarecimentos. Grupo IV2 - (11) 2448-5611',
                                            extensao: "pdf"
                                        }

                                        appointmentAPIService.sendMail(val).then(
                                            function(){
                                                console.log("ok");
                                            },
                                            function(){
                                                console.log("erro");
                                            }
                                        );
                                    },
                                    error: function(error) {
                                        $(".toast").fadeOut("slow");
                                        Materialize.toast('Erro 02 - contate o administrador', 5500, 'toast-container')

                                    }
                                });

                                event[0].textColor = "#FFFFFF";
                                event[0].borderColor = "#00b8d4";
                                event[0].color = "#00b8d4";
                                event[0].type = "apontamentoEfetuado";

                                var mensagem = "Apontamento e envio de O.S efetuados com sucesso!"
                            }

                            var removeThisItem = $scope.listEvents.filter(
                                function(val) {
                                    return (val.type == 'apontamentoNaoEfetuado' || val.type == 'apontamentoEfetuado') && val.id == $scope.newAppointment.idAppointment;
                                }
                            );

                            $scope.listEvents.splice($scope.listEvents.indexOf(removeThisItem[0]), 1);
                            $scope.listEvents.push(event[0]);
                            $scope.filterData();

                            $(".toast").fadeOut("slow");
                            Materialize.toast(mensagem, 3000, 'toast-container');
                            $("#modalApontar").modal("close");

                        },
                        function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 01a - Contate o ADM', 5500, 'toast-container');
                            $("#modalApontar").modal("close");
                        }
                    );
                };

                //APROVANDO APONTAMENTO ATRASADO
                $scope.insertAtrasado = function() {
                    $scope.blockAccept = true;
                    $(".toast").fadeOut("slow");
                    Materialize.toast('Aprovando apontamento!', 30000, 'toast-container');
                    if ($scope.atual.workplace == 1 && $scope.solicitado.workplace == 1) {
                        $scope.solicitado.expense = [];
                        $scope.atual.expense = [];

                    } else {
                        $.each($scope.solicitado.expense, function(key, obj) {
                            obj.cost = obj.cost.replaceAll(".", "").replaceAll(",", ".");
                        });
                        $.each($scope.atual.expense, function(key, obj) {
                            obj.cost = obj.cost.replaceAll(".", "").replaceAll(",", ".");
                        });
                    }
                    appointmentAPIService.acceptLate($scope.atraso.idappointment)
                        .then(
                            function() {

                                var removeThisItem = $scope.listEvents.filter(
                                    function(val) {
                                        return (val.type == 'SolicitacaoAtraso') && val.id == $scope.atraso.idappointment;
                                    }
                                );

                                $scope.listEvents.splice($scope.listEvents.indexOf(removeThisItem[0]), 1);

                                var obj = $scope.solicitado;
                                var eventData = {
                                    id: $scope.atraso.idappointment,
                                    title: obj.customerId.name+" - "+obj.userId.name,
                                    start: moment(obj.initialDate, "DD/MM/YYYY").format("YYYY-MM--DD"),
                                    end: moment(obj.initialDate, "DD/MM/YYYY").format("YYYY-MM--DD"),
                                    color: "#00b8d4",
                                    textColor: "#FFFFFF",
                                    borderColor: "#00b8d4",
                                    type: "apontamentoEfetuado",
                                    user: obj.userId.idUser,
                                    customer: obj.customerId.idCustomer,
                                    project: obj.projectId.idProject,
                                };
                                console.log(eventData)
                                $scope.listEvents.push(eventData);
                                $scope.filterData();

                                var initialHR = obj.initialHour;
                                var lunchHR = obj.hourLunch;
                                var finalHR = obj.lastHour;
                                var totalHoras = diffHoras(initialHR, finalHR, lunchHR);
                                var itensApontamento = obj;

                                $(".toast").fadeOut("slow");
                                Materialize.toast('Enviando O.S!', 30000, 'toast-container');

                                var relatorio =
                                    '<style>\
                                    td { border: 1px solid black; border-bottom: none font-family: Arial, Helvetica, sans-serif;}\
                                    table { border: 0.5px solid black; border-bottom: none font-family: Arial, Helvetica, sans-serif;}\
                                    table { border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; }\
                                    section{ page-break-after: always; font-family: Arial, Helvetica, sans-serif; }\
                                </style>\
                                <section>\
                                    <table  width="700">\
                                        <tr>\
                                            <td width="100%" valign="middle" align="center" style="font-size:20px"><strong>ORDEM DE SERVIÇO</strong></td>\
                                            <<!-- <td width="400" height="50" valign="middle">\
                                                <div><img src="http://iv2.com.br/assets/img/logo.png" width="50px" heigth="50px"></div>\
                                            </td> -->\
                                        </tr>\
                                    </table>\
                                    <table width="700" >\
                                        <tr>\
                                            <td width="500px" height="50px" valign="top"><span style="font-size:14px">Cliente</span><br><br><b>' + obj.customerId.name + '</b></td>\
                                            <td width="80px" height="50px" valign="top"><span style="font-size:14px">Data</span><br><br><p style="font-size: 14px; margin-left: 25px; margin-top: 0px;">' + moment(obj.initialDate, "DD/MM/YYYY")
                                    .format('DD/MM/YYYY') + '</p></td>\
                                        </tr>\
                                        <tr>\
                                            <td  height="50" valign="top"><span style="font-size:12px">Projeto</span><br><br>' + obj.projectId.name + '</td>\
                                        </tr>\
                                    </table>\
                                    <table width="700">\
                                        <tr>\
                                            <td  height="50" valign="top"><span style="font-size:12px">Recurso</span><br><br>' + obj.userId.name + '</td>\
                                        </tr>\
                                    </table>\
                                    <table width="700">\
                                        <tr>\
                                            <td width="570" height="50" valign="top"><span style="font-size:12px">Atividade</span><br><br>' + obj.activity + '</td>\
                                        </tr>\
                                    </table>\
                                    <table width="700">\
                                        <tr>\
                                            <td width="140" valign="top"><span style="font-size:12px">Entrada</span><br><br>' + initialHR + '</td>\
                                            <td width="140" valign="top"><span style="font-size:12px">Intervalo</span><br><br>' + lunchHR + '</td>\
                                            <td width="140" valign="top"><span style="font-size:12px">Saída</span><br><br>' + finalHR + '</td>\
                                            <td width="140" valign="top"><span style="font-size:12px">Improdutividade</span><br><br>' + obj.unproductiveHours + ':00' + '</td>\
                                            <td width="138" valign="top"><span style="font-size:12px">Total</span><br><br>' + totalHoras + '</td>\
                                        </tr>\
                                    </table>\
                                    <table width="700">\
                                        <tr>\
                                            <td width="100%" height="50" valign="top"><span style="font-size:12px">Executado:</span><br><br><p style="font-size: 12px;"><b>' + obj.executed + '</b></p>\
                                            </td>\
                                        </tr>\
                                    </table>\
                                    <table width="700"  style="border: 1px solid black;">\
                                        <tr>\
                                            <td width="160" height="50" valign="top"><span style="font-size:12px"><div style="margin-top: 12px;"></div><div style="margin-left: 10px;"><br><br>Cliente: ______________________________</span></div><div style="margin-left: 430px; margin-top: 50px;"><br><br>Recurso: ______________________________</span></div><div style="margin-top: 5px;"></div></td>\
                                        </tr>\
                                        <tr>\
                                            <td width="160" height="50" valign="top">\
                                                <span style="font-size:11px">\
                                                    <b>\
                                                        <p>Este documento tem a finalidade de:</p>\
                                                        <p>- Acompanhar o desenvolvimento do Cliente;</p>\
                                                        <p>- Relatar os serviços executados;</p>\
                                                        <p>- Veículo de comunicação Cliente/IV2;</p>\
                                                        <p>- Autorização para faturamento dos serviços prestados.</p>\
                                                        <p>Alertamos que caso o cliente não se pronuncie, concordando ou não com o exposto, no prazo de 48 horas da emissão desta, seja via telefone e-mail ou fax, perderá o direito de reclamação.</p>\
                                                    </b>\
                                                </span>\
                                            </td>\
                                        </tr>\
                                    </table>\
                                </section>';

                                var html = Mustache.render(relatorio, null);
                                var emails = [$rootScope.global.email];//,'comercial@iv2.com.br','os@iv2.com.br'];
                                var destinatarioNome = 'Grupo IV2';
                                var descricaoOS = 'Anexo referente ao serviço prestado.';
                                var nomeArquivoOS = 'Ordem de serviço';
                                var tituloOS = 'Grupo IV2 - OS ' + moment(obj.initialDate, "DD/MM/YYYY").format('DD/MM/YYYY') + ' - ' + obj.userId.name;

                                $.ajax({
                                    method: 'POST',
                                    url: 'https://easyboxx.iv2.com.br/EasyBoxx/WS/gerarPDFBase64.php',
                                    data: {
                                        PDF: html,
                                        fileName: "Ordem_de_Servico.pdf"
                                    },
                                    success: function(result64) {


                                        var val = {
                                            nomeArquivo: nomeArquivoOS,
                                            base64: result64,
                                            descricao: descricaoOS,
                                            destinatario: emails,
                                            nomeDestinatario: destinatarioNome,
                                            titulo: tituloOS,
                                            mensagem: 'Anexo referente ao serviço prestado.',
                                            extensao: "pdf"
                                        }

                                        appointmentAPIService.sendMail(val).then(function(data) {
                                            $(".toast").fadeOut("slow");
                                            Materialize.toast('Solicitação de apontamento atrasado aceita, OS enviada por e-mail', 3000, 'toast-container');
                                            $("#modalAceitarAtraso").modal("close");
                                            $scope.blockAccept = false;
                                        }, function() {
                                            $(".toast").fadeOut("slow");
                                            Materialize.toast('Erro 28 - contate o administrador', 5500, 'toast-container');
                                            $scope.blockAccept = false;
                                        });
                                    },
                                    error: function(error) {
                                        $(".toast").fadeOut("slow");
                                        Materialize.toast('Erro contate o administrador', 5500, 'toast-container');
                                        $scope.blockAccept = false;

                                    }
                                });
                            },
                            function() {
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Erro 01b - Contate o ADM', 5500, 'toast-container');
                                $scope.blockAccept = false;
                            }
                        );
                };

                $scope.deleteAtrasado = function(remove) {
                    remove = confirm("Confirme a exclusão da solicitação");
                    if (remove == true) {
                        appointmentAPIService.deleteLate($scope.atual.idAppointment).then(function() {
                            var removeThisItem = $scope.listEvents.filter(
                                function(val) {
                                    return (val.type == 'SolicitacaoAtraso') && val.id == $scope.atraso.idappointment;
                                }
                            );
                            $scope.listEvents.splice($scope.listEvents.indexOf(removeThisItem[0]), 1);
                            var obj = $scope.atual;

                            var eventData = {
                                id: $scope.atraso.idappointment,
                                title: title,
                                start: obj.initialDate,
                                end: obj.initialDate,
                                color: '#FFFFFF',
                                textColor: '#000000',
                                borderColor: '#757575',
                                type: 'apontamentoNaoEfetuado',
                                user: obj.userId.idUser,
                                customer: obj.customerId.idCustomer,
                                project: obj.projectId.idProject,
                            };

                            $scope.listEvents.push(eventData);
                            $scope.filterData();

                            $('#modalAceitarAtraso').modal('close');
                            $(".toast").fadeOut("slow");
                            Materialize.toast('A solicitação foi cancelada', 1500, 'toast-container');
                        }, function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 29 - contate o administrador', 5500, 'toast-container')

                        });
                    } else {
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Operação foi recusada', 1500, 'toast-container');
                        $('#modalAceitarAtraso').modal('close');
                    }
                };

                $("#modalAcceptSolicitação").modal({
                    ready: function(a) {
                        calendarRequestAPIService.getById($scope.request.idCalendarRequest).then(
                            function(response) {
                                $scope.accept.transfer = 0;
                                $scope.accept.workplace = "1";
                                new Date().toISOString().split('T')[0]
                                $scope.accept.initialHour = moment("08:30", "HH:mm").format("HH:mm");
                                $scope.accept.hourLunch = moment("01:00", "HH:mm").format("HH:mm");
                                $scope.accept.lastHour = moment("17:30", "HH:mm").format("HH:mm");
                                $scope.accept.userId = response.data[0].userId.idUser;
                                $scope.accept.initialDate = $scope.request.initialDate;
                                $scope.accept.executed = '';
                                $scope.accept.appointmentStatusId = 2;
                                $scope.request = response.data[0];
                                $scope.request.name = response.data[0].userId.name;
                                $scope.request.userId = response.data[0].userId.idUser;
                                $scope.request.initialDate = moment(response.data[0].initialDate, "YYYY-MM-DD").format("DD/MM/YYYY");
                                $scope.request.description = response.data[0].description;
                                $("#lbluserSolicitacao").addClass("active");
                                $("#lblinitAgendaRequest").addClass("active");
                                $("#lbldescription").addClass("active");
                                $(".select2").select2();

                                $(".toast").fadeOut("slow");
                                Materialize.toast('Dados carregados com sucesso.', 2500, 'toast-container');
                            },
                            function() {
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Erro 30 - contate o administrador', 5500, 'toast-container')

                            }
                        );
                    },
                    complete: function() {
                        $scope.request = {};
                    }
                });

                //getallRequestCalendar
                calendarRequestAPIService.getall()
                    .then(
                        function(response) {
                            var list = [];

                            if ($rootScope.global.permission.agenda == 1) {
                                var editavel = true;
                            } else {
                                var editavel = false;
                            }

                            $.each(response.data, function(key, obj) {
                                var eventData = {
                                    id: obj.idCalendarRequest,
                                    title: "Solicitação: " + obj.userId.name,
                                    start: obj.initialDate,
                                    end: obj.lastDate,
                                    color: "#FF0000",
                                    textColor: "#FFFFFF",
                                    borderColor: "#FF0000",
                                    type: "solicitacao",
                                    user: obj.userId.idUser,
                                    customer: "0",
                                    project: "0",
                                    startEditable: editavel
                                };
                                $scope.listEvents.push(eventData);
                                list.push(eventData);
                            });
                            $scope.filterData();
                        },
                        function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 31- contate o administrador', 5500, 'toast-container')

                        }
                    );
                //solicitacao de calendario
                $scope.requestCalendar = function() {
                    $(".toast").fadeOut("slow");
                    Materialize.toast('Inserindo Itens', 5000, 'toast-container');
                    var dia = moment($("#initAgendaRequest").val().trim(), "DD/MM/YYYY");
                    var dataFinal = moment($("#endAgendaRequest").val().trim(), "DD/MM/YYYY");
                    var weekDay = "";
                    var array = [];
                    var itens = [];

                    while (dia <= dataFinal) {
                        save = false;
                        weekDay = dia.format("e");
                        switch (weekDay) {
                            case "0":
                                if ($("#agendaDomingoSol").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "1":
                                if ($("#agendaSegundaSol").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "2":
                                if ($("#agendaTercaSol").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "3":
                                if ($("#agendaQuartaSol").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "4":
                                if ($("#agendaQuintaSol").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "5":
                                if ($("#agendaSextaSol").is(":checked")) {
                                    save = true;
                                }
                                break;
                            case "6":
                                if ($("#agendaSabadoSol").is(":checked")) {
                                    save = true;
                                }
                                break;
                        }

                        $scope.user.forEach(function(v) {
                            if (v.idUser == $scope.request.userId) {
                                $scope.request.name = v.name;
                            }
                        });
                        if (save == true) {
                            if ($rootScope.global.permission.agenda == 1) {
                                var editavel = true;
                            } else {
                                var editavel = false;
                            }
                            eventData = {
                                id: "",
                                title: "Solicitação: " + $scope.request.name,
                                start: dia,
                                end: dia,
                                color: "#FF0000",
                                textColor: "#FFFFFF",
                                borderColor: "#FF0000",
                                type: "solicitacao",
                                user: "0",
                                customer: "0",
                                project: "0",
                                startEditable: editavel
                            };
                            itens.push(angular.copy(eventData));

                            $scope.request.requesterId = $rootScope.global.idUser;
                            $scope.request.initialdate = moment(dia).format("YYYY/MM/DD");
                            var clone = angular.copy($scope.request);
                            array.push(clone);
                        }
                        dia = dia.add(1, "days");
                    };
                    calendarRequestAPIService.save(array)
                        .then(
                            function(response) {
                                $.each(response.data, function(key, obj) {
                                    itens[key].id = obj.idCalendarRequest;
                                    itens[key].user = obj.userId.idUser;
                                    $scope.listEvents.push(itens[key]);
                                });
                                $scope.filterData();
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Solicitação inserida de ' + moment(itens[0].start._d).format("DD/MM/YYYY") + " até " + moment(itens[itens.length - 1].start._d).format("DD/MM/YYYY"), 5000, 'toast-container');
                            },
                            function() {
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Erro 32 - contate o administrador', 5500, 'toast-container')

                            }
                        );
                    $("#diaSelecionado").modal("close");
                };

                $scope.acceptRequest = function() {
                    var dia = moment($scope.request.initialDate, "DD/MM/YYYY");
                    var arrayAccept = [];

                    $scope.user.forEach(function(v) { //list Users
                        if (v.idUser == $scope.accept.userId) {
                            $scope.accept.name = v.name;
                        }
                    });

                    $scope.project.forEach(function(v) { //listProjects
                        if (v.idProject == $scope.accept.projectId) {
                            $scope.accept.name = v.name;
                        }
                    });

                    $scope.customer.forEach(function(v) { //listProjects
                        if (v.idCustomer == $scope.accept.customerId) {
                            $scope.accept.customerName = v.name;
                        }
                    });

                    if ($rootScope.global.permission.agenda == 1) {
                        var editavel = true;
                    } else {
                        var editavel = false;
                    }

                    var eventData = {
                        id: '',
                        title: $scope.accept.customerName + " - " + $scope.accept.name,
                        start: dia,
                        end: dia,
                        color: '#FFFFFF',
                        textColor: '#000000',
                        borderColor: '#757575',
                        type: 'apontamentoNaoEfetuado',
                        startEditable: editavel
                    }

                    if (!$scope.accept.transfer || $scope.accept.workplace == 1) {
                        $scope.accept.transfer = 0;
                    }

                    $scope.accept.initialDate = moment(dia).format("YYYY/MM/DD");
                    arrayAccept.push($scope.accept);

                    calendarRequestAPIService.delete($scope.request.idCalendarRequest).then(
                        function() {
                            appointmentAPIService.saveAgenda(arrayAccept).then(
                                function(responseAgenda) {

                                    var removeThisItem = $scope.listEvents.filter(
                                        function(val) {
                                            return val.type == "solicitacao" && val.id == $scope.request.idCalendarRequest;
                                        }
                                    );

                                    $scope.listEvents.splice($scope.listEvents.indexOf(removeThisItem[0]), 1);
                                    eventData.id = responseAgenda.data[0].idAppointment;
                                    eventData.user = responseAgenda.data[0].userId.idUser;
                                    eventData.customer = responseAgenda.data[0].customerId.idCustomer;
                                    eventData.project = responseAgenda.data[0].projectId.idProject;
                                    $scope.listEvents.push(eventData);
                                    $('.modal').modal('close');

                                    var positionItem = $scope.freeUsers.findIndex(function(element, index, array) {
                                        if (element.id == responseAgenda.data[0].userId.idUser + moment(eventData.start).format("YYYYMMDD")) {
                                            return true;
                                        }
                                    })
                                    if (positionItem != -1) {
                                        $scope.freeUsers.splice(positionItem, 1);
                                    }

                                    $scope.filterData();
                                },
                                function() {
                                    $(".toast").fadeOut("slow");
                                    Materialize.toast('Erro 34 - contate o administrador', 5500, 'toast-container')

                                }
                            );
                        },
                        function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 33 - contate o administrador', 5500, 'toast-container')

                        }
                    );

                };
                //delete Request
                $scope.deleteRequest = function(remove) {
                    remove = confirm("Confirme a exclusão da solicitação");
                    if (remove == true) {
                        calendarRequestAPIService.delete($scope.request.idCalendarRequest).then(function() {

                            $(".toast").fadeOut("slow");
                            Materialize.toast('A solicitação foi cancelada', 1500, 'toast-container');

                            var removeThisItem = $scope.listEvents.filter(
                                function(val) {
                                    return val.type == "solicitacao" && val.id == $scope.request.idCalendarRequest;;
                                }
                            );

                            $scope.listEvents.splice($scope.listEvents.indexOf(removeThisItem[0]), 1);
                            $scope.filterData();

                            $('#modalAcceptSolicitação').modal('close');
                        }, function() {
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 35 - contate o administrador', 5500, 'toast-container')

                        });
                    } else {
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Operação foi recusada', 1500, 'toast-container');
                        $('#modalAcceptSolicitação').modal('close');
                    }
                };
                // DATEPICKER MATERIALZE
                var diaSemana = ['Domingo', 'Segunda-Feira', 'Terca-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sabado'];
                var mesAno = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
                var data = new Date();
                var hoje = diaSemana[data.getDay()] + ', ' + mesAno[data.getMonth()] + ' de ' + data.getFullYear();
                $(".datepicker").pickadate({
                    monthsFull: mesAno,
                    monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                    weekdaysFull: diaSemana,
                    weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
                    weekdaysLetter: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
                    selectMonths: true,
                    selectYears: true,
                    clear: 'Limpar',
                    format: 'dd/mm/yyyy',
                    today: "Hoje",
                    close: "Fechar",
                    min: new Date(data.getFullYear() - 1, 0, 1),
                    max: new Date(data.getFullYear() + 1, 11, 31),
                    closeOnSelect: true
                });
                // DATEPICKER MATERIALZE

                // $("#settings").click(
                //     function() {5
                //         $('#modalFilter').prop({
                //             display: block
                //           });
                //         // $("#modalConfiguracoes").css("display", "block");
                //     }
                // );

                $("#trash").mouseout(function() {
                    $(this).removeClass("alterColorButton");
                    $(this).addClass("alterColorButtonReverse");
                }).mouseover(function() {
                    $(this).removeClass("alterColorButtonReverse");
                    $(this).addClass("alterColorButton");
                });

                $(function() {
                    var div = $("#notifications"); // seleciona a div específica
                    $("body").on("click", function(e) {
                        if (div.has(e.target).length || e.target == div[0] || e.target == $("#bell")[0] || e.target ==
                            $("#bellCount")[0])
                            return;
                        div.hide();
                    });
                })

                $(function() {
                    var div = $("#modalApontar"); // seleciona a div específica
                    $("body").on("click", function(e) {
                        if (e.target == div[0]) {
                            div.hide();
                        }
                    });
                })

                $(function() {
                    var div = $("#modalConfiguracoes"); // seleciona a div específica
                    $("body").on("click", function(e) {
                        if (e.target == div[0]) {
                            div.hide();
                        }
                    });
                });

                $(document).ready(function() {
                    $(window).resize(function() {
                        $('#calendar').fullCalendar('option', 'height', $(window).height() - 65);
                    });
                });

                $scope.marcaItem = function(campo) {
                    $('.itemModal').removeClass("itemModalSelect");
                    $(campo).addClass("itemModalSelect");
                }

                $scope.moreItem = function() {

                    $("#inicioAgenda").val(moment().format("DD/MM/YYYY"));
                    $("#finalAgenda").val(moment().format("DD/MM/YYYY"));

                    $("#inicialSolicitacao").val(moment().format("DD/MM/YYYY"));
                    $("#finalSolicitacao").val(moment().format("DD/MM/YYYY"));
                };
                var isEventOverDiv = function(x, y) {
                    var external_events = $('#trash');
                    var offset = external_events.offset();
                    offset.right = external_events.width() + offset.left;
                    offset.bottom = external_events.height() + offset.top;

                    // Compare
                    if (x >= offset.left &&
                        y >= offset.top &&
                        x <= offset.right &&
                        y <= offset.bottom) {
                        return true;
                    }
                    return false;
                };

                $("#settings").on("click", function(e) {
                    $("#modalFilter").css("display", "block");
                    $("#filterConsultores").select2();
                    $("#filterClientes").select2();
                    $("#filterProjetos").select2();

                });

                $("#settingsClose").on("click", function(e) {
                    $("#modalFilter").css("display", "none");
                });

                $("body").on("click", function(e) {
                    var div = $("#modalFilter"); // seleciona a div específica
                    if (e.target == div[0]) {
                        div.hide();
                    }
                });

                $scope.removeOpenItem = function(item) {
                    $scope.newAppointment.expense.splice(item, 1);
                }
            }

            $('#modalViewParticular').modal({
                ready: function() {
                    $('ul.tabs').tabs({
                        onShow: function() {
                            $scope.$apply();
                        }
                    });
                },
                complete: function() {
                    $scope.viewParticularData = [];
                }
            });

            $scope.viewParticular = function(id){
                appointmentAPIService.getById(id).then(
                    function(response){
                        $scope.viewParticularData = response.data[0];
                        $scope.viewParticularData.userName = response.data[0].userId.name;
                        $scope.viewParticularData.userId = response.data[0].userId.idUser;
                        $scope.viewParticularData.initialDate = moment(response.data[0].initialDate, "YYYY-MM-DD").format("DD/MM/YYYY");
                        $('#modalViewParticular').modal('open');
                        $timeout(function () {
                            Materialize.updateTextFields();
                            $('.select2').select2();
                        }, 0);

                        $(".toast").fadeOut("slow");
                        Materialize.toast('Dados carregados com sucesso.', 2500, 'toast-container');
                    },
                    function(){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 36 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $scope.updateParticular = function(){
                $(".toast").fadeOut("slow");
                Materialize.toast('Salvando particular!', 30000, 'toast-container');
                $('#calendar').fullCalendar('removeEvents');
                $scope.viewParticularData.initialDate = moment($scope.viewParticularData.initialDate, "DD/MM/YYYY").format("YYYY-MM-DD");
                appointmentAPIService.updateParticular($scope.viewParticularData).then(
                    function(){
                        $('#modalViewParticular').modal('close');
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Particular salvo com sucesso!', 5500, 'toast-container');

                        var idItem = $scope.listEvents.filter(
                            function(val) {
                                return val.type == "particular" && val.id == $scope.viewParticularData.idAppointment;
                            }
                        );

                        var idUser = $scope.user.filter(
                            function(val) {
                                return val.idUser == $scope.viewParticularData.userId;
                            }
                        );

                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].start = $scope.viewParticularData.initialDate;
                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].title = idUser[0].name+" - Particular";

                        $scope.filterData();
                            
                    },
                    function(){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 37 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $('#modalViewFerias').modal({
                ready: function() {
                    $('ul.tabs').tabs({
                        onShow: function() {
                            $scope.$apply();
                        }
                    });
                },
                complete: function() {
                    $scope.viewFeriasData = [];
                }
            });

            $scope.viewFerias = function(id){
                appointmentAPIService.getById(id).then(
                    function(response){
                        $scope.viewFeriasData = response.data[0];
                        $scope.viewFeriasData.userName = response.data[0].userId.name;
                        $scope.viewFeriasData.userId = response.data[0].userId.idUser;
                        $scope.viewFeriasData.initialDate = moment(response.data[0].initialDate, "YYYY-MM-DD").format("DD/MM/YYYY");
                        $('#modalViewFerias').modal('open');
                        $timeout(function () {
                            Materialize.updateTextFields();
                            $('.select2').select2();
                        }, 0);
                    },
                    function(){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 38 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $scope.updateFerias = function(){
                $(".toast").fadeOut("slow");
                Materialize.toast('Salvando Férias!', 30000, 'toast-container');
                $('#calendar').fullCalendar('removeEvents');
                $scope.viewFeriasData.initialDate = moment($scope.viewFeriasData.initialDate, "DD/MM/YYYY").format("YYYY-MM-DD");
                appointmentAPIService.updateFerias($scope.viewFeriasData).then(
                    function(){
                        $('#modalViewFerias').modal('close');
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Férias salvo com sucesso!', 5500, 'toast-container');

                        var idItem = $scope.listEvents.filter(
                            function(val) {
                                return val.type == "ferias" && val.id == $scope.viewFeriasData.idAppointment;
                            }
                        );

                        var idUser = $scope.user.filter(
                            function(val) {
                                return val.idUser == $scope.viewFeriasData.userId;
                            }
                        );

                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].start = $scope.viewFeriasData.initialDate;
                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].title = idUser[0].name+" - Férias";

                        $scope.filterData();
                            
                    },
                    function(){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 39 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $('#modalViewFeriado').modal({
                ready: function() {
                    $('ul.tabs').tabs({
                        onShow: function() {
                            $scope.$apply();
                        }
                    });
                    $(".toast").fadeOut("slow");
                    Materialize.toast('Dados carregados com sucesso.', 2500, 'toast-container');
                },
                complete: function() {
                    $scope.viewFeriadoData = [];
                }
            });

            $scope.viewFeriado = function(id){
                holidayAPIService.getbyid(id).then(
                    function(response){
                        $scope.viewFeriadoData = response.data[0];
                        $scope.viewFeriadoData.date = moment(response.data[0].date, "YYYY-MM-DD").format("DD/MM/YYYY");
                        $('#modalViewFeriado').modal('open');
                        $timeout(function () {
                            Materialize.updateTextFields();
                            $('.select2').select2();
                        }, 0);
                    },
                    function(){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 40 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $scope.updateFeriado = function(){
                $(".toast").fadeOut("slow");
                Materialize.toast('Salvando Fériado!', 30000, 'toast-container');
                $('#calendar').fullCalendar('removeEvents');
                $scope.viewFeriadoData.date = moment($scope.viewFeriadoData.date, "DD/MM/YYYY").format("YYYY-MM-DD");
                holidayAPIService.save($scope.viewFeriadoData).then(
                    function(){
                        $('#modalViewFeriado').modal('close');
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Feriado salvo com sucesso!', 5500, 'toast-container');

                        var idItem = $scope.listEvents.filter(
                            function(val) {
                                return val.type == "feriado" && val.id == $scope.viewFeriadoData.idHoliday;
                            }
                        );

                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].start = $scope.viewFeriadoData.date;
                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].end = $scope.viewFeriadoData.date;

                        $scope.filterData();
                            
                    },
                    function(){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 41 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $('#modalViewAniversario').modal({
                ready: function() {
                    $('ul.tabs').tabs({
                        onShow: function() {
                            $scope.$apply();
                        }
                    });
                },
                complete: function() {
                    $scope.viewAniversarioData = [];
                }
            });

            $scope.viewAniversario = function(id){
                usersAPIService.getByIdUser(id).then(
                    function(response){
                        $scope.viewaniversarioData = response.data[0];
                        $scope.viewaniversarioData.data = moment(response.data[0].birthDay, "YYYY-MM-DD").format("DD/MM");
                        $('#modalViewAniversario').modal('open');

                        $(".toast").fadeOut("slow");
                        Materialize.toast('Dados carregados com sucesso.', 2500, 'toast-container');
                    },
                    function(){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 42 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $('#modalViewRequest').modal({
                ready: function() {
                    $('ul.tabs').tabs({
                        onShow: function() {
                            $scope.$apply();
                        }
                    });
                },
                complete: function() {
                    $scope.viewRequestData = [];
                }
            });

            $scope.viewRequest = function(id){
                calendarRequestAPIService.getById(id).then(
                    function(response){
                        $scope.viewRequestData = response.data[0];
                        $scope.viewRequestData.user = response.data[0].userId;
                        $scope.viewRequestData.userId = response.data[0].userId.idUser;
                        $scope.viewRequestData.requester = response.data[0].requesterId;
                        $scope.viewRequestData.requesterId = response.data[0].requesterId.idUser;

                        $scope.viewRequestData.initialDate = moment(response.data[0].initialDate, "YYYY-MM-DD").format("DD/MM/YYYY");
                        $('#modalViewRequest').modal('open');
                        $timeout(function () {
                            Materialize.updateTextFields();
                            $('.select2').select2();
                        }, 0);

                        $(".toast").fadeOut("slow");
                        Materialize.toast('Dados carregados com sucesso.', 2500, 'toast-container');
                    },
                    function(){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 43 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $scope.updateRequest = function(){
                $(".toast").fadeOut("slow");
                Materialize.toast('Salvando Solicitação!', 30000, 'toast-container');
                $('#calendar').fullCalendar('removeEvents');
                $scope.viewRequestData.initialDate = moment($scope.viewRequestData.initialDate, "DD/MM/YYYY").format("YYYY-MM-DD");
                calendarRequestAPIService.update($scope.viewRequestData).then(
                    function(){
                        $('#modalViewRequest').modal('close');
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Solicitação salva com sucesso!', 5500, 'toast-container');

                        var idItem = $scope.listEvents.filter(
                            function(val) {
                                return val.type == "solicitacao" && val.id == $scope.viewRequestData.idCalendarRequest;
                            }
                        );

                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].start = $scope.viewRequestData.initialDate;
                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].end = $scope.viewRequestData.initialDate;

                        $scope.filterData();

                    },
                    function(err){
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 44 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

            $('#modalApontar').modal({
                ready: function(a) {
                    $('ul.tabs').tabs({
                        onShow: function() {
                            $scope.$apply();
                        }
                    });
                    appointmentAPIService.getById($scope.newAppointment.idAppointment).then(function(response) {
                        $scope.newAppointment = response.data[0];
                        $scope.newAppointment.user = $scope.newAppointment.userId;
                        $scope.newAppointment.userId = $scope.newAppointment.userId.idUser;
                        $scope.newAppointment.customer = $scope.newAppointment.customerId;
                        $scope.newAppointment.customerId = $scope.newAppointment.customerId.idCustomer;
                        $scope.getProjects($scope.newAppointment.customerId);
                        $scope.newAppointment.project = $scope.newAppointment.projectId;
                        $scope.newAppointment.projectId = $scope.newAppointment.projectId.idProject;

                        if (moment($scope.closingDate, "YYYY-MM-DD") > moment(response.data[0].initialDate, "YYYY-MM-DD") && $scope.global.permission.agenda != 1) {
                            $scope.Salvar = "Solicitar aprovação";
                        } else {
                            $scope.Salvar = "Salvar";
                        }
                        var city = $scope.newAppointment.appointmentProject = response.data[0].project.city;
                        var address = $scope.newAppointment.appointmentProject = response.data[0].project.address;
                        var district = $scope.newAppointment.appointmentProject = response.data[0].project.district;
                        var number = $scope.newAppointment.appointmentProject = response.data[0].project.number;
                        var complement = $scope.newAppointment.appointmentProject = response.data[0].project.complement;
                        var uf = $scope.newAppointment.appointmentProject = response.data[0].project.state;
                        var tootlipHTML = ' ';
                        tootlipHTML += '<div class="">';
                        tootlipHTML += '     <h5 style="font-size: 17px;">Endereço</h5>';
                        tootlipHTML += '     <div class="input-field col s12 m12">';
                        tootlipHTML += '         <p style="">Cidade: ' + city + '-' + uf + '</p>';
                        tootlipHTML += '     </div>';
                        tootlipHTML += '     <div class="input-field col s12 m12">';
                        tootlipHTML += '         <p>Endereço: ' + address + '</p>';
                        tootlipHTML += '     </div>';
                        tootlipHTML += '     <div class="input-field col s12 m12">';
                        tootlipHTML += '         <p>Número: ' + number + '</p>';
                        tootlipHTML += '     </div>';
                        tootlipHTML += '     <div class="input-field col s12 m12">';
                        tootlipHTML += '         <p>Bairro: ' + district + '</p>';
                        tootlipHTML += '     </div>';
                        tootlipHTML += '     <div class="input-field col s12 m12">';
                        tootlipHTML += '         <p>Complemento: ' + complement + '</p>';
                        tootlipHTML += '     </div>';
                        tootlipHTML += '</div>';
                        $('.tooltipped').tooltip({
                            delay: 300,
                            html: true,
                            tooltip: tootlipHTML
                        });
                        $scope.newAppointment.expenseType = response.data[0].project.expenseType;
                        if (response.data[0].appointmentStatusId.idAppointmentStatus == "1") {
                            $.each(response.data[0].appointmentExpense, function(key, value) {
                                response.data[0].appointmentExpense[key].cost = formatMoney(value.cost.replaceAll(".", ","));
                                response.data[0].appointmentExpense[key].expenseOpenTypeId = value.expenseOpenTypeId.idExpenseOpenType;
                            })
                            $scope.newAppointment.expense = response.data[0].appointmentExpense;
                        } else {
                            $scope.newAppointment.expense = []
                        }
                        $scope.newAppointment.workplace = response.data[0].workplace.toString();
                        $scope.newAppointment.appointmentCustomer = response.data[0].customer.name;
                        $("#labelCustomer").addClass("active");
                        $scope.newAppointment.executed = response.data[0].executed;
                        $scope.newAppointment.appointmentProject = response.data[0].project.name;
                        $("#labelProject").addClass("active");
                        $scope.newAppointment.initialDate = moment(response.data[0].initialDate, "YYYY-MM-DD").format("DD/MM/YYYY");
                        $("#labelAppointmentDate").addClass("active");

                        $scope.newAppointment.initialHour =moment(response.data[0].initialHour, "HH:mm:ss").format("HH:mm");
                        $("#labelInitialHour").addClass("active");
                        $scope.newAppointment.hourLunch = moment(response.data[0].hourLunch, "HH:mm:ss").format("HH:mm");
                        $("#labelHourLunch").addClass("active");
                        $scope.newAppointment.lastHour = moment(response.data[0].lastHour, "HH:mm:ss").format("HH:mm");
                        $("#labelLastHour").addClass("active");
                        $scope.newAppointment.unproductiveHours = moment(response.data[0].unproductiveHours, "HH:mm:ss").format("HH:mm");
                        $("#labelUnproductiveHours").addClass("active");

                        $scope.newAppointment.expenseType = response.data[0].project.expenseType

                        if ($scope.newAppointment.expenseType == 1) {
                            $scope.newAppointment.despesa = formatMoney(response.data[0].project.expense);
                        }

                        $scope.newAppointment.activity = response.data[0].activity;
                        $("#labelActivity").addClass("active");

                        $timeout(function () {
                            Materialize.updateTextFields();
                            $(".select2").select2();
                            if($rootScope.global.permission.agenda == 1 || $rootScope.global.idUser == $scope.newAppointment.userId){
                                $('ul.tabs').tabs('select_tab', 'appoint');
                            }else{
                                $('ul.tabs').tabs('select_tab', 'agendaAlt');
                            }
                        }, 0);

                        $(".toast").fadeOut("slow");
                        Materialize.toast('Dados carregados com sucesso.', 2500, 'toast-container');

                    }, function() {
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Erro 08 - contate o administrador', 5500, 'toast-container');
                    })

                   
                },
                complete: function() {
                    $scope.newAppointment = {};
                }
            });

            $scope.removeRequest = function(){
                var r = confirm("Remover solicitação?");
                if (r == true) {
                    calendarRequestAPIService.delete($scope.viewRequestData.idCalendarRequest).then(
                        function(){
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Solicitação removida com sucesso!', 3500, 'toast-container');

                            $('#modalViewRequest').modal('close');

                            var idItem = $scope.listEvents.filter(
                                function(val) {
                                    return val.type == "solicitacao" && val.id == $scope.viewRequestData.idCalendarRequest;
                                }
                            );

                            $scope.listEvents.splice($scope.listEvents.indexOf(idItem[0]), 1);

                            $scope.filterData();
                        },
                        function(){
                            $(".toast").fadeOut("slow");
                            Materialize.toast('Erro 45 - contate o administrador', 5500, 'toast-container');
                        }
                    )
                }
            }

            $scope.updateAgenda = function(){
                $(".toast").fadeOut("slow");
                Materialize.toast('Salvando agenda!', 30000, 'toast-container');
                $('#calendar').fullCalendar('removeEvents');
                $scope.newAppointment.initialDate = moment($scope.newAppointment.initialDate, "DD/MM/YYYY").format("YYYY-MM-DD");
                console.log($scope.newAppointment);
                appointmentAPIService.update($scope.newAppointment).then(
                    function(){
                        $('#modalViewRequest').modal('close');
                        $(".toast").fadeOut("slow");
                        Materialize.toast('Agenda salva com sucesso!', 5500, 'toast-container');

                        var idItem = $scope.listEvents.filter(
                            function(val) {
                                return (val.type == "apontamentoNaoEfetuado" || val.type == "apontamentoEfetuado") && val.id == $scope.newAppointment.idAppointment;
                            }
                        );

                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].start = $scope.newAppointment.initialDate;
                        $scope.listEvents[$scope.listEvents.indexOf(idItem[0])].end = $scope.newAppointment.initialDate;

                        $scope.filterData();
                        $("#modalApontar").modal("close");

                    },
                    function(err){
                        $(".toast").fadeOut("slow");
                        $("#modalApontar").modal("close");
                        Materialize.toast('Erro 46 - contate o administrador', 5500, 'toast-container');
                    }
                )
            }

        },
        function() {
            //03 Login
            $(".toast").fadeOut("slow");
            Materialize.toast('Erro 03 - contate o administrador ' + localStorage.getItem('userCode'), 5500, 'toast-container');
        }
    )

   
});