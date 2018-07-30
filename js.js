function formatMoney(val){
    var value = val.toString().replace(/\D/g,'').replace(/^[0]+/, '');
    switch(value.length) {
        case 0:
            value = '0.00';
            break;

        case 1:
            value = '0.0' + value;
            break;

        case 2:
            value = '0.' + value;
            break;

        default:
            value = value.slice(0, -2) + '.' + value.slice(-2);
            break;
    }

    return value.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}


function formatReal(intvariavel) {
    var tmporario = intvariavel + '';
    tmporario = tmporario.replace(/([0-9]{2})$/g, ",$1");
    if (tmporario.length > 6)
        tmporario = tmporario.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    return tmporario;
}


// function buscaCep2(cep, callback){
//     $.ajax({
//         type: "GET",
//         async: false,
//         url: "https://viacep.com.br/ws/"+cep+"/json/",
//         contentType: "application/json; charset=utf-8",
//         data: "",
//         dataType: "json",
//         success: function(data) { callback(data); },
//         error: function(data) { callback("Erro"); }
//     });
// }