if('serviceWorker' in navigator) {
    navigator
        .serviceWorker.register('./service-worker.js', {scope: '/calendarApp/'})
        .then(function(registration) {
            console.log('atual yay Service Worker Registered: ', registration);
        }).catch(function(error){
            console.log('falha no registro:', error);
        })
}else{
    console.log('service-worker nao suportado');
}
