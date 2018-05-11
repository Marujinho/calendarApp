angularApp.factory('ControleDeLogin', ['$q','$location','$injector', function($q, $location, $injector) {
    return {
      request: function (config) {

        var $rootScope = $injector.get("$rootScope");

        if(!$rootScope.global){
            var $http = $injector.get("$http");

            $rootScope.global = {
                link: "https://deveasyprojectapi.iv2.com.br/EasyCalendar-1.0.0"
            }

            console.log($rootScope.global);

            return $http({
                method: 'POST',
                url: $rootScope.global.link + '/user/login',
                data: {
                    code: WCMAPI.userCode
                }
            }).then(
                function(responseUser) {
            //         if (responseUser.data[0] == "" || responseUser.data[0] == null) {
            //             var local = window.location.href;
            //             local = local.split("portal");
            //             alert("Você não tem acesso ao Easy Calendar");
            //             window.location.href = local[0];
            //         } else {
            //             $rootScope.global.idUser = responseUser.data[0].idUser;
            //             $rootScope.global.code = responseUser.data[0].code;
            //             $rootScope.global.permission = {
            //                 profile: responseUser.data[0].profileId.profile,
            //                 user: responseUser.data[0].profileId.user,
            //                 customer: responseUser.data[0].profileId.customer,
            //                 project: responseUser.data[0].profileId.project,
            //                 agenda: responseUser.data[0].profileId.agenda, 
            //                 requestConsultant: responseUser.data[0].profileId.requestConsultant, 
            //                 appointment: responseUser.data[0].profileId.appointment, 
            //                 report: responseUser.data[0].profileId.report,  
            //                 closure: responseUser.data[0].profileId.closure
            //             }
            //            
            //         }
                return config;
                }
            )
        }
       
      },
      responseError: function (error) {
        return $q.reject(error)
      }
    }
  }])