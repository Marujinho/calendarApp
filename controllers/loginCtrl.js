angularApp.controller('loginCtrl', function($scope, $rootScope, $state, $stateParams, usersAPIService) {
  
      $scope.param = $stateParams;

    if($scope.param != '' && $scope.param != null){

      var hash = $scope.param.id.split('Y2lqZXZqZWRvYnJh'); 
      var hashCode = hash[0];
      var hashToken = hash[1].replace('cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg','');

      var userCode = atob(hashCode);
      var userToken = atob(hashToken);

      
      //TEST IDB
      var calendarDb = idb.open('calendarDb2', 1, function(upgradeDb){

        var keyValStore = upgradeDb.createObjectStore('user2');
        keyValStore.put(userCode, 'userCode2');
        keyValStore.put(userToken, 'userToken2');

      });
      localStorage.setItem('userToken', userToken);
     
      //FIM TESTE

      // $scope.someData = localStorage.getItem('userCode');
      // $scope.someData2 = localStorage.getItem('userToken');

      setTimeout(() => {
        $state.go('agenda');
      }, 1500);
    
  }

});




