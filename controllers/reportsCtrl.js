angularApp.controller('reportsCtrl', function($scope, $timeout, $rootScope, appointmentAPIService, customersAPIService, usersAPIService, expenseTypeOpenAPIService, $state) {
    
    //necessario para remover o search customizado
    $.fn.dataTable.ext.search.splice(0, 2);
    //---
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
                        
                    
                if ($rootScope.global.permission.report != 1) {
                    $state.go('agenda');
                }

                $rootScope.local = "";
                $rootScope.titulo = 'Relatórios';
                $('ul.tabs').tabs({
                    onShow: function() {
                        $('.selectClientes').select2();
                    }
                });
                $('ul.tabs').tabs('select_tab', 'divApontamentos');
                  
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
                
                var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                var firstDay = new Date(y, m, 1);
                $scope.firstDay = moment(firstDay).format("DD/MM/YYYY");
                var lastDay = new Date(y, m + 1, 0);
                $scope.lastDay = moment(lastDay).format("DD/MM/YYYY");

                // appointmentAPIService.getallAppointment().then(function(response) {
                Materialize.toast('Carregando dados!', 30000, 'toast-container');
                appointmentAPIService.getFromRangeDate(moment(firstDay).format("DD/MM/YYYY"), moment(lastDay).format("DD/MM/YYYY")).then(function(response) {
                    $scope.appointment = response.data;
                    $scope.diferenca = [];
                    $scope.despesa = [];
                    $scope.traslado = [];
                    var appointment = $('#dtAppointment').DataTable({
                        dom: 'Bfrtip',
                        data: $scope.appointment,
                        columns: [
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
                            { data: "unproductiveHours", type:"time" , className: "total",width : '100%' },
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
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replaceAll(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
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
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replaceAll(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
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
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replaceAll(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
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
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replaceAll(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
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
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replaceAll(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
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
                                return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replaceAll(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
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
                                    return valorFinal.toString().split(".").length > 1 ? 'R$ ' + valorFinal.toString().replaceAll(".", ",") : 'R$ ' + valorFinal.toString()+ ',00';
                                }, className: "total"
                            },
                            {
                            data: null,
                            render: function(data, type, row) {
                            var despesa = 0.00;
                                if(row.workplace.toString() == "2"){
                                    if(row.projectId.expenseType.toString() == "1"){
                                    var despesa = 'R$ ' + row.projectId.expense.replaceAll(".", ",");
                                }else{
                                        $.each(row.appointmentExpense, function(key, obj){
                                            despesa += parseFloat(obj.cost);
                                            }
                                        )
                                        despesa = despesa.toString().split(".").length > 1 ? 'R$ ' + despesa.toString().replaceAll(".", ",") : 'R$ ' + despesa.toString()+ ',00';
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
                            { data: "activity" , 
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
                            },
                            {data: "projectId.hourConsultantCost", visible:false},
                            {data: "projectId.hourGPCost", visible:false},
                            {data: "projectId.percentGP", visible:false}
                        ],
                        initComplete: function() {
                            this.api().columns().every(function() {
                                    var column = this;
                                     if(column.index() != 0 && column.index() != 9 && column.index() != 10 && column.index() != 11 && column.index() != 12 && column.index() != 13 && column.index() != 14 && column.index() != 15 && column.index() != 16 && column.index() != 19) {
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
                                                 if (column.index() == 17) {
                                                    if (traslado.indexOf($scope.traslado[j]) == -1) {
                                                        traslado.push($scope.traslado[j]);
                                                        select.append('<option value="' + $scope.traslado[j] + '" style="width:100%;">' + $scope.traslado[j] + '</option>');
                                                    }
                                                } else if (column.index() == 7) {
                                                    if (diferenca.indexOf($scope.diferenca[j]) == -1) {
                                                        diferenca.push($scope.diferenca[j]);
                                                        select.append('<option value="' + $scope.diferenca[j] + '" style="width:100%;">' + $scope.diferenca[j] + '</option>');
                                                    }
                                                } else {
                                                    select.append('<option value="' + d + '" style="width:100%;">' + d + '</option>')
                                                }
                                            }
                                        );  
                                    }
                                }
                            );
                        },
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

                                            var x = parseFloat(total.toString().replaceAll('R$ ','').replaceAll('.','').replaceAll(',','.'));
                                            var y = parseFloat(item.toString().replaceAll('R$ ','').replaceAll('.','').replaceAll(',','.'));
                                       
                                            var soma = x + y;
                                            return 'R$ ' + soma.formatarMoney(2, ',', '.').replaceAll('R$ ','');
                                            
                                         }
                                    }, 0);
                                $(this.footer()).html(sum);
                            });
                        },
                        buttons: [         
                            { extend: 'excel', title:'Relatório de Apontamentos', sheetName: "relatorio", text: 'Excel', footer: true, className: 'waves-effect white btn z-depth-0 grey-text text-darken-2',
                                customize: function (xlsx, data) {
                                    
                                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                                    var numrows = 0;
                                    var clR = $('row', sheet);
                                    var ind = 0;

                                    clR.each(function () {
                                        var attr = $(this).attr('r');
                                        ind = parseInt(attr);
                                        ind = ind + numrows;
                                        $(this).attr("r",ind);             
                                    });
                    
                                    // Cria linhas depois do data 
                                    $('row c ', sheet).each(function () {
                                        var attr = $(this).attr('r');
                                        /////////////////////////////////////////////////////////////////////
                                        // ele ira retira a letra das colunas e linhas do excel para somar//
                                        // e salvar na variavel para adicionar na colunas que recebeu + a linha//
                                        var pre = attr.substring(0, 1); 
                                        ind = parseInt(attr.substring(1, attr.length));
                                        ind = ind + numrows;
                                        
                                        //momento em que coloca na linha com a LETRA + NUMERO(POSICAO)
                                        $(this).attr("r", pre + ind);
                                    });

                                    var qtdHORAS = [];
                                    var hrConsultor = [];
                                    var hrGP = [];
                                    var percentGP = [];
                                    $('row c ', sheet).each(function () {
                                        if($(this).attr('r').substring(0, 1) == 'H') {
                                            qtdHORAS.push($(this).text());
                                        }    
                                        
                                        if($(this).attr('r').substring(0, 1) == 'U') {
                                            hrConsultor.push($(this).text());
                                        }  

                                        if($(this).attr('r').substring(0, 1) == 'V') {
                                            hrGP.push($(this).text());
                                        } 
                                        
                                        if($(this).attr('r').substring(0, 1) == 'W') {
                                            percentGP.push($(this).text());
                                        } 
                                    });

                                    qtdHORAS.pop();//remove last item to array

                                    function Addrow(index,data) {           
                                        // funcao que add os campos novos
                                        msg='<row r="'+index+'">'
                                        for(i=0; i < data.length; i++){
                                            var key = data[i].key;
                                            var value = data[i].value;
                                            msg += '<c t="inlineStr" r="' + key + index + '" s="2">';
                                            msg += '   <is>';
                                            msg += '      <t>'+value+'</t>';
                                            msg += '   </is>';
                                            msg += '</c>';
                                        }
                                        msg += '</row>';
                                        return msg;
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

                                    // aqui encontra o item para colocar dentro dos values
                                    var hrTotal = $($($(sheet).find('row:last-child')[0]).find('c[r^=H] is t')[0]).text();// pegando total de hroas

                                    var arr = hrTotal.split(':');
                                    var dec = parseInt((arr[1]/6)*10, 10);
                                    
                                    hrTotal = parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec);

                                    var despesaTotal = $($($(sheet).find('row:last-child')[0]).find('c[r^=Q] is t')[0]).text(); // pegando total de despesa
                                    var tributo =  0.8632;// valor tributo para calculo
                                    var totaisHReQt = [];  // array que recebe o total das horas * valorhr
                                    var totalGP = [];  ///mesmo para gp
                                    

                                    $.each(qtdHORAS, function(posicao, valorHr) {
                                        if(posicao != 0){
                                            var splitadoHR = valorHr.split(':');    
                                            if(valorHr == '00:00:00'){
                                                totaisHReQt[posicao] = 0;
                                                totalGP[posicao] = 0;
                                            }else{

                                                totaisHReQt[posicao] = (splitadoHR[0] * parseFloat(hrConsultor[posicao])) 
                                                    + (splitadoHR[1] * parseFloat(hrConsultor[posicao] / 60)) 
                                                    + (splitadoHR[2] * parseFloat((hrConsultor[posicao] / 60) / 60) );   

                                                totalGP[posicao] = ((splitadoHR[0] * (percentGP[posicao]/100)) * parseFloat(hrGP[posicao]) 
                                                    + (splitadoHR[1] * (percentGP[posicao]/100)) * parseFloat(hrGP[posicao] / 60) 
                                                    + (splitadoHR[2] * (percentGP[posicao]/100)) * parseFloat((hrGP[posicao] / 60) / 60));    
                                            };
                                        }
                                    });
                                    
                                    var totaisHRMaisGP = 0.00;
                                    var calculoTotalGP = 0.00;
                                    var totalConsultorValor = 0.00;

                                    for(var j = 1; j < totaisHReQt.length; j++){  
                                        //so recurso 
                                        totalConsultorValor += totaisHReQt[j];
                                        //so gp  
                                        calculoTotalGP += totalGP[j];                                            
                                    }   
                                    
                                    //total só consultor///
                                    var totalHRSEMGPFormat  ='R$ ' + totalConsultorValor.formatarMoney(2, ',', '.').replaceAll('R$ ','');
                                    //só GP
                                    var formatGPTotal = 'R$ ' + calculoTotalGP.formatarMoney(2, ',', '.').replaceAll('R$ ','');
                                    //consultor+gp
                                    totaisHRMaisGP = parseFloat(totalConsultorValor) + parseFloat(calculoTotalGP);
                                    var consultorMAISGPFormat = 'R$ ' + totaisHRMaisGP.formatarMoney(2, ',', '.').replaceAll('R$ ','');
                                    //////gp+consultor com impostos
                                    var totaisHRMaisGPIMPOSTOS = totaisHRMaisGP / tributo;
                                    var totalcomImpostoFormat = 'R$ ' + totaisHRMaisGPIMPOSTOS.formatarMoney(2, ',', '.').replaceAll('R$ ','');
                                    ////passando format para despesa e imposto
                                    var converterDespesa = despesaTotal.replace('R$',' ').replace(',',' ').replace('.',' ');
                                    var despesaNAOFormat = parseInt(converterDespesa);
                                    var despesaIMPOSTO = despesaNAOFormat / tributo;
                                    var despesaImpostoFormat = 'R$ ' + despesaIMPOSTO.formatarMoney(2, ',', '.').replaceAll('R$ ','');
                                    
                                    //items para add nas colunas
                                    var totalHoras = 'Total de horas';
                                    var totalGPHoras = 'Total de Horas GP';
                                    var totalHRConsultor = 'Total Recurso';
                                    var totalHRGP = 'Total GP';
                                    var totalDespesas = 'Total despesas';
                                    var totalSemImpostos = 'Total s/ impostos';
                                    var totalComImpostos = 'Total c/ impostos';
                                    var totalDespesasComImpostos = 'Despesas c/ impostos';


                                    //add nas linhas
                                    var r1 = Addrow(sheet.childNodes[0].childNodes[1].childElementCount+2, 
                                                    [   { key: 'C', value: totalHoras },
                                                        { key: 'D', value: totalHRConsultor },
                                                        { key: 'E', value: totalHRGP},
                                                        { key: 'F', value: totalSemImpostos},
                                                        { key: 'G', value: totalComImpostos},
                                                        { key: 'H', value: totalDespesas}
                                                        // { key: 'J', value: totalDespesasComImpostos}
                                                    ]);
                                    var r2 = Addrow(sheet.childNodes[0].childNodes[1].childElementCount+3, 
                                                    [   { key: 'C', value: hrTotal },
                                                        { key: 'D', value: totalHRSEMGPFormat },
                                                        { key: 'E', value: formatGPTotal},
                                                        { key: 'F', value: consultorMAISGPFormat},
                                                        { key: 'G', value: totalcomImpostoFormat},
                                                        { key: 'H', value: despesaTotal}
                                                        // { key: 'J', value: despesaImpostoFormat}
                                                    ]);                                           
                                    sheet.childNodes[0].childNodes[1].innerHTML = sheet.childNodes[0].childNodes[1].innerHTML + r1 + r2;
                                },
                                exportOptions: {
                                    // columns: "thead tr th:display:none"
                                } 
                            },                          
                        ],
                        columnDefs: [{
                            targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                            className: 'mdl-data-table__cell--non-numeric'
                        }],                        
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
                        },
                    });
                    
                    $('.tooltip').tooltip({
                            transitionMovement:200
                        }
                    );
                    $('.dt-button').removeClass('dt-button');
                    $('.atividade').css("text-overflow", "ellipsis");

                    $("#min, #max").pickadate({
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
                        onSet: function () { 
                            appointment.draw(); 
                        }
                    });

                    $.fn.dataTable.ext.search.push(
                        function (settings, data, dataIndex) {
                            var min = $('#min').val() == "" ? "" : moment($('#min').val(), 'DD/MM/YYYY');
                            var max = $('#max').val() == "" ? "" : moment($('#max').val(), 'DD/MM/YYYY');
                            var startDate = moment(data[0], 'DD/MM/YYYY');
                            if (min == "" && max == "") { return true; }
                            if (min == "" && startDate <= max) { return true;}
                            if(max == "" && startDate >= min) {return true;}
                            if (startDate <= max && startDate >= min) { return true; }

                            return false;
                    });                    
            
                    $('#min, #max').on('keyup change', function () {
                        $(".toast").fadeOut("slow");
                        $("#loading").css("display", "block");
                        $("#dtAppointmentDiv").css("display", "none");
                        $scope.traslado = [];
                        $scope.diferenca = [];
                        
                        Materialize.toast('Carregando dados!', 30000, 'toast-container');

                        appointmentAPIService.getFromRangeDate(moment(
                            $('#min').val(), "DD/MM/YYYY").format("DD/MM/YYYY"), 
                            moment($('#max').val(), "DD/MM/YYYY").format("DD/MM/YYYY")
                        ).then(
                            function(response) {
                                appointment.clear().draw();
                                appointment.rows.add(response.data).draw();

                                appointment.columns().every(function() {
                                    var column = this;
                                    
                                    if(column.index() != 0 && column.index() != 9 && column.index() != 10 && column.index() != 11 && column.index() != 12 && column.index() != 13 && column.index() != 14 && column.index() != 15 && column.index() != 16 && column.index() != 19) {
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
                                       var traslado = [];

                                       column.data().unique().sort().each(function(d, j) {
                                               // select 
                                               console.log("teste");
                                                if (column.index() == 17) {
                                                    if (traslado.indexOf($scope.traslado[j]) == -1) {
                                                       traslado.push($scope.traslado[j]);
                                                       select.append('<option value="' + $scope.traslado[j] + '" style="width:100%;">' + $scope.traslado[j] + '</option>');
                                                    }
                                                } else if (column.index() == 7) {
                                                    if (diferenca.indexOf($scope.diferenca[j]) == -1) {
                                                       diferenca.push($scope.diferenca[j]);
                                                       select.append('<option value="' + $scope.diferenca[j] + '" style="width:100%;">' + $scope.diferenca[j] + '</option>');
                                                    }
                                                } else {
                                                   select.append('<option value="' + d + '" style="width:100%;">' + d + '</option>')
                                                }
                                           }
                                       );  
                                    }

                                })
                                $(".toast").fadeOut("slow");
                                Materialize.toast('Dados carregados com sucesso!', 3500, 'toast-container');

                                $("#loading").css("display", "none");
                                $("#dtAppointmentDiv").css("display", "block");

                            }, function(){
                                $(".toast").fadeOut("slow");
                                Materialize.toast('ERRO R2 - Contate o Administrador!', 5500, 'toast-container');
                            }
                        )

                    });

                    $(".toast").fadeOut("slow");
                    Materialize.toast('Dados carregados com sucesso!', 5500, 'toast-container');
                    $("#loading").css("display", "none");
                    $("#dtAppointmentDiv").css("display", "block");
                }, function(){
                    $(".toast").fadeOut("slow");
                    Materialize.toast('ERRO R1 - Contate o Administrador!', 5500, 'toast-container');
                });              
            }
        }
    );
});
