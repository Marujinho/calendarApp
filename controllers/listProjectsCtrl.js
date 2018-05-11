angularApp.controller('listProjectsCtrl', function($scope, projectsAPIService, $compile, $stateParams, $state, $rootScope, usersAPIService) {

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

                if ($rootScope.global.permission.project != 1) {
                    $state.go('agenda');
                }

                $rootScope.local = "";
                projectsAPIService.getall().then(function(response) {
                    $scope.tipoProjeto = [];
                    $scope.tipoDespesa = [];
                    var table = $('#dtProjects').DataTable({
                        dom: 'Bfrtip',
                        data: response.data,
                        columns: [
                            { title: "Id", data: "idProject" },
                            { title: "Projeto", data: "name" },
                            { title: "Cliente", data: "customerId.name" },
                            {
                                title: "Tipo de Projeto",
                                data: "projectType",
                                render: function(data) {
                                    switch (data) {
                                        case 0:
                                            return "Projeto Aberto";
                                        case 1:
                                            return "Projeto Fechado";
                                        case 2:
                                            return "Banco de Horas";
                                        case 3:
                                            return "Suporte";
                                    }
                                }
                            },
                            {
                                title: "Tipo de Despesa",
                                data: "expenseType",
                                render: function(data) {
                                    switch (data) {
                                        case 0:
                                            return "Despesa Aberta";
                                        case 1:
                                            return "Despesa Fechada";
                                    }
                                }
                            }

                        ],
                        buttons: [
                            { extend: 'copy', text: 'Copiar', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2' },
                            { extend: 'excel', text: 'Excel', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2' },
                            { extend: 'pdf', text: 'PDF', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2' },
                            { extend: 'print', text: 'Imprimir', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2' }
                        ],
                        columnDefs: [{
                            targets: [0, 1],
                            className: 'mdl-data-table__cell--non-numeric'
                        }],
                        initComplete: function() {
                            this.api().columns().every(function() {
                                var column = this;
                                if (column.index() == -1) {

                                } else {
                                    var select = $('<select class="select2" multiple style="width:100%;"><option value="" style="width:100%;"></option></select>').appendTo($("#filtros").find("th").eq(column.index()))
                                        .on('change', function() {
                                            var list = $(this).val();
                                            var val = '';
                                            if (list != null) {
                                                for (var i = 0; i < list.length; i++) {

                                                    val += $.fn.dataTable.util.escapeRegex(list[i]);
                                                    if (i != list.length - 1) {
                                                        val += "|"
                                                    }
                                                }
                                            }
                                            column.search(val ? '^' + val + '$' : '', true, false).draw();;
                                        });
                                    $('.select2').select2();
                                    var endereco = [];
                                    var tipoProjeto = [];
                                    var tipoDespesa = [];
                                    column.data().unique().sort().each(function(d, j) {
                                        if (column.index() == 3) {
                                            if (tipoProjeto.indexOf(d) == -1) {
                                                tipoProjeto.push(d);
                                                switch (d) {
                                                    case 0:
                                                        select.append('<option value="Projeto Aberto" style="width:100%;">Projeto Aberto</option>');
                                                        break;
                                                    case 1:
                                                        select.append('<option value="Projeto Fechado" style="width:100%;">Projeto Fechado</option>');
                                                        break;
                                                    case 2:
                                                        select.append('<option value="Banco de Horas" style="width:100%;">Banco de Horas</option>');
                                                        break;
                                                    case 3:
                                                        select.append('<option value="Suporte" style="width:100%;">Suporte</option>');
                                                        break;
                                                }
                                            }
                                        }else if(column.index() == 4){
                                            if (tipoDespesa.indexOf(d) == -1) {
                                                tipoDespesa.push(d);
                                                switch (d) {
                                                    case 0:
                                                        select.append('<option value="Despesa Aberta" style="width:100%;">Despesa Aberta</option>');
                                                        break;
                                                    case 1:
                                                        select.append('<option value="Despesa Fechada" style="width:100%;">Despesa Fechada</option>');
                                                        break;
                                                }
                                            }
                                        } else {
                                            select.append('<option value="' + d + '" style="width:100%;">' + d + '</option>');
                                        }
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
                    $('.dt-button').removeClass('dt-button');
                    $('.modal').modal();
                    $('.modal').css('margin-top', '50px');

                    $('#dtProjects tbody').on('click', 'tr', function() {
                        // console.log(table.row(this).data());
                        var data = table.row(this).data();
                        var selectedRow = this;
                        var html = '';
                        $('#modal1').modal('open');
                        html += '<div class="modal-content">';
                        html += '       <div class="row" style="border-bottom: 1px solid #9e9e9e;">';
                        html += '           <h5 style="margin-top:5px; position:absolute;"><b>Visualização de projeto</b></h5>';
                        html += '           <div class="col s12 m2 right-align" style="float:right;">';
                        html += '               <a class="modal-action modal-close" ng-click="deleteProject();"><i class="material-icons red-text">delete</i></a>';
                        html += '               <a id="editarModal" ng-click="editProject();" class="modal-action modal-close"><i class="material-icons grey-text">mode_edit</i></a>';
                        html += '               <a class="modal-action modal-close" ng-click="closeViewProject();" ><i class="material-icons grey-text">close</i></a>';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row">';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="grey-text idIcon tooltipped" data-position="left" data-tooltip="ID">#</div>';
                        html += '               <div class="conteudoModais">' + data.idProject + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Projeto"><i class="material-icons grey-text">assignment</i></div>';
                        html += '               <div class="conteudoModais">' + data.name + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Responsável pelo projeto"><i class="material-icons grey-text">person</i></div>';
                        html += '               <div class="conteudoModais">' + data.responsible + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '              <div class="iconesModais tooltipped" data-position="left" data-tooltip="Cep"><i class="material-icons grey-text">explore</i></div>';
                        html += '              <div class="conteudoModais">' + data.zipCode.substr(0, 5) + '-' + data.zipCode.substr(5, 3) + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Cidade"><i class="material-icons grey-text">map</i></div>';
                        html += '               <div class="conteudoModais">' + data.city + '-' + data.state + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Endereço"><i class="material-icons grey-text">local_activity</i></div>';
                        html += '               <div class="conteudoModais">' + data.address + ', ' + data.number + ' - ' + data.district + ' ' + data.complement + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Horas de projeto"><i class="material-icons grey-text">timer</i></div>';
                        html += '               <div class="conteudoModais">' + data.hours + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Tipo de projeto"><i class="material-icons grey-text">storage</i></div>';
                        var projectType = "";
                        switch (data.projectType) {
                            case 0:
                                projectType = "Projeto Aberto";
                                break;
                            case 1:
                                projectType = "Projeto Fechado";
                                break;
                            case 2:
                                projectType = "Banco de horas";
                                break;
                            case 3:
                                projectType = "Suporte";
                                break;
                        }
                        html += '               <div class="conteudoModais">' + projectType + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Valor do projeto"><i class="material-icons grey-text">attach_money</i></div>';
                        html += '               <div class="conteudoModais">R$:' + data.projectCost.replaceAll(".", ",") + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Valor horas GP"><i class="material-icons grey-text">attach_money</i></div>';
                        html += '               <div class="conteudoModais"> R$:' + data.hourGPCost.replaceAll(".", ",") + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Valor horas Recurso"><i class="material-icons grey-text">attach_money</i></div>';
                        html += '               <div class="conteudoModais"> R$:' + data.hourConsultantCost.replaceAll(".", ",") + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Horas de traslado"><i class="material-icons grey-text">airplanemode_active</i></div>';
                        html += '               <div class="conteudoModais">' + data.transfer + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Valor e tipo de despesa"><i class="material-icons grey-text">monetization_on</i></div>';
                        var txtDespesa = '';
                        switch (data.expenseType) {
                            case 0:
                                txtDespesa = 'Despesa Aberta';
                                break;
                            case 1:
                                txtDespesa = 'Despesa Fechada';
                                break;
                        }
                        html += '               <div class="conteudoModais">' + txtDespesa + ' -   R$: ' + data.expense.replaceAll(".", ",") + '</div>';
                        html += '           </div>';
                        html += '       </div>';
                        html += ' </div>';


                        var compile = $compile(html);
                        compile = compile($scope);
                        $('.modal').html(compile[0]);
                        //ir ate o id Selecionado
                        $('.tooltipped').tooltip({ delay: 50 });
                        $scope.editProject = function() {
                            //metodo que vai para edição do item selecionado
                            $state.go('insertProjects/:id', { id: data.idProject });
                            $('.modal').css('margin-top', '50px');
                        };
                        $scope.closeViewProject = function() {
                            $('.modal').css('margin-top', '50px');
                        };
                        $scope.deleteProject = function() {
                            var remove = confirm("Confirme a exclusão");
                            if (remove == true) {
                                projectsAPIService.delete(data.idProject);
                                table.rows($(selectedRow)).remove().draw(false);
                                Materialize.toast('O Projeto foi removido', 1500, 'toast-container');
                            } else {
                                $('#modal1').modal('close');
                            }
                        };
                    });
                })


                $rootScope.titulo = 'Lista de Projetos';
            }
        }
    )
})