angularApp.controller('listUsersCtrl', function($scope, usersAPIService, $compile, $state, $stateParams, $rootScope) {

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

                if($rootScope.global.permission.user != 1){
                    $state.go('agenda');
                }

                $rootScope.local = "";
                $rootScope.titulo = 'Usuários'

                usersAPIService.getall().then(function(response) {
                    $scope.listClients = response.data;
                    var table = $('#dtUsers').DataTable({
                        dom: 'Bfrtip',
                        data: response.data,
                        columns: [
                            {   title:  "Id",   data: "idUser"},
                            {   title:  "Recurso",    data: "name"},
                            {   title:  "CPF/CNPJ", data:"cpfcnpj", 
                                render: function(data) {
                                    return data.substr(0, 3)+"."+data.substr(3, 3)+"."+data.substr(6, 3)+"-"+data.substr(9, 2)
                                }
                            },
                            {   title:  "RG",   data:"rg", 
                                render:function(data){
                                    return data.substr(0,2)+'.'+data.substr(2,3)+'.'+data.substr(5,3)+'-'+data.substr(7,1)
                                }
                            },
                            {   title:  "Aniversário",  data:"birthDay", 
                                render:function(data){
                                    return moment(data).format('DD/MM/YYYY')
                                }
                            },
                            {   title:  "E-mail",   data:"email"},
                            {   title:  "Telefone",  data:"telephone"},
                            
                        ],
                        buttons: [
                            { extend: 'copy',  text: 'Copiar', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'     },
                            { extend: 'excel', text: 'Excel', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'},
                            { extend: 'pdf', text: 'PDF', className: 'waves-effect white btn z-depth-0 grey-text text-darken-2'}
                        ],
                        columnDefs: [{
                            targets: [0, 1],
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
                    $('.dt-button').removeClass('dt-button'); 
                    $('.modal').modal();
                    $('#dtUsers tbody').on('click', 'tr', function() {
                        var data = table.row(this).data();
                        var html = '';
                        var selectedRow = this;
                        $('#modal1').modal('open');

                        html += '<div class="modal-content">';
                        html += '       <div class="row" style="border-bottom: 1px solid #9e9e9e;">';
                        html += '           <h5 style="margin-top:5px; position:absolute;"><b>Visualização de usuário</b></h5>';
                        html += '           <div class="col s12 m2 right-align" style="float:right;">';
                        html += '               <a class="modal-action modal-close" ng-click="deleteUser();"><i class="material-icons red-text">delete</i></a>';
                        html += '               <a id="editarModal" ng-click="editUsers();" class="modal-action modal-close"><i class="material-icons grey-text">mode_edit</i></a>';
                        html += '               <a class="modal-action modal-close" ng-click="closeViewUsers();" ><i class="material-icons grey-text">close</i></a>';
                        html += '           </div>';
                        html += '       </div>';
                        html += '       <div class="row">';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="grey-text idIcon tooltipped" data-position="left" data-tooltip="ID">#</div>';
                        html += '               <div class="conteudoModais">' + data.idUser +'</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Usuário"><i class="material-icons grey-text">business</i></div>';
                        html += '               <div class="conteudoModais">'+ data.name + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="CPF ou CNPJ"><i class="material-icons grey-text">recent_actors</i></div>';
                        html += '               <div class="conteudoModais">' + data.cpfcnpj.substr(0,3)+'.'+data.cpfcnpj.substr(3, 3)+'.'+data.cpfcnpj.substr(6, 3)+'-'+data.cpfcnpj.substr(9, 2) + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="RG"><i class="material-icons grey-text">perm_identity</i></div>';
                        html += '               <div class="conteudoModais">' + data.rg.substr(0,2)+'.'+ data.rg.substr(2,3)+'.'+ data.rg.substr(5,3)+'-'+ data.rg.substr(8,1) + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="SALÁRIO"><i class="material-icons grey-text">attach_money</i></div>';
                        html += '               <div class="conteudoModais">' + data.remuneration + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Data de aniversário"><i class="material-icons grey-text">cake</i></div>';
                        html += '               <div class="conteudoModais">' + moment(data.birthDay).format('DD/MM/YYYY') + '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Perfil"><i class="material-icons grey-text">supervisor_account</i></div>';
                        html += '               <div class="conteudoModais">' + data.profileId.name+ '</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Telefone"><i class="material-icons grey-text">phone</i></div>';
                        html += '               <div class="conteudoModais">(' +data.telephone.substr(0, 2)+") "+ data.telephone.substr(2, 4)+'-'+data.telephone.substr(6, 5)+'</div>';
                        html += '           </div>';
                        html += '           <div class="input-field col s12 m12">';
                        html += '               <div class="iconesModais tooltipped" data-position="left" data-tooltip="Email"><i class="material-icons grey-text">email</i></div>';
                        html += '               <div class="conteudoModais">' + data.email+ '</div>';
                        html += '           </div>';
                        html += '       </div>';
                        html += ' </div>';

                        var compile = $compile(html);
                        compile = compile($scope);
                        $('.modal').html(compile[0]);
                        $('.tooltipped').tooltip({delay: 50}); 

                        $scope.editUsers = function() {
                            $state.go('insertUsers/:id', { id: data.idUser });
                        };
                        $scope.deleteUser = function() {
                            var remove = confirm("Confirme a exclusão");
                            if (remove == true) {
                                usersAPIService.delete(data.idUser);
                                table.rows($(selectedRow)).remove().draw(false);
                                Materialize.toast('Usuário removido :(', 1500, 'toast-container');
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