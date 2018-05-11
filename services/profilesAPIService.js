angularApp.service('profilesAPIService', function($http, $rootScope) {
    let _getallProfiles = function() {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/profile/getall',

        });
    };

    let _saveProfile = function(profile) {
        profile.login = $rootScope.global.idUser;
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/profile/save',
            data: profile
        });
    };

    let _getById = function(idProfile) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/profile/getbyid',
            data: {
                "idProfile": idProfile
            }
        });
    };

    let _getCount = function(idProfile) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/profile/count',
            data: {
                "idProfile": idProfile
            }
        });
    };

    let _deleteProfile = function(idProfile) {
        return $http({
            method: 'POST',
            url: $rootScope.global.link + '/profile/delete',
            data: {
                idProfile: idProfile,
                login: $rootScope.global.idUser
            }
        });
    };

    return {
        getallProfiles: _getallProfiles,
        saveProfile: _saveProfile,
        getById: _getById,
        getCount: _getCount,
        delete: _deleteProfile
    }

});