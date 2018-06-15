angularApp.controller('logOutCtrl', function($scope, $rootScope, $state) {
   
    
        localStorage.setItem('userCode', '');
        localStorage.setItem('userToken', '');
        
        $state.go('login');
      

});