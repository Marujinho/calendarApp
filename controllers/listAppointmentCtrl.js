angularApp.controller('listAppointmentCtrl', function($scope, $rootScope, appointmentAPIService, $compile, $state, usersAPIService) {

    
    //necessario para remover o search customizado
    // $.fn.dataTable.ext.seach.splice(0, 2);
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

                if($rootScope.global.permission.requestConsultant == 1){
                    appointmentAPIService.getallAppointment().then(function(response) {
                        $scope.povoaDados(response.data);
                    })
                }else{
                    appointmentAPIService.getByUser($rootScope.global.idUser).then(function(response) {
                        $scope.povoaDados(response.data);
                    })
                }

                if($rootScope.global.permission.appointment != 1){
                    $state.go('agenda');
                }

                $rootScope.local = "";
                $rootScope.titulo = 'Apontamentos';

                function diffHoras(hora1, hora2, intervalo){
                    var data1Quebrada = hora1.split(":");
                    var data2Quebrada = hora2.split(":");
                    var dataIntervalo = intervalo.split(":");
                    var horas, minutos, segundos;
                    if(parseInt(data1Quebrada[0]) > parseInt(data2Quebrada[0])){
                        horas = parseInt(data1Quebrada[0])-parseInt(data2Quebrada[0])-parseInt(dataIntervalo[0]);
                        minutos = parseInt(data1Quebrada[1])-parseInt(data2Quebrada[1])-parseInt(dataIntervalo[1]);
                        segundos = parseInt(data1Quebrada[2])-parseInt(data2Quebrada[2])-parseInt(dataIntervalo[2]);
                    }else{
                        horas = parseInt(data2Quebrada[0])-parseInt(data1Quebrada[0])-parseInt(dataIntervalo[0]);
                        minutos = parseInt(data2Quebrada[1])-parseInt(data1Quebrada[1])-parseInt(dataIntervalo[1]);
                        segundos = parseInt(data2Quebrada[2])-parseInt(data1Quebrada[2])-parseInt(dataIntervalo[2]);
                    }       
                    while(parseInt(segundos) < 0){
                        minutos = minutos-1;
                        segundos = segundos+60;
                    }       
                    while(parseInt(minutos) < 0){
                        horas = horas-1;
                        minutos = minutos+60;
                    }       
                        horas = horas < 10 ? "0"+horas : horas;
                        minutos = minutos < 10 ? "0"+minutos : minutos;
                        segundos = segundos < 10 ? "0"+segundos : segundos;      
                    return horas+":"+minutos+":"+segundos;
                }


                function somartempos(tempo1, tempo2) {
                    var array1 = tempo1.split(':');
                    var tempo_seg1 = (parseInt(array1[0]) * 3600) + (parseInt(array1[1]) * 60) + parseInt(array1[2]);
                    var array2 = tempo2.split(':');
                    var tempo_seg2 = (parseInt(array2[0]) * 3600) + (parseInt(array2[1]) * 60) + parseInt(array2[2]);
                    var tempofinal = parseInt(tempo_seg1) + parseInt(tempo_seg2); 
                    var hours = Math.floor(tempofinal / (60 * 60));
                    var divisorMinutos = tempofinal % (60 * 60);
                    var minutes = Math.floor(divisorMinutos / 60);
                    var divisorSeconds = divisorMinutos % 60;
                    var seconds = Math.ceil(divisorSeconds);
                    var contador = "";
                    if (hours < 10) { contador = "0" + hours + ":"; } else { contador = hours + ":"; }
                    if (minutes < 10) { contador += "0" + minutes + ":"; } else { contador += minutes + ":"; }
                    if (seconds < 10) { contador += "0" + seconds; } else { contador += seconds; }
                    return contador;
                    //alert(contador);
                }

                Number.prototype.formatarMoney = function (c, d, t) {
                    var n = this,
                      c = isNaN(c = Math.abs(c)) ? 2 : c,
                      d = d == undefined ? "," : d,
                      t = t == undefined ? "." : t,
                      s = n < 0 ? "-" : "",
                      i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                      j = (j = i.length) > 3 ? j % 3 : 0;
                    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
                  };

                  var dtAppointment;
                $scope.povoaDados = function(response){
                    $scope.appointment = response;
                    $scope.diferenca = [];
                    $scope.despesa = [];
                    $scope.traslado = [];

                        dtAppointment = $('#dtAppointment').DataTable({
                        dom: 'Bfrtip',
                        data: $scope.appointment,
                        columns: [
                            {data:null, 
                                render: function(data, type, row){
                                    return '<a class="grey-text" id="chamarPDF" class="chamarPDF" style="z-index:9999; cursor:pointer;"><i style="font-size:25px;" class="material-icons">file_download</i></a>'
                                }
                            },
                            {
                                data: "initialDate",
                                render: function(data, type, row) {
                                    var dateSplit = data.split('-');
                                    return type === "display" || type === "filter" ? dateSplit[2] + '/' + dateSplit[1] + '/' + dateSplit[0] : data
                                }, width : '50px'
                            },
                            { data: "userId.name"},
                            { data: "customerId.name"},
                            { data: "projectId.name"},
                            { data: "initialHour"},
                            { data: "hourLunch"},
                            { data: "lastHour" },
                            {
                                data: null,
                                render: function(data, type, row) {
                                    var diferenca = diffHoras(row.initialHour, row.lastHour, row.hourLunch);

                                    $scope.diferenca.push(diferenca);
                                    return diferenca
                                },
                                className: "total",
                            },
                            { data: "unproductiveHours", className: "total",width : '100%' },
                            {
                                data: "appointmentExpense",
                                render: function(data, type, row) {
                                var valorFinal = 0.00;
                                    $.each(data, function(key, obj){
                                        if(obj.expenseOpenTypeId.idExpenseOpenType == "1"){
                                                valorFinal += parseFloat(obj.cost);
                                            }
                                        }
                                    )
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replace(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
                                }, className: "total"
                            },
                            {
                                data: "appointmentExpense",
                                render: function(data, type, row) {
                                var valorFinal = 0.00;
                                    $.each(data, function(key, obj){
                                if(obj.expenseOpenTypeId.idExpenseOpenType == "2"){
                                                valorFinal += parseFloat(obj.cost);
                                            }
                                        }
                                    )
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replace(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
                                },className: "total"
                            },
                            {
                                data: "appointmentExpense",
                                render: function(data, type, row) {
                                var valorFinal = 0.00;
                                $.each(data, function(key, obj){
                                if(obj.expenseOpenTypeId.idExpenseOpenType == "3"){
                                                valorFinal += parseFloat(obj.cost);
                                            }
                                        }
                                    )
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replace(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
                                },className: "total"
                            },
                            {
                                data: "appointmentExpense",
                                render: function(data, type, row) {
                                var valorFinal = 0.00;
                                    $.each(data, function(key, obj){
                                if(obj.expenseOpenTypeId.idExpenseOpenType == "4"){
                                                valorFinal += parseFloat(obj.cost);
                                            }
                                        }
                                    )
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replace(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
                                },className: "total"
                            },
                            {
                                data: "appointmentExpense",
                                render: function(data, type, row) {
                                var valorFinal = 0.00;
                                    $.each(data, function(key, obj){
                                if(obj.expenseOpenTypeId.idExpenseOpenType == "5"){
                                                valorFinal += parseFloat(obj.cost);
                                            }
                                        }
                                    )
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replace(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
                                },className: "total"
                            },
                            {
                                data: "appointmentExpense",
                                render: function(data, type, row) {
                                var valorFinal = 0.00;
                                    $.each(data, function(key, obj){
                                    if(obj.expenseOpenTypeId.idExpenseOpenType == "6"){
                                            valorFinal += parseFloat(obj.cost);
                                            }
                                        }
                                    )
                                return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replace(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
                                },className: "total"
                            },
                            {
                                data: "appointmentExpense",
                                render: function(data, type, row) {
                                var valorFinal = 0.00;
                                    $.each(data, function(key, obj){
                                    if(obj.expenseOpenTypeId.idExpenseOpenType == "7"){
                                        valorFinal += parseFloat(obj.cost);
                                            }
                                        }   
                                    ) 
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replace(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
                                }, className: "total"
                            },
                            {
                            data: null,
                            render: function(data, type, row) {
                            var despesa = 0.00;
                                if(row.workplace.toString() == "2"){
                                    if(row.projectId.expenseType.toString() == "1"){
                                        var despesa = 'R$ ' + row.projectId.expense.replace(".", ",");
                                }else{
                                        $.each(row.appointmentExpense, function(key, obj){
                                            despesa += parseFloat(obj.cost);
                                            }
                                        )
                                        despesa = despesa.toString().split(".").length > 1 ? 'R$ ' + despesa.toString().replace(".", ",") : 'R$ ' + despesa.toString()+ ',00';
                                    }
                                }else{
                                var despesa = "R$ 0,00";
                                }
                                    $scope.despesa.push(despesa);
                                    return despesa;
                                }, className: "total"
                            },
                            {
                                data: null,
                                render: function(data, type, row) {
                                    var traslado = row.projectId.transfer;
                                    if (row.transfer == true) {
                                        $scope.traslado.push(traslado);
                                        return row.projectId.transfer
                                    } else {
                                        $scope.traslado.push('00:00:00');
                                        return "00:00:00"
                                    }
                                },
                                
                                className: "total"
                            },
                            { data: "appointmentStatusId.description"},
                            { data: "activity",
                                render: function ( data, type, row ) {
                                    $('.tooltip').tooltip({
                                            transitionMovement:200
                                        }
                                    );
                                    if(data.length > 35){
                                        return "<div id='itemTooltip'><div data-toggle='tooltip' class='tooltip' data-position='left' data-tooltip='"+data+"' data-tooltip-width='500' data-tooltip-height='500'>" + data.substr( 0, 35 ) +'…'  + "</div></div>"
                                    } else{
                                        return data
                                    }
                                }
                            }
                        ],
                        initComplete: function() {
                            this.api().columns().every(function() {
                                var column = this;
                                    if( column.index() != 0 && column.index() != 1 && column.index() != 10 && column.index() != 11 && column.index() != 12 && column.index() != 13 && column.index() != 14 && column.index() != 15 && column.index() != 16 && column.index() != 17) {
                                    var select = $('<select class="select2" multiple style="width:100%;"><option value="" style="width:100%;"></option></select>').appendTo($("#filters").find("th").eq(column.index()))
                                        .on('change', function () {
                                            var list = $(this).val();
                                            var val = '';
                                            if(list != null){
                                                for(var i = 0; i < list.length; i++){
                                                    val += $.fn.dataTable.util.escapeRegex(list[i]);
                                                    if(i != list.length-1){
                                                        val += "|"
                                                    }
                                                }
                                            }
                                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                                        }
                                    );  
                                    $('.select2').select2();
                                    var diferenca = [];
                                    var despesa = [];
                                    var traslado = [];
                                    column.data().unique().sort().each(function(d, j) {
                                        // select 
                                        if (column.index() == 18) {
                                            if (traslado.indexOf($scope.traslado[j]) == -1) {
                                                traslado.push($scope.traslado[j]);
                                                select.append('<option value="' + $scope.traslado[j] + '" style="width:100%;">' + $scope.traslado[j] + '</option>');
                                            }
                                        } else if (column.index() == 8) {
                                            if (diferenca.indexOf($scope.diferenca[j]) == -1) {
                                                diferenca.push($scope.diferenca[j]);
                                                select.append('<option value="' + $scope.diferenca[j] + '" style="width:100%;">' + $scope.diferenca[j] + '</option>');
                                            }
                                        } else {
                                            select.append('<option value="' + d + '" style="width:100%;">' + d + '</option>')
                                        }
                                    });  
                                }
                            });
                        },
                        buttons: [
                            { extend: 'copy', title:'Relatório de Apontamentos', text: 'Copiar', footer: true, className: 'waves-effect white btn z-depth-0 grey-text text-darken-2' },
                            { extend: 'excel', title:'Relatório de Apontamentos', text: 'Excel', footer: true, className: 'waves-effect white btn z-depth-0 grey-text text-darken-2' }
                            // { extend: 'print', customize: function (doc) {
                            //     doc.defaultStyle.fontSize = 9.5;
                            //     doc.styles.tableHeader.fontSize = 9.5;
                            //     doc.styles.title.fontSize = 11;
                            //     doc.styles.tableFooter.fontSize = 9.5;
                            // },
                            // title:'Relatório de Apontamentos', text: 'Imprimir',  footer: true, className: 'waves-effect white btn z-depth-0 grey-text text-darken-2' }
                        ],
                        columnDefs: [{
                            targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            className: 'mdl-data-table__cell--non-numeric'
                        }],
                        "footerCallback": function(row, data, start, end, display) {                
                            var api = this.api();
                            api.columns('.total', { search: 'applied' }).every(function() {                   
                                var sum = api.cells(null, this.index(), { search: 'applied' })
                                    .render('display')
                                    .reduce(function(total, item, posicao , data) {

                                        var splitado = item.split(':');
                                        if (splitado.length > 1) {
                                            if(total  == 0){
                                                total = '00:00:00';
                                            }                               
                                            var totalResultado = somartempos(total.toString(), item.toString());                                
                                            return totalResultado;
                                        } else {

                                            var x = parseFloat(total.toString().replace('R$ ','').replace('.','').replace(',','.'));
                                            var y = parseFloat(item.toString().replace('R$ ','').replace('.','').replace(',','.'));
                                       
                                            var soma = x + y;
                                            return 'R$ ' + soma.formatarMoney(2, ',', '.').replace('R$ ','');
                                            
                                         }
                                    }, 0);
                                $(this.footer()).html(sum);
                            });
                        },    
                        
                        fixedColumns: true,
                        colReorder: true,
                        orderCellsTop: true,
                        scrollX: true,
                        responsive: false,
                        "bPaginate": true,
                        "bLengthChange": false,
                        "bFilter": true,
                        "bInfo": false,
                        "bAutoWidth": false,
                        "language": {
                            "sEmptyTable": "Nenhum registro encontrado",
                            "sInfo": "Mostrando do Início ao Final de todos os registros",
                            "sInfoEmpty": "Mostrando 0 á 0 de 0 de todos registros",
                            "sInfoFiltered": "(Filtrados de MAX registros)",
                            "sInfoPostFix": "",
                            "sInfoThousands": ".",
                            "sLengthMenu": "_MENU_ resultados por página",
                            "sLoadingRecords": "Carregando...",
                            "sProcessing": "Processando...",
                            "sZeroRecords": "Nenhum registro encontrado",
                            "oPaginate": {
                                "sNext": "Próximo",
                                "sPrevious": "Anterior",
                                "sFirst": "Primeiro",
                                "sLast": "Último"
                            },
                            "oAria": {
                                "sSortAscending": ": Ordenar colunas de forma ascendente",
                                "sSortDescending": ": Ordenar colunas de forma descendente"
                            }
                        }
                    });
                    
                    $('.tooltip').tooltip({
                        transitionMovement:200
                    });
                    $('.atividade').css("text-overflow", "ellipsis");
                    $("#minAppointment, #maxAppointment").pickadate({
                        closeOnSelect: true,
                        buttonText: 'Data',
                        buttonImageOnly: true,
                        buttonImage: '/easy_calendar/resources/images/icon-calendar-black.png',
                        monthsFull: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
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
                        default: 'now',
                        onSet: function () { 
                            dtAppointment.draw(); 
                        }
                    });
            
                    $('#minAppointment, #maxAppointment').on('keyup change', function () {
                        dtAppointment.draw();
                    });

                    $.fn.dataTable.ext.search.push(
                        function (conf, data) {
                            var min = $('#minAppointment').val() == "" ? "" : moment($('#minAppointment').val(), 'DD/MM/YYYY');
                            var max = $('#maxAppointment').val() == "" ? "" : moment($('#maxAppointment').val(), 'DD/MM/YYYY');
                            var startDate = moment(data[1], 'DD/MM/YYYY');
                            if (min == "" && max == "") { return true; }
                            if (min == "" && startDate <= max) { return true;}
                            if(max == "" && startDate >= min) {return true;}
                            if (startDate <= max && startDate >= min) { return true; }

                            return false;
                        }
                    );

                    $('.modal').modal();
                    $('.dt-button').removeClass('dt-button');
                    $('#dtAppointment tbody').on('click', 'tr td:not(td:first-child)', function() { // ele nao funcionara na primeira td do filho
                        var data = dtAppointment.row(this).data();
                        var selectedRow = this;
                        var html = '';
                        html += '<div class="modal-content">';
                        html += '       <div class="row" style=" border-bottom: 1px solid #9e9e9e;">';
                        html += '           <h5 style="margin-top:5px; position:absolute;"><b>Visualização de apontamento</b></h5>';
                        html += '           <div class="col s12 m2 right-align" style="float:right;">';
                        //html += '               <a class="modal-action modal-close" ng-click="deleteAppointment();" data-ng-show="global.permission.agenda == 1"><i class="material-icons red-text">delete</i></a>';
                        // html += '               <a id="editarModal" ng-click="editAppointment();" class="modal-action modal-close" data-ng-show="global.permission.agenda == 1"><i class="material-icons grey-text">mode_edit</i></a>';
                        html += '               <a class="modal-action modal-close" ><i class="material-icons grey-text">close</i></a>';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row">';     
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="grey-text idIcon tooltipped" data-position="left" data-tooltip="ID">#</div>';
                        html += '               <div class="conteudoModais">' + data.idAppointment +'</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Usuário"><i class="material-icons grey-text ">person</i></div>';
                        html += '               <div class="conteudoModais">'+ data.userId.name +'</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '                <div class="iconesModais tooltipped" data-position="left" data-tooltip="Status de apontamento"><i class="material-icons grey-text ">autorenew</i></div>';
                        html += '                <div class="conteudoModais">'+ data.appointmentStatusId.description + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">'
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Cliente - Empresa"><i class="material-icons grey-text ">business</i></div>';
                        html += '               <div class="conteudoModais">' + data.customerId.name + ' - ' + data.projectId.name + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '                <div class="iconesModais tooltipped" data-position="left" data-tooltip="Dia de apontamento"><i class="material-icons grey-text ">date_range</i></div>';
                        html += '                <div class="conteudoModais">' + moment(data.initialDate).format('DD/MM/YYYY') + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '                <div class="iconesModais tooltipped" data-position="left" data-tooltip="Horário apontado"><i class="material-icons grey-text ">access_time</i></div>';
                        html += '                <div class="conteudoModais">' + moment(data.initialHour, 'HH:mm:ss').format('HH:mm') + ' - ' + moment(data.hourLunch, 'HH:mm:ss').format("HH:mm") + ' - ' + moment(data.lastHour, 'HH:mm:ss').format('HH:mm') + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '                <div class="iconesModais tooltipped" data-position="left" data-tooltip="Atividade executada"><i class="material-icons grey-text ">build</i></div>';
                        html += '                <div class="conteudoModais">'+ data.activity + '</div>';
                        html += '           </div>';
                        html += '       </div>';
                        html += ' </div>';
                        

                        var compile = $compile(html);
                        compile = compile($scope);
                        $('#modal1').html(compile[0]);
                        $('#modal1').modal('open');

                        $('.tooltipped').tooltip({delay: 50});
                        
                            
                        $scope.editAppointment = function() {
                            $state.go('insertAppointment/:id', { id: data.idAppointment });
                        };
                        $scope.deleteAppointment =  function(){            
                            var remove = confirm("Confirme a exclusão");
                            if (remove == true) {
                                appointmentAPIService.delete(data.idAppointment);
                                dtAppointment.rows($(selectedRow)).remove().draw(false);
                            } else {
                                $('#modal1').modal('close');
                            }     
                        };   
                    });
                        
                    $('#dtAppointment tbody').on('click', 'td #chamarPDF', function() {          
                        var tr = $(this).closest('tr');       
                                          
                        var row = dtAppointment.row(tr);
                        var relatorio = '<style>\
                        td {\
                            border: 1px solid black;\
                            border-bottom: none\
                            font-family: Arial, Helvetica, sans-serif;\
                        }\
                        table {\
                            border: 0.5px solid black;\
                            border-bottom: none\
                            font-family: Arial, Helvetica, sans-serif;\
                        }\
                        table {\
                            border-collapse: collapse;\
                            font-family: Arial, Helvetica, sans-serif;\
                        }\
                        section{\
                            page-break-after: always;\
                            font-family: Arial, Helvetica, sans-serif;\
                        }\
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
                                    <td width="500px" height="50px" valign="top"><span style="font-size:14px">Cliente</span><br><br><b>'+row.data().customerId.name+'</b></td>\
                                    <td width="80px" height="50px" valign="top"><span style="font-size:14px">Data</span><br><br><p style="font-size: 14px; margin-left: 25px; margin-top: 0px;">'+moment(row.data().initialDate).format('DD/MM/YYYY')+'</p></td>\
                                </tr>\
                                <tr>\
                                    <td  height="50" valign="top"><span style="font-size:12px">Projeto</span><br><br>'+row.data().projectId.name+'</td>\
                                </tr>\
                            </table>\
                            <table width="700">\
                                <tr>\
                                    <td  height="50" valign="top"><span style="font-size:12px">Recurso</span><br><br>'+row.data().userId.name+'</td>\
                                </tr>\
                            </table>\
                            <table width="700">\
                                <tr>\
                                    <td width="570" height="50" valign="top"><span style="font-size:12px">Atividade</span><br><br>'+row.data().activity+'</td>\
                                </tr>\
                            </table>\
                            <table width="700">\
                                <tr>\
                                    <td width="140" valign="top"><span style="font-size:12px">Entrada</span><br><br>'+row.data().initialHour+'</td>\
                                    <td width="140" valign="top"><span style="font-size:12px">Intervalo</span><br><br>'+row.data().hourLunch+'</td>\
                                    <td width="140" valign="top"><span style="font-size:12px">Saída</span><br><br>'+row.data().lastHour+'</td>\
                                    <td width="140" valign="top"><span style="font-size:12px">Improdutividade</span><br><br>'+row.data().unproductiveHours+'</td>\
                                    <td width="138" valign="top"><span style="font-size:12px">Total</span><br><br>'+diffHoras(row.data().initialHour, row.data().lastHour, row.data().hourLunch)+'</td>\
                                </tr>\
                            </table>\
                            <table width="700">\
                                <tr>\
                                    <td width="100%" height="50" valign="top"><span style="font-size:12px">Executado:</span><br><br><p style="font-size: 12px;"><b>'+row.data().executed+'</b></p>\
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
                        // Renderizar o seu template com o Mustache

                        $.fileDownload('https://easyboxx.iv2.com.br/EasyBoxx/WS/gerarPDF.php', {
                            httpMethod: 'POST',
                            data: {
                                PDF: html,
                                fileName: "Ordem_de_Servico.pdf"
                            },
                            successCallback: function (url) {
                                alert(url)
                            }
                        });              
                    });
                };     
            }
        }
    )

});

  