if('serviceWorker' in navigator) {
    navigator
        .serviceWorker.register('./service-worker.js', {scope: '/calendarApp/'})
        .then(function(registration) {
            /*
            Se nao tem controller, quer dizer que ele pegou direto do network, ou
            seja, ele estará com a versao mais recente do app
            */
            if(!navigator.serviceWorker.controller){
                
                return;
            }

            /*
            Se tem um serviceworker waiting to install, chame indexController._updateReady()  
            */
            if(registration.waiting){
                // indexController._updateReady();
                console.log('Tem coisa nova esperando pra instalar');
                // registration.installation.postMessage({toDo:'updateIt'});
            }
            /*
            Se tem um serviceworker instalando, track the progress. Se ficar "instalado", 
            chame indexController._updateReady() 
            */
            // if(registration.installing){
            //     indexController.trackInstalling(registration.installing);
            //     return;
            // }
            /*
            ELSE
            */
            // registration.addEventListener('updateFound', function(){
            //     indexController._trackInstalling(registration.installing);
            // });

            console.log(' new Service Worker Registered: ', registration);
        }).catch(function(error){
            console.log('falha no registro:', error);
        })
}else{
    console.log('service-worker nao suportado');
}


    // IndexController.prototype._trackInstalling = function(worker){
    //     var indexController = this;

    //     worker.addEventListener('statechange', function(){
    //         if(worker.state == 'installed'){
    //             index.Controller._updateReady();
    //         }
    //     });
    // }