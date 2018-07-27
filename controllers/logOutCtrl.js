angularApp.controller('logOutCtrl', function($scope, $rootScope, $state) {
   
    
        localStorage.removeItem('userCode');
        localStorage.removeItem('userToken');
        localStorage.removeItem('param');
        
        $state.go('welcome');
      

});