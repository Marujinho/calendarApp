angularApp.controller('loginCtrl', function($scope, $rootScope, $state) {
   
    $rootScope.titulo = "QR Code";

    $scope.logOut = function(){
      localStorage.setItem('userCode', '');
      localStorage.setItem('userToken', '');
      $state.go('login');
    }


    let scanner = new Instascan.Scanner({ 
      video: document.getElementById('preview'), 
      mirror: false
    });
    
    scanner.addListener('scan', function (content) {
    
      if(content != ''||content != NULL ){
        
        var parsedContent = JSON.parse(content);

        var userCode = parsedContent.code;
        var userToken = parsedContent.token;
        
        localStorage.setItem('userCode', userCode);
        localStorage.setItem('userToken', userToken);

        
          scanner.stop().then(function () {
            $state.go('agenda')
          })
        
      }else{
        alert('erro na leitura do QR Code');
      }
    });

    Instascan.Camera.getCameras().then(function (cameras) {
      if (cameras.length > 0) {
        
        if(cameras.length > 1){
          scanner.start(cameras[1]);  
        }else{
          scanner.start(cameras[0]);
        }        
        
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