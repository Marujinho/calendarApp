angularApp.service('projectsAPIService', function($http, $rootScope) {

    let _getallProjects = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/project/getall',

        });
    };
    let _saveProjects = function(projects) {
        projects.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/project/save',
            data: projects
        });
    };

    let _getByIdProject = function(idProject) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/project/getbyid',
            data: {
                idProject: idProject
            }
        });
    };

    let _delete =  function(idProject){
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/project/delete',
            data: {
                idProject: idProject,
                login: $rootScope.global.idUser
            }
        });      
    };
    let _getbyCustomer =  function(idCustomer){
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/project/getbycustomer',
            data: {
                "idCustomer":idCustomer
            }
        });
    };

    return {
        delete: _delete,
        getbyCustomer: _getbyCustomer,
        getall: _getallProjects,
        save: _saveProjects,
        getByIdProject: _getByIdProject
    }
});