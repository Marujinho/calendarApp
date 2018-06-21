angularApp.service('closingDateAPIService', function($http, $rootScope) {

    let _getallClosingDate = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/closingDate/getall',
            data: {
                "token" : localStorage.getItem('userToken')
            }
        });
    };
    let _saveClosingDate = function(idClosingDate) {
        idClosingDate.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/closingDate/save',
            data: {
                idClosingDate:idClosingDate,
                token:localStorage.getItem('userToken')
            }
        });
    };
    return {
        getall: _getallClosingDate,
        save: _saveClosingDate
    };
});