angularApp.service('usersAPIService', function($http, $rootScope) {

    let _getAllUser = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/getall',
            data: {
                "token" : localStorage.getItem('userToken')
            }
        });
    };

    let _saveUser = function(user) {
        user.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/save',
            data: {
                user:user,
                token:localStorage.getItem('userToken')
            }
        });
    };

    let _deleteUser = function(idUser) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/delete',
            data: {
                idUser: idUser,
                login: $rootScope.global.idUser,
                token:localStorage.getItem('userToken')
            }
        });
    };

    let _getByIdUser = function(idUser) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/getbyid',
            data: {
                idUser: idUser,
                token: localStorage.getItem('userToken')
            }
        });
    };
    
    let _login = function(code) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/login',
            data: {
                code: code,
                token: localStorage.getItem('userToken')
            }
        });
    };

    return {
        delete: _deleteUser,
        getall: _getAllUser,
        save: _saveUser,
        getByIdUser: _getByIdUser,
        login: _login
    }

});