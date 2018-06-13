angularApp.service('appointmentAPIService', function($http, $rootScope) {

    //getall APPOINTMENT
    let _getallAppointment = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/getall',
        });
    };

    let _saveAgenda = function(appointment) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/save',
            data: {
                list: appointment,
                login: $rootScope.global.idUser
            }
        });
    };

    let _update = function(appointment) {
        appointment.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/update',
            data: appointment
        });
    };

    let _updateParticular = function(appointment) {
        appointment.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/updateParticular',
            data: appointment
        });
    };

    let _updateFerias = function(appointment) {
        appointment.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/updateFerias',
            data: appointment
        });
    };

    let _insertAppointment = function(appointment) {
        appointment.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/insertAppointment',
            data: appointment
        });
    };

    let _getById = function(idAppointment) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/getbyid',
            data: {
                "idAppointment": idAppointment,
                "token"        : token: localStorage.getItem('userToken') 
            }
        });
    };

    let _getByUser = function(idUser) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/getbyuser',
            token:localStorage.getItem('userToken'),
            data: {
                "idUser": idUser,
                "token" : token: localStorage.getItem('userToken')
            }
        });
    };

    let _getrequestByAppointment = function(id) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/requestappointment/getbyidappointment',
            data: {
                "idAppointment": id
            }
        });
    };

    let _delete = function(idAppointment) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/delete',
            data: {
                idAppointment: idAppointment,
                login: $rootScope.global.idUser
            }
        });
    };

    let _getmonthappointment = function(month, year) {

        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/getcurrentmonth',
            data: {
                "month": month,
                "year": year
            }
        });
    };
    let _sendMail = function(val) {

        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/email/sendMult',
            data: val
        });
    };

    ///APROVACAO DE ATRASADOS
    let _acceptLate = function(idAppointment){
        
        return $http({
            method:'POST',
            url: $rootScope.global.link+'/appointment/acceptlate',
            data:{
                idAppointment: idAppointment,
                login:$rootScope.global.idUser
            }
        });
    };

    let _deleteLate =  function(idAppointment){
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/refuselate',
            data:{
                idAppointment: idAppointment,
                login:$rootScope.global.idUser
            }

        });
    };

    let _getFromRangeDate = function(initialDate, lastDate){
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/appointment/getfromrangedate',
            data:{
                initialDate: initialDate,
                lastDate: lastDate
            }
        });
    };

    return {
        acceptLate: _acceptLate,
        deleteLate: _deleteLate,
        sendMail: _sendMail,
        update: _update,
        updateParticular: _updateParticular,
        updateFerias: _updateFerias,
        delete: _delete,
        getallAppointment: _getallAppointment,
        getById: _getById,
        saveAgenda: _saveAgenda,
        insertAppointment: _insertAppointment,
        getmonthappointment: _getmonthappointment,
        getByUser: _getByUser,
        getrequestByAppointment: _getrequestByAppointment,
        sendMail: _sendMail,
        getFromRangeDate: _getFromRangeDate
    }
});