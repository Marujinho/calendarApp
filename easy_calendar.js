var MyWidget = SuperWidget.extend({
    //variáveis da widget
    variavelNumerica: null,
    variavelCaracter: null,

    //método iniciado quando a widget é carregada
    init: function() {
       if (!this.isEditMode){
        $('#wcm_header').hide();
            //versionamento de js
        $("script").each(function() {
            var url = $(this).context.src + "&version=v1";
            $(this).attr("src", url);
            // console.log($(this).context.src);
        });
        //versionamento de css
        $("link").each(function() {
            var url = $(this).context.href + "?version=v1";
            $(this).attr("href", url);
            // console.log($(this).context.src);
        });
        //NÃO REMOVER ESTE ITEM ELE OCULTA A BARRA DO FLUIG
        $('.wcm-header-background').remove();
        $(".fl-header").remove();
        $(".menu-main").remove();

        var urlFluig = window.location.href;
        urlFluig = urlFluig.split("portal")
        $("#fluig").attr("href", urlFluig[0]);

        ///////////////////////////////////////////////////
    function toasty(message, time) {

        var x = document.getElementById("snackbar");
        x.innerHTML = message;
        x.className = "show";
        setTimeout(function() {
            x.className = x.className.replace("show", "");
        }, time);
    }

    $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 240
        closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
}
    },

    //BIND de eventos
    bindings: {
        local: {
            'execute': ['click_executeAction']
        },
        global: {}
    },

    executeAction: function(htmlElement, event) {

    }

});