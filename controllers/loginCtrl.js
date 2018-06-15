angularApp.controller('loginCtrl', function($scope, $rootScope, $state, $stateparams ) {
   
    alert('oi');
    
    $scope.param = $stateparams;
    alert($scope.param);
    
      var obj = $scope.param.id.replace('Y2lqZXZqZWRvYnJh', '');
      var obj2 = obj.replace('cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg','');

      alert(obj2);
    
    

    //LEITOR DE QR CODE

    // let scanner = new Instascan.Scanner({ 
    //   video: document.getElementById('preview'), 
    //   mirror: false
    // });
    
    // scanner.addListener('scan', function (content) {
    
    //   if(content != ''||content != NULL ){
        
    //     var parsedContent = JSON.parse(content);

    //     var userCode = parsedContent.code;
    //     var userToken = parsedContent.token;
        
    //     localStorage.setItem('userCode', userCode);
    //     localStorage.setItem('userToken', userToken);

        
    //       scanner.stop().then(function () {
    //         $state.go('agenda')
    //       })
        
    //   }else{
    //     alert('erro na leitura do QR Code');
    //   }
    // });

    // Instascan.Camera.getCameras().then(function (cameras) {
    //   if (cameras.length > 0) {
        
    //     if(cameras.length > 1){
    //       scanner.start(cameras[1]);  
    //     }else{
    //       scanner.start(cameras[0]);
    //     }        
        
    //   } else {
    //     console.error('No cameras found.');
    //   }
    // }).catch(function (e) {
    //   console.error(e);
    // });
     
});