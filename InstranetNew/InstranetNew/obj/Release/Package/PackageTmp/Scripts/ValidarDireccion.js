$(function () {

    $('.stick').fixTo('.cont-nav-links', {
        useNativeSticky: false,
        top: 130,
    });

    //var filaItems = JSON.parse(sessionStorage.getItem("items"));
    //var filaTotal = parseInt(JSON.parse(sessionStorage.getItem("total-pedido")));


    //$("#txt-items-direccion").html(filaItems + " Itmes");
    //$("#txt-total-pedido-direccion").html(Formato_Moneda(filaTotal));

    //var direccion = sessionStorage.getItem("direccion");
    //var barrio = sessionStorage.getItem("barrio");
    //var poblacion = sessionStorage.getItem("poblacion");

    //$("#txt-direccion-uno").html(poblacion.trim() + '/' + barrio);
    //$("#txt-direccion-nomenclatura").html(direccion);


    //$("#btn-volver-pedido-direccion").click()
    //{
    //    var url = $("#urlPedido").val();

    //    window.location.href = url;
    //}

    //$("#btn-direccion-siguiente").click()
    //{
    //    var url = $("#urlFinalizar").val();

    //    window.location.href = url;
    //}

});