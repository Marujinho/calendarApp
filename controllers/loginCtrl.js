angularApp.controller('loginCtrl', function($scope, $rootScope, $state, $stateParams, usersAPIService) {
  
    $scope.param = $stateParams;

    if($scope.param != '' && $scope.param != null){

      var hash = $scope.param.id.split('Y2lqZXZqZWRvYnJh'); 
      var hashCode = hash[0];
      var hashToken = hash[1].replace('cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg','');

      var userCode = atob(hashCode);
      var userToken = atob(hashToken);

      localStorage.setItem('userCode', userCode);
      localStorage.setItem('userToken', userToken);

      setTimeout(() => {
        $state.go('agenda', {param: localStorage.getItem('param')});
      }, 1500);
    
  }

});




