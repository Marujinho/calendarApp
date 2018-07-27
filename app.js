if('serviceWorker' in navigator) {
    navigator
        .serviceWorker.register('./service-worker.js', {scope: '/release/'})
        .then(function(registration) {
           
            console.log(' new Service Worker Registered: ', registration);
        }).catch(function(error){
            console.log('falha no registro:', error);
        })
}else{
    console.log('service-worker nao suportado');
}

    // navigator.serviceWorker.addEventListener('controllerchange', function(){
    //     window.location.reload();
    // })