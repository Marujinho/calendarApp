angularApp.service('closingDateAPIService', function($http, $rootScope) {

    let _getallClosingDate = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/closingDate/getall',
        });
    };
    let _saveClosingDate = function(idClosingDate) {
        idClosingDate.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/closingDate/save',
            data: idClosingDate
        });
    };
    return {
        getall: _getallClosingDate,
        save: _saveClosingDate
    };
});