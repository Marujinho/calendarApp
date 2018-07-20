angularApp.controller('loginCtrl', function($scope, $rootScope, $state, $stateParams, usersAPIService) {
  
    //TEST IDB
    var thePromise = idb.open('teste', 1, function(upgradeDb){

      // var keyValStore = upgradeDb.createObjectStore('keyval');
      // keyValStore.put('val', 'key');
      // keyValStore.put('Douglas', 'first');

    });

    thePromise.then(function(db){
      var tx = db.transaction('keyval');
      var keyValStore = tx.objectStore('keyval');
      return keyValStore.get('whoreHouse');
      }).then(function(val){
      alert(val);  
    });

  //FIM TESTE




      $scope.param = $stateParams;

    if($scope.param != '' && $scope.param != null){

      var hash = $scope.param.id.split('Y2lqZXZqZWRvYnJh'); 
      var hashCode = hash[0];
      var hashToken = hash[1].replace('cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg','');
    
      localStorage.setItem('userCode', atob(hashCode));
      localStorage.setItem('userToken', atob(hashToken));
    
      
      $scope.someData = localStorage.getItem('userCode');
      $scope.someData2 = localStorage.getItem('userToken');

      setTimeout(() => {
        $state.go('agenda');
      }, 1500);
    
  }

});




