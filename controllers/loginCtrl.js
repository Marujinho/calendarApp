angularApp.controller('loginCtrl', function($scope, $rootScope, $state, $stateParams) {
   
    alert('oi');
    
    // var i = {"code": WCMAPI.userCode, "token": "dev3-ks4d-as42-83hk"};

    // var hash1 = window.btoa(i.code);
    // var hash2 = window.btoa(i.token);
    // var qrcode = new QRCode(document.getElementById("qrcode"), {
    // text: 'https://marujinho.github.io/calendarApp#!/login/'+hash1+'Y2lqZXZqZWRvYnJh'+hash2+'cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg'
    //  });
      //hash1 = usercode
      //hash2 = token


    $scope.param = $stateParams;
  
      var hash = $scope.param.id.split('Y2lqZXZqZWRvYnJh'); 
      var hashCode = hash[0];
      var hashToken = hash[1].replace('cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg','');
    
    localStorage.setItem('userCode', atob(hashCode));
    localStorage.setItem('userToken', atob(hashToken));

    $state.go('agenda');
  
      
    
    

    //LEITOR DE QR CODE PARA ANDROID

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