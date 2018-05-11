angularApp.service('calendarRequestAPIService', function($http, $rootScope) {

    let _getAll = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/calendarRequest/getall',
        });
    };
    let _save = function(request) {
        if (request.lastDate != undefined) {
            delete request.lastDate;
        }
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/calendarRequest/save',
            data: {
                list: request,
                login: $rootScope.global.idUser
            }
        });
    };
    let _delete = function(idCalendarRequest) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/calendarRequest/delete',
            data: {
                idCalendarRequest: idCalendarRequest,
                login: $rootScope.global.idUser
            }
        });
    };
    let _getById = function(idCalendarRequest) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/calendarRequest/getbyid',
            data: {
                idCalendarRequest: idCalendarRequest
            }
        });
    };

    return {
        getById : _getById,
        delete: _delete,
        getall: _getAll,
        save: _save
    };
});