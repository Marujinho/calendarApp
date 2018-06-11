angularApp.controller('loginCtrl', function($scope, $rootScope) {
  

    let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    scanner.addListener('scan', function (content) {
      console.log(content);
      alert(content);
    });
    Instascan.Camera.getCameras().then(function (cameras) {
      if (cameras.length > 0) {
        scanner.start(cameras[1]);
      } else {
        console.error('No cameras found.');
      }
    }).catch(function (e) {
      console.error(e);
    });
  
  
  
    // //necessario para remover o search customizado
    // $.fn.dataTable.ext.search.splice(0, 2);
    // //---
    // $rootScope.local = "";
});