angularApp.service('expenseTypeOpenAPIService', function($http, $rootScope) {
    
    let _getall = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/expenseOpenType/getall',
            data: {
                "token" : localStorage.getItem('userToken')
            }
        });
    };

    return {
        getall: _getall
    }

});