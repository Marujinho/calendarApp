angularApp.controller('mobileCtrl', function ($scope, $rootScope) {

    $rootScope.titulo = 'Habilitar Mobile';
    
    var i = {"code": WCMAPI.userCode, "token": $rootScope.global.token};

    var hash1 = window.btoa(i.code);
    var hash2 = window.btoa(i.token);
    var qrcode = new QRCode(document.getElementById("qrcode"), {
		text: 'https://marujinho.github.io/calendarApp#!/login/'+hash1+'Y2lqZXZqZWRvYnJh'+hash2+'cGVyYXdhdGFua2Vsb21wb2twcm9wZXJ0aWl2Mg'
	});
    
    qrcode.makeCode();
    

});