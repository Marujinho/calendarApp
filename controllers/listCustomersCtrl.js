angularApp.controller('listCustomersCtrl', function($scope, customersAPIService, $compile, $stateParams, $state, $rootScope, usersAPIService) {

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

                if($rootScope.global.permission.customer != 1){
                    $state.go('agenda');
                }

                $rootScope.local = "";
                $rootScope.titulo = 'Lista de Clientes';
                //getall clientes
                $scope.contact = [];
                customersAPIService.getall().then(function(response) {
                    $scope.listClients = response.data;

                    var table = $('#dtCustomers').DataTable({
                        dom: 'Bfrtip',
                        data: $scope.listClients,
                        columns: [
                            { title: "Id", data: "idCustomer" },
                            { title: "Cliente", data: "name" },
                            { title: "CNPJ", data: "cnpj", 
                                render: function(data) {
                                    return data.substr(0, 2)+"."+data.substr(2, 3)+"."+data.substr(5, 3)+"/"+data.substr(8, 4)+"-"+data.substr(12, 2)
                                }
                            },
                            { title: "Cidade", data: "city" }
                        ],
                        buttons: [
                            { extend: 'copy',  text: 'Copiar', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'     },
                            { extend: 'excel', text: 'Excel', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'},
                            { extend: 'pdf', text: 'PDF', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'      },
                            { extend: 'print', text:'Imprimir', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'    }
                        ],
                        columnDefs: [
                            { targets: [0, 1, 2, 3], className: 'mdl-data-table__cell--non-numeric' }
                        ],
                        initComplete: function () {
                            this.api().columns().every(function () {
                                var column = this;                   
                                if(column.index() == -1){   

                                } else {
                                var select = $('<select class="select2" multiple style="width:100%;"><option value="" style="width:100%;"></option></select>').appendTo($("#filtros").find("th").eq(column.index()))
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
                                        column.search(val ? '^' + val + '$' : '', true, false).draw();;
                                    });    
                                    $('.select2').select2();
                                    var endereco = [];
                                    column.data().unique().sort().each(function (d, j) {
                                        select.append('<option value="' + d + '" style="width:100%;">' + d + '</option>')
                                    });  
                                }    
                                                        
                            });
                        },
                        destroy: true,
                        retrieve: true,
                        colReorder: true,
                        orderCellsTop: true,
                        responsive: true,
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
                    $('.modal').modal();
                    $('.dt-button').removeClass('dt-button'); 
                    $('#dtCustomers tbody').on('click', 'tr', function() {
                        // console.log(table.row(this).data());
                        var data = table.row(this).data();
                        $scope.contact = data.contact;
                        var selectedRow = this;
                        var html = '';
                        $('#modal1').modal('open');
                        html += '<div class="modal-content">';
                        html += '       <div class="row" style="border-bottom: 1px solid #9e9e9e;">';
                        html += '           <h5 style="margin-top:5px; position:absolute;"><b>Visualização de cliente</b></h5>';
                        html += '           <div class="col s12 m2 right-align" style="float:right;">';
                        if(data.idCustomer != 1){
                            html += '               <a class="modal-action modal-close" ng-click="deleteCustomer();"><i class="material-icons red-text">delete</i></a>';
                        }
                        html += '               <a id="editarModal" ng-click="editCustomer();" class="modal-action modal-close"><i class="material-icons grey-text">mode_edit</i></a>';
                        html += '               <a class="modal-action modal-close" ng-click="closeViewCustomer();" ><i class="material-icons grey-text">close</i></a>';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row">';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="grey-text idIcon tooltipped" data-position="left" data-tooltip="ID">#</div>';
                        html += '               <div class="conteudoModais">' + data.idCustomer +'</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Cliente"><i class="material-icons grey-text">business</i></div>';
                        html += '               <div class="conteudoModais">'+ data.name + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="CNPJ"><i class="material-icons grey-text">business_center</i></div>';
                        html += '               <div class="conteudoModais">' + data.cnpj.substr(0, 2)+"."+data.cnpj.substr(2, 3)+"."+data.cnpj.substr(5, 3)+"/"+data.cnpj.substr(8, 4)+"-"+data.cnpj.substr(12, 2) + '</div>';
                        html += '           </div>';
                        $.each($scope.contact, function(key, value){
                            html += '           <div class="input-field col s12 m12">';
                            html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Nome do contato e cargo"><i class="material-icons grey-text">contact_phone</i></div>';
                            html += '               <div class="conteudoModais">'+value.name+' - '+value.position+'</div>';
                            $.each(value.telephone, function(keyTel, valueTel){
                                html += '               <div class="input-field">';
                                
                                html += '                   <div class="iconesModais tooltipped" data-position="left" data-tooltip="Número de contato"><i class="material-icons grey-text">phone</i></div>';
                                html += '                   <div class="conteudoModais">('+valueTel.number.substr(0,2)+') '+valueTel.number.substr(2,4)+'-'+valueTel.number.substr(6,5)+' - '+valueTel.type+'</div>';
                                html += '               </div>';
                            })
                            html += '           </div>';
                            $.each(value.email, function(keyMail, valueMail){
                                html += '           <div class="input-field col s12 m12">';
                                html += '                <div class="iconesModais tooltipped" data-position="left" data-tooltip="Email do contato"><i class="material-icons grey-text">email</i></div>';
                                html += '                <div class="conteudoModais">'+valueMail.email+'</div>';
                                html += '           </div>';
                            })
                        });
                        html += '           <div class="input-field col s12 m12">';
                        html += '              <div class="iconesModais tooltipped" data-position="left" data-tooltip="CEP"><i class="material-icons grey-text">explore</i></div>';
                        html += '              <div class="conteudoModais">'+ data.zipCode.substr(0, 5)+"-"+data.zipCode.substr(5, 3)+ '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Cidade"><i class="material-icons grey-text">map</i></div>';
                        html += '               <div class="conteudoModais">' +data.city + '-'+ data.state +'</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Endereço do cliente"><i class="material-icons grey-text">local_activity</i></div>';
                        html += '               <div class="conteudoModais">' +data.address + ', ' + data.number + ' - ' + data.district + ' ' + data.complement + '</div>';
                        html += '           </div>';
                        html += '       </div>';
                        html += ' </div>';

                        var compile = $compile(html);
                        compile = compile($scope);
                        $('.modal').html(compile[0]);

                        $scope.$apply(); 
                        $('.tooltipped').tooltip({delay: 50});           
                        //ir ate o id Selecionado
                        $scope.editCustomer = function() {
                            //metodo que vai para edição do item selecionado
                            $state.go('insertCustomers/:id', {
                                id: data.idCustomer
                            });
                        };
                        $scope.deleteCustomer =  function(){            
                            var remove = confirm("Confirme a exclusão");
                            if (remove == true) {
                                customersAPIService.delete(data.idCustomer);
                                table.rows($(selectedRow)).remove().draw(false);
                                Materialize.toast('O Cliente foi removido', 1500, 'toast-container');
                            } else {
                                $('#modal1').modal('close');
                            }     
                        }; 
                    });
                });
            }
        }
    )
});