angularApp.controller('loginCtrl', function($scope, $rootScope, $state, $stateParams, usersAPIService) {
  

      $scope.param = $stateParams;
  
      var hash = $scope.param.id.split('Y2lqZXZqZWRvYnJh'); 
      var hashCode = hash[0];
      var hashToken = hash[1].replace('cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg','');
    

    localStorage.setItem('userCode', atob(hashCode));
    localStorage.setItem('userToken', atob(hashToken));
    alert('userCode ' + atob(hashCode));
    
    setTimeout(() => {
      $state.go('agenda');
    }, 1500);
     
});