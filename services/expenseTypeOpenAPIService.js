angularApp.service('expenseTypeOpenAPIService', function($http, $rootScope) {
    
    let _getall = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/expenseOpenType/getall',
        });
    };

    return {
        getall: _getall
    }

});