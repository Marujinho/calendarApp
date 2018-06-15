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
    alert($scope.param.id);

      var obj = $scope.param.id.replace('Y2lqZXZqZWRvYnJh', ' ');
      var obj2 = obj.replace('cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg',' ');
      var obj3 = atob(obj2);
      var obj4 = JSON.stringify(obj3);
      var obj5 = obj4.split(" ");
    
    
    localStorage.setItem('userCode', obj5[0]);
    localStorage.setItem('userToken', obj5[1]);

    alert(obj5[0]);
    alert(obj5[1]);

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