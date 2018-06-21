angularApp.service('customersAPIService', function($http, $rootScope) {

    let _getallCustomers = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/customer/getall',
            data: {
                "token" : localStorage.getItem('userToken')
            }
        });
    };

    let _getByIdCust = function(idCustomer) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/customer/getbyid',
            data: {
                idCustomer: idCustomer,
                token:localStorage.getItem('userToken')
            }

        });
    };

    let _saveCustomers = function(customer) {
        customer.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/customer/save',
            data: {
                customer:customer,
                token:localStorage.getItem('userToken')
            }
        });
    };

    let _delete =  function(idCustomer){
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/customer/delete',
            data: {
                idCustomer: idCustomer,
                login: $rootScope.global.idUser,
                token:localStorage.getItem('userToken')
            }
        });      
    };

    return {
        delete: _delete,
        getByIdCust: _getByIdCust,
        getall: _getallCustomers,
        save: _saveCustomers,
    }

});