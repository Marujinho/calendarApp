angularApp.service('holidayAPIService', function($http, $rootScope) {

    let _getallHoliday = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/holiday/getall',
            data: {
                "token" : localStorage.getItem('userToken')
            }
        });
    };

    let _getbyid = function(id) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/holiday/getbyid',
            data:{
                idHoliday: id,
                token: localStorage.getItem('userToken')
            }
        });
    };

    let _saveHoliday = function(holiday) {
        if (holiday.finalDate != undefined) {
            delete holiday.finalDate;
        }
        holiday.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/holiday/save',
            data: {
                holiday:holiday,
                token:localStorage.getItem('userToken')
            }
        });
    };
    let _delete = function(idHoliday) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/holiday/delete',
            data: {
                idHoliday: idHoliday,
                login: $rootScope.global.idUser,
                token: localStorage.getItem('userToken')
            }
        });
    };
    return {
        delete: _delete,
        getall: _getallHoliday,
        save: _saveHoliday,
        getbyid: _getbyid
    };
});