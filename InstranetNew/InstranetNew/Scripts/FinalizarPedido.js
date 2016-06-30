var tipo_mensaje=0;
$(function () {


    //$('.stick').fixTo('.cont-nav-links', {
    //    useNativeSticky: false,
    //    top: 130,
    //});

   
    //$('.stick-02').fixTo('.with-stick-id', {
    //    useNativeSticky: false,
    //    top: 116,
    //});

    //$('.stick-03').fixTo('.contg-resumen', {
    //    useNativeSticky: false,
    //    top: 130,
    //});


    /*consultamos detalle del pedido y de los premios*/

    $("#btn-guardar-borrador").click(function () {

        tipo_mensaje = 1;
        MensajeInterno("Desea guardar el pedido como Borrador", iconoMensaje.info, modulos.asesora);
        
    });


    $(".btn-modal-aceptar").click(function () {

        if (tipo_mensaje == 1)
        {
            $(".modal-mensaje").css('opacity', '0');
            $(".modal-mensaje").css('pointer-events', '');
            GuardarPedido(1);
            return;
        }

        if (tipo_mensaje == 0) {

            $(".modal-mensaje").css('opacity', '0');
            $(".modal-mensaje").css('pointer-events', '');
            return;
        }

        if (tipo_mensaje==2) {

            var url_listado = $("#urlListado").val();
            window.location.href = url_listado;
        }

    });

    $(".btn-modal-cancelar").click(function () {
        $(".modal-mensaje").css('opacity', '0');
        $(".modal-mensaje").css('pointer-events', '');
    });

    var items_Pedido = parseInt(sessionStorage.getItem("items"));


    var datoPremio = sessionStorage.getItem("Items_premiso");

    if (datoPremio != null) {

        var item_premios = parseInt(sessionStorage.getItem("Items_premiso"));

        /* CArgamos detalle premios*/

        for (var i = 0; i < item_premios; i++) {

            var fila_premio = i + 1;
            var registro_premio = "Detalle-Premio-" + fila_premio.toString();

            var xfila_premio = JSON.parse(sessionStorage.getItem(registro_premio));


            var logEliminado_premio = xfila_premio.logeliminado;

            if (logEliminado_premio == "0") {
               


                var ul_premio = '<ul class="width-100 display-inline row-cont-table tx-center uppercase">';
                ul_premio += '<li class="width-15" data-id-colum="Código">'+ xfila_premio.codigo  +'</li>';
                ul_premio += '<li class="width-30 tx-left transform-null" data-id-colum="Descripción">'+ xfila_premio.descripcion +'</li>';
                ul_premio += '<li class="width-15" data-id-colum="Cantidad">'+ xfila_premio.cantidad +'</li>';
                ul_premio += '<li class="width-20" data-id-colum="puntos requeridos">' + xfila_premio.puntos_unit + '</li>';
                ul_premio += '<li class="width-20" data-id-colum="puntos totales">' + xfila_premio.puntos_totales + '</li>';
                ul_premio += '</ul>';


                $("#detalle-premios-confirmar").prepend(ul_premio);


            }


        }


        $("#txt-total-items-premios-confirmar").html(item_premios);

        var unidades_premios = sessionStorage.getItem("total_unidades_premio");

        $("#txt-total-unidades-premios-confirmar").html(unidades_premios);

        var puntos_utilizados = sessionStorage.getItem("puntos_deduccion");

        $("#txt-puntos-utilizados-confirmar").html(puntos_utilizados);

        /*Final Premios*/

    }

   

    var unidades_pedido = 0;

    var total_cliente = 0;
    var total_catalogo = 0;

    var puntos_optenidos = 0;

    if (items_Pedido != undefined)
    {
        for (var i = 0; i < items_Pedido; i++) {

            var fila = i + 1;
            var registro = "Detalle-Pedido-" + fila.toString();

            var xfila = JSON.parse(sessionStorage.getItem(registro));





            total_cliente = total_cliente + parseInt(xfila.valorCliente);
            total_catalogo = total_catalogo + parseInt(xfila.valorCatalogo);

            unidades_pedido = unidades_pedido + parseInt(xfila.cantidad);

            /*Validamos si optiene puntos*/

            var tipo_producto = xfila.tipoproducto;

            if (tipo_producto.trim() == "N" || tipo_producto.trim() == "O") {

                puntos_optenidos = puntos_optenidos + parseInt(xfila.valorCatalogo);
            }


            /*Fin*/


            /*Cargamos el detalle del pedido*/

            var xul = '<ul class="width-100 display-inline row-cont-table tx-center uppercase">';
            xul += '<li class="width-10" data-id-colum="Código">'+ xfila.codigo +'</li>';
            xul += '<li class="width-20 tx-left transform-null" data-id-colum="Descripción">' + xfila.descripcion + '</li>';
            xul += '<li class="width-10" data-id-colum="Cantidad">'+ xfila.cantidad +'</li>';
            xul += '<li class="width-15" data-id-colum="Valor unitario cliente">'+ Formato_Moneda(parseInt(xfila.valunitCliente)) +'</li>';
            xul += '<li class="width-15" data-id-colum="Valor unitario Catálogo">'+ Formato_Moneda(parseInt(xfila.valunitCatalogo))  +'</li>';
            xul += '<li class="width-15" data-id-colum="Valor total cliente">'+ Formato_Moneda(parseInt(xfila.valorCliente))  +'</li>';
            xul += '<li class="width-15" data-id-colum="Valor total Catálogo">'+ Formato_Moneda(parseInt(xfila.valorCatalogo))  + '</li>';
            xul += '</ul>';


            $("#detalle-pedido-confirmar").prepend(xul);


            /*Fin carga de Pedido*/

        }


        /*Cargo los puntos obtenidos*/
        var tope_puntos = parseInt($("#tope_puntos").val());

        if (puntos_optenidos >= tope_puntos) {


            $("#txt-puntos-acumulados-finalizar").html(formato_numero(puntos_optenidos / 1000, 0, ',', '.'));

        }

        /*Cargo la ganancia del pedido*/


        var ganancia = total_catalogo - total_cliente;

        $("#txt-ganancia").html(Formato_Moneda(ganancia));


        $("#txt-total-items-confirmar").html(items_Pedido);

        $("#txt-total-unidades-confirmar").html(unidades_pedido);

        $("#txt-total-catalogo").html(Formato_Moneda(total_catalogo));

        $("#txt-valor-total-cliente").html(Formato_Moneda(total_cliente));

        $("#txt-total-peido-confirmar").html(Formato_Moneda(total_cliente));

        var direccion = sessionStorage.getItem("direccion");
        var barrio = sessionStorage.getItem("barrio");
        var poblacion = sessionStorage.getItem("poblacion");

        $("#txt-direccion1-confirmar").html(poblacion + '/' + barrio);
        $("#txt-direccion2-confirmar").html(direccion);


    }


});

function GuardarPedido(logBorrador)
{
    /*CArgamos el Detta primero del pedido*/

    
    var items_pedido = parseInt(sessionStorage.getItem("items"));

    var valorCatalogo = 0;
    var valorCliente = 0;


    var _array = [];

    for (var i = 0; i < items_pedido; i++) {

        var fila = i + 1;

        var registro = "Detalle-Pedido-" + fila.toString();

        var xfila = JSON.parse(sessionStorage.getItem(registro));

        var detalle = new DetalleProducto();

        detalle.StrCodigoProducto = xfila.codigo;
        detalle.IntDigitoChequeo = xfila.digito;
        detalle.IntCantidad = xfila.cantidad;
        detalle.IntPrecioCatalogo = xfila.valunitCatalogo;
        detalle.IntPrecioCliente = xfila.valunitCliente;
        detalle.StrTipoProducto = xfila.tipoproducto;
        detalle.LogEliminado = xfila.LogEliminado;

        _array.push(detalle);

        valorCatalogo = valorCatalogo + parseInt(xfila.valorCatalogo);
        valorCliente = valorCliente + parseInt(xfila.valorCliente);

    }

    /*Fin*/

    /*Cargamos los Premios si tiene*/

    var itemPremioTotal = sessionStorage.getItem("Items_premiso");

    if (itemPremioTotal != null) {

        var Items_premio = parseInt(itemPremioTotal);

        for (var i = 0; i < Items_premio; i++) {

            var fila = i + 1;
            var resgistro = "Detalle-Premio-" + fila;

            var xfila = JSON.parse(sessionStorage.getItem(registro));

            var detalle_premio = new DetalleProducto();

            detalle_premio.StrCodigoProducto = xfila.codigo;
            detalle_premio.IntDigitoChequeo = "0";
            detalle_premio.IntCantidad = xfila.cantidad;
            detalle_premio.IntPrecioCatalogo = 0;
            detalle_premio.IntPrecioCliente = 0;
            detalle_premio.StrTipoProducto = "P";
            detalle_premio.LogEliminado = xfila.logeliminado;

            _array.push(detalle_premio);

        }

    }

    /*Fin Premios*/

    var url_pedido = $("#urlAddPedido").val();
   

    var jsonData = JSON.stringify({ logBorrador: logBorrador, curValorCliente: valorCliente, curValorCatalogo: valorCatalogo, detalle: _array });


    $.ajax({
        url: url_pedido,
        data: jsonData,
        contentType: 'application/json',
        type:"POST"
    }).done(function (res) {
        if (res.Error != undefined)
        {
            MensajeInterno(res.Error, iconoMensaje.error, modulos.asesora);
        } else {

            tipo_mensaje = 2;
            MensajeInterno(res.mensaje, iconoMensaje.ok, modulos.asesora);


        }
    }).fail(function (res) {

        MensajeInterno(res.error, iconoMensaje.error, modulos.asesora);

    });


}


function DetalleProducto() {

    this.StrCodigoProducto = "";
    this.IntDigitoChequeo = "";
    this.IntCantidad = 0;
    this.IntPrecioCatalogo = 0;
    this.IntPrecioCliente = 0;
    this.StrTipoProducto = "";
    this.IntNumCodigo = 0;
    this.LogEliminado = 0;

}