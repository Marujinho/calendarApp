angularApp.controller('listProfilesCtrl', function($scope, profilesAPIService, $compile, $state, $rootScope, usersAPIService) {

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

                if($rootScope.global.permission.profile != 1){
                    $state.go('agenda');
                }

                $rootScope.local = "";
                $rootScope.titulo = 'Lista de Perfis';
                profilesAPIService.getallProfiles().then(function(response) {
                    $scope.listClients = response.data;
                    var table = $('#dtProfile').DataTable({
                        dom: 'Bfrtip',
                        data: response.data,
                        columns: [{
                                title: "Id",
                                data: "idProfile"
                            },
                            {
                                title: "Nome",
                                data: "name"
                            },
                            {
                                title: "Quant. usuários",
                                "defaultContent": 0
                            }
                        ],
                        "createdRow": function(row, data, dataIndex) {
                            profilesAPIService.getCount(data.idProfile).then(
                                function(response) {
                                    $('td', row).eq(2).text(response.data);
                                }
                            )
                        },
                        buttons: [
                            { extend: 'copy',  text: 'Copiar', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'     },
                            { extend: 'excel', text: 'Excel', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'},
                            { extend: 'pdf', text: 'PDF', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'      },
                            { extend: 'print', text:'Imprimir', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'    }
                        ],
                        columnDefs: [{
                            targets: [0, 1, 2],
                            className: 'mdl-data-table__cell--non-numeric'
                        }],
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
                    $('#dtProfile tbody').on('click', 'tr', function() {
                        var data = table.row(this).data();
                        var selectedRow = this;
                        var html = '';


                        html += '<div class="modal-content">';
                        html += '       <div class="row" style="border-bottom: 1px solid #9e9e9e;">';
                        html += '           <h5 style="margin-top:5px; position:absolute;"><b>Visualização de perfil</b></h5>';
                        html += '           <div class="col s12 m2 right-align" style="float:right;">';
                        html += '               <a class="modal-action modal-close" ng-click="deleteProfile();"><i class="material-icons red-text">delete</i></a>';
                        html += '               <a id="editarModal" ng-click="editProfile();" class="modal-action modal-close"><i class="material-icons grey-text">mode_edit</i></a>';
                        html += '               <a class="modal-action modal-close" ng-click="closeViewProfile();" ><i class="material-icons grey-text">close</i></a>';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row">';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="grey-text idIcon tooltipped" data-position="left" data-tooltip="ID">#</div>';
                        html += '               <div class="conteudoModais">' + data.idProfile +'</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Perfil"><i class="material-icons grey-text">supervisor_account</i></div>';
                        html += '               <div class="conteudoModais">'+ data.name + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Administrar Projetos"><i class="material-icons grey-text">assignment</i></div>';
                        html += data.project == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Administrar clientes"><i class="material-icons grey-text">business</i></div>';
                        html += data.customer == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Solicitar consultor"><i class="material-icons grey-text">perm_contact_calendar</i></div>';
                        html += data.requestConsultant == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Administrar perfis"><i class="material-icons grey-text">supervisor_account</i></div>';
                        html += data.profile == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Administrar usuários"><i class="material-icons grey-text">person</i></div>';
                        html += data.user == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Administrar apontamentos"><i class="material-icons grey-text">touch_app</i></div>';
                        html += data.appointment == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Visualizar relatórios"><i class="material-icons grey-text">receipt</i></div>';
                        html += data.report == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Administrar fechamento mensal"><i class="material-icons grey-text">chrome_reader_mode</i></div>';
                        html += data.closure == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Administrar Agendas"><i class="material-icons grey-text">date_range</i></div>';
                        html += data.agenda == 1 ?' <div class="conteudoModais">Sim</div>':'<div class="conteudoModais">Nao</div>';
                        html += '           </div>';
                        html += '       </div>';
                        html += ' </div>';

                        var compile = $compile(html);
                        compile = compile($scope);
                        $('#modal1').html(compile[0]);
                        $('#modal1').modal('open');
                        $('.tooltipped').tooltip({delay: 50});
                        
                        $scope.editProfile = function() {
                            $state.go('insertProfiles/:id', { id: data.idProfile });
                        };
                        
                        $scope.deleteProfile = function() {
                            var remove = confirm("Confirme a exclusão");
                            if (remove == true) {
                                profilesAPIService.delete(data.idProfile);
                                table.rows($(selectedRow)).remove().draw(false);
                                Materialize.toast('Perfil removido :(', 1500, 'toast-container');
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