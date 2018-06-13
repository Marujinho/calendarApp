angularApp.service('usersAPIService', function($http, $rootScope) {

    let _getAllUser = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/getall',
            data: {}
        });
    };

    let _saveUser = function(user) {
        user.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/save',
            data: user
        });
    };

    let _deleteUser = function(idUser) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/delete',
            data: {
                idUser: idUser,
                login: $rootScope.global.idUser
            }
        });
    };

    let _getByIdUser = function(idUser) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/getbyid',
            data: {
                idUser: idUser,
            }

        });
    };
    
    let _login = function(code) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/user/login',
            token: localStorage.getItem('userToken'),
            data: {
                code: code
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