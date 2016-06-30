var conteoFilas = 0;
var tipo_mensaje = 0;
var cod_producto = "";
var logPremio = 0;



$(function () {


    var xpuntos = $("#puntos").val();
    var xdireccion = $("#direccion").val();
    var xBarrio = $("#barrio").val();
    var xpoblacion = $("#poblacion").val();

    sessionStorage.setItem("puntos", xpuntos);
    sessionStorage.setItem("direccion", xdireccion);
    sessionStorage.setItem("barrio", xBarrio);
    sessionStorage.setItem("poblacion", xpoblacion);



    /*Consultamos si ya hay un pedido digitado*/

    ConsultaPedidoAsesora();




    $("#txt-codigo").bind('keypress', function (e) {
        if (e.which == 13) {
            var conteo = $("#txt-codigo").val().length;
            if (conteo == 0 || conteo < 7) {
                $("#txt-codigo").val('').focus();

                MensajeInterno("Debe de ingresar un codigo correcto", iconoMensaje.precaucion, modulos.asesora);

            } else {
                $("#txt-cantidad").focus();
            }

        }
    });


    $("#btn-addfila").click(function () {

        var cantidad = 0;
        var conteo = $("#txt-codigo").val().length;


        if (conteo == 0 || conteo < 7)
        {
            $("#txt-codigo").val('').focus();

            MensajeInterno("Debe de ingresar un codigo correcto", iconoMensaje.precaucion, modulos.asesora);
        } else {


            cantidad = parseInt($("#txt-cantidad").val());

            if (cantidad == 0 || cantidad > 9)
            {
                $("#txt-cantidad").val(0).focus();

                MensajeInterno("La cantidad debe de ser mayor que cero y menor o igual que 9", iconoMensaje.precaucion, modulos.asesora);
            } else {

                var codgio = $("#txt-codigo").val();
                var url = $("#urlProducto").val();

                //Buscamos en la tabla si el codigo ya existe

                var codigoReal = $("#txt-codigo").val().substring(0, 6);

                var busqueda = $("#detalle-pedido").find("#fila-" + codigoReal).attr("id");

                if (busqueda != undefined)
                {
                    tipo_mensaje = 1;
                    MensajeInterno("El codigo suministrado ya se encuentra en su pedido desea actualizar la cantidad", iconoMensaje.pregunta, modulos.asesora);
                    
                    

                } else {

                    $.ajax({
                        url: url,
                        data: { strCodigo: codgio },
                        type: "POST"
                    }).done(function (res) {

                        if (res.Error != undefined) {
                            MensajeInterno(res.Error, iconoMensaje.precaucion, modulos.asesora);
                        } else {

                                            
                            var lista = res.Lista;

                            var valorunit_Cliente = parseInt(lista[0].CurValorCliente);
                            var valorTotalCliente = valorunit_Cliente * cantidad;
                            var valorunit_catalogo = parseInt(lista[0].CurValorCatalogo);
                            var valorTotalCatalogo = valorunit_catalogo * cantidad;

                            /* Agregamos el codigo al storage*/

                            var fila = new producto_fila();

                            fila.codigo = lista[0].StrCodigo;
                            fila.descripcion = lista[0].StrDescripcion.trim();
                            fila.cantidad = cantidad;
                            fila.valorCliente = valorTotalCliente;
                            fila.valorCatalogo = valorTotalCatalogo;
                            fila.logEliminado = 0;
                            fila.valunitCliente = lista[0].CurValorCliente;
                            fila.valunitCatalogo = lista[0].CurValorCatalogo;
                            fila.tipoproducto = lista[0].StrTipoProducto;
                            fila.digito = lista[0].StrDv;

                            conteoFilas = conteoFilas + 1;

                            var identificador = "Detalle-Pedido-" + conteoFilas.toString();

                            sessionStorage.setItem(identificador, JSON.stringify(fila));

                            /*Fin*/


                            var ul = '<ul id="fila-' + lista[0].StrCodigo + '" class="width-100 display-inline row-cont-table tx-center uppercase">';
                            ul += '<li class="width-10" data-id-colum="Código">' + lista[0].StrCodigo + '</li>';
                            ul += '<li class="width-20 tx-left transform-null" data-id-colum="Descripción">' + lista[0].StrDescripcion.trim() + '</li>';
                            ul += '<li id="cantidad-' + lista[0].StrCodigo + '" class="width-10" data-id-colum="Cantidad">' + cantidad + '</li>';
                            ul += '<li class="width-10" data-id-colum="v.alor Unitario cliente"> '+ Formato_Moneda(valorunit_Cliente) + '</li>';
                            ul += '<li class="width-10" data-id-colum="v.alor Unitario Catálogo">' + Formato_Moneda(valorunit_catalogo); + '</li>'
                            ul += '<li id="total-cliente-' + lista[0].StrCodigo + '" class="width-10" data-id-colum="v.alor total cliente">' + Formato_Moneda(valorTotalCliente) + '</li>';
                            ul += '<li id="total-catalogo-' + lista[0].StrCodigo + '" class="width-10" data-id-colum="v.alor total Catálogo">' + Formato_Moneda(valorTotalCatalogo) + '</li>';
                            ul += '<li class="width-10" data-id-colum="Eliminar"><button class="btn-x" onclick="ValidarEliminarFila(\'' + lista[0].StrCodigo + '\')"></button></li>';
                            ul += '</ul>';

                            ActualizarTotales();

                            $("#detalle-pedido").prepend(ul);

                            MensajeInterno("El producto con codigo " + lista[0].StrCodigo +" y descripción " + lista[0].StrDescripcion.trim() + " fue ingresado a su pedido." , iconoMensaje.error, modulos.asesora);

                            $("#txt-codigo").val("").focus();
                            $("#txt-cantidad").val(0);


                        }

                    }).fail(function (error) {
                        MensajeInterno(error.error, iconoMensaje.error, modulos.asesora);
                    });

                }

            }

        }



       

        //var fila = new Filas();

        //fila.codigo = "000149";
        //fila.cantidad = "0";

        //localStorage.setItem("0", JSON.stringify(fila));


        //fila = new Filas();

        //fila.codigo = "000148";
        //fila.cantidad = "1";

        //localStorage.setItem("1", JSON.stringify(fila));

        //for (var i = 0; i < localStorage.length; i++) {
        //    var filanew = JSON.parse(localStorage.getItem(i));
        //    alert(filanew.codigo + filanew.cantidad);
        //}


    });

    $("#btn-siguiente-premios").click(function () {

        if (conteoFilas > 0) {

            $(".modal-premios").css('opacity', '1');
            $(".modal-premios").css('pointer-events', 'auto');

        } else {

            $("#txt-codigo").focus();
            MensajeInterno("No ha ingresado ningun producto a su pedido" , iconoMensaje.precaucion, modulos.asesora);
        }


        
    });

    $(".btn-modal-aceptar").click(function () {


        
        if (tipo_mensaje == 0)
        {
            $(".modal-mensaje").css('opacity', '0');
            $(".modal-mensaje").css('pointer-events', '');

        }

        if (tipo_mensaje == 1)
        {
            $(".modal-mensaje").css('opacity', '0');
            $(".modal-mensaje").css('pointer-events', '');

            ActualizarCantidad();
            tipo_mensaje = 0;
            return;
        }

        if (tipo_mensaje == 2) {

            $(".modal-mensaje").css('opacity', '0');
            $(".modal-mensaje").css('pointer-events', '');

            EliminarFila();
            tipo_mensaje = 0;
            return;
        }

        if (tipo_mensaje == 3) {



        }


    });


    $("#close_mensaje_pedido").on("click", function () {

        $(".modal-pedido-cerrado").css('opacity', '0');
        $(".modal-pedido-cerrado").css('pointer-events', '');

        //$(".modal-premios").css('opacity', '0');
        //$(".modal-premios").css('pointer-events', '');

        var urlMenu = $("#urlMenu").val();
        window.location.href = urlMenu;
    });


});


function EliminarFila()
{
   

    /*Buscamos el codigo en el storage para eliminarlo*/

    for (var i = 0; i < conteoFilas; i++) {

        var fila = i + 1;

        var registro = "Detalle-Pedido-" + fila.toString();

        var xfila= JSON.parse(sessionStorage.getItem(registro));

        if (xfila.codigo == cod_producto) {

            
            $("#fila-" + cod_producto).remove();

         //   var xdatoFila = new producto_fila();

         //xdatoFila.codigo = xfila.codigo;
         //   xdatoFila.descripcion = xfila.descripcion;
         //   xdatoFila.cantidad = xfila.cantidad;
         //   xdatoFila.valunitCliente = xfila.valunitCliente;
         //   xdatoFila.valunitCatalogo = xfila.valunitCatalogo;
         //   xdatoFila.valorCliente = xfila.valorCliente;
         //   xdatoFila.valorCatalogo = xfila.valorCatalogo;   
         //   xdatoFila.logEliminado = 1;

            xfila.logEliminado=1
            sessionStorage.setItem(registro, JSON.stringify(xfila));
        }
    }

    /*Actualizamos el contador*/

    ActualizarTotales();

}

function ValidarEliminarFila(codigo) {
   
    cod_producto = codigo;
    tipo_mensaje = 2;    
    MensajeInterno("Esta seguro de Eliminar el registro seleccionado con codigo " + codigo, iconoMensaje.pregunta, modulos.asesora);
}

function ActualizarCantidad() {


    var codigoReal = $("#txt-codigo").val().substring(0, 6);

    var cantidadActual = parseInt($("#cantidad-" + codigoReal).html());

    /*Remplazamo el aumentamos el valor en la cantidad*/

    var cantidadNew = parseInt($("#txt-cantidad").val());
    var totalCantidad = cantidadActual + cantidadNew;

    $("#cantidad-" + codigoReal).html(totalCantidad);

    /*Buscamos en el storage la fila*/

    for (var i = 0; i < conteoFilas; i++) {

        var fila = i + 1

        var registro = "Detalle-Pedido-" + fila.toString();

        var xfila = JSON.parse(sessionStorage.getItem(registro));

        var validar_codigo = xfila.codigo;

        if (validar_codigo == codigoReal) {

            var valorTotalCliente = parseInt(xfila.valunitCliente) * totalCantidad;
            var valorTotalCatalogo = parseInt(xfila.valunitCatalogo) * totalCantidad;

            var xdatoFila = new producto_fila();

            $("#total-cliente-" + codigoReal).html(Formato_Moneda(valorTotalCliente));
            $("#total-catalogo-" + codigoReal).html(Formato_Moneda(valorTotalCatalogo));

            xdatoFila.codigo = xfila.codigo;
            xdatoFila.descripcion = xfila.descripcion;
            xdatoFila.cantidad = totalCantidad;
            xdatoFila.valunitCliente = xfila.valunitCliente;
            xdatoFila.valunitCatalogo = xfila.valunitCatalogo;
            xdatoFila.valorCliente = valorTotalCliente;
            xdatoFila.valorCatalogo = valorTotalCatalogo;
            xdatoFila.logEliminado = 0;

            sessionStorage.setItem(registro, JSON.stringify(xdatoFila));

            ActualizarTotales();

            $("#txt-codigo").val("").focus();
            $("#txt-cantidad").val(0);
            
        }

    }
}


function producto_fila()
{
    this.codigo,
    this.descripcion,
    this.cantidad,
    this.valunitCliente,
    this.valunitCatalogo,
    this.valorCliente,
    this.valorCatalogo,
    this.logEliminado,
    this.tipoproducto,
    this.digito

}

function CargarDetalle()
{
    var items = parseInt(JSON.parse(sessionStorage.getItem("items")));

    conteoFilas = items;

    if (items != null) {


        var subtotalCliente = 0;
        var TotalCatalogo = 0;
        var unidades = 0;

        var flete = parseInt($("#curFlete").val());

        for (var i = 0; i < items ; i++) {

            var fila = i + 1;

            var registro = "Detalle-Pedido-" + fila.toString();

            var xfila = JSON.parse(sessionStorage.getItem(registro));

            if (xfila.logEliminado == 0) {

                var valorunitCatalogo = parseInt(xfila.valunitCatalogo);
                var valorunitCliente = parseInt(xfila.valunitCliente);

                var valTotalCliente = parseInt(xfila.valorCliente);
                var valTotalCatalogo = parseInt(xfila.valorCatalogo);

                subtotalCliente = subtotalCliente + valTotalCliente;
                TotalCatalogo = TotalCatalogo + valTotalCatalogo;

                unidades = unidades + xfila.cantidad;

                var ul = '<ul id="fila-' + xfila.codigo + '" class="width-100 display-inline row-cont-table tx-center uppercase">';
                ul += '<li class="width-10" data-id-colum="Código">' + xfila.codigo + '</li>';
                ul += '<li class="width-20 tx-left transform-null" data-id-colum="Descripción">' + xfila.descripcion + '</li>';
                ul += '<li id="cantidad-' + xfila.codigo + '" class="width-10" data-id-colum="Cantidad">' + xfila.cantidad + '</li>';
                ul += '<li class="width-10" data-id-colum="v.alor Unitario cliente"> ' + Formato_Moneda(valorunitCliente) + '</li>';
                ul += '<li class="width-10" data-id-colum="v.alor Unitario Catálogo">' + Formato_Moneda(valorunitCatalogo); + '</li>'
                ul += '<li id="total-cliente-' + xfila.codigo + '" class="width-10" data-id-colum="v.alor total cliente">' + Formato_Moneda(valTotalCliente) + '</li>';
                ul += '<li id="total-catalogo-' + xfila.codigo + '" class="width-10" data-id-colum="v.alor total Catálogo">' + Formato_Moneda(valTotalCatalogo) + '</li>';
                ul += '<li class="width-10" data-id-colum="Eliminar"><button class="btn-x" onclick="ValidarEliminarFila(\'' + xfila.codigo + '\')"></button></li>';
                ul += '</ul>';

                

                $("#detalle-pedido").prepend(ul);

            }



            /*Actualizamos totales*/

        }

        TotalCatalogo = TotalCatalogo + flete;
        subtotalCliente = subtotalCliente + flete;

        $("#txt-subtotal").html(Formato_Moneda(subtotalCliente));

        $("#txt-total-cliente").html(Formato_Moneda(subtotalCliente));
        $("#txt-total-catalogo").html(Formato_Moneda(TotalCatalogo));


        $("#txt-total-items").html(items);

        $("#txt-total-unidades").html(unidades);


    }


}


function ActualizarTotales()
{
    var subtotal = 0;
    var unidades = 0;
    var flete = parseInt($("#curFlete").val());
    var subtotalCatalogo = 0;
    var items_total = 0;


    for (var i = 0; i < conteoFilas ; i++) {

        var fila = i + 1;

        var registro = "Detalle-Pedido-" + fila.toString();

        var xfila = JSON.parse(sessionStorage.getItem(registro));

        if (xfila.logEliminado == 0)
        {
            subtotal = subtotal + parseInt(xfila.valorCliente);

            unidades = unidades + parseInt(xfila.cantidad);

            subtotalCatalogo = subtotalCatalogo + parseInt(xfila.valorCatalogo);

            items_total = items_total + 1;
        }


    }


    $("#txt-subtotal").html(Formato_Moneda(subtotal));

    $("#txt-total-items").html(items_total);

    $("#txt-total-unidades").html(unidades);

    var totalcliente = flete + subtotal;
    var totalcatalogo = flete + subtotalCatalogo;

    $("#txt-total-cliente").html(Formato_Moneda(totalcliente));
    $("#txt-total-catalogo").html(Formato_Moneda(totalcatalogo));


    sessionStorage.setItem("total-pedido", totalcliente);
    sessionStorage.setItem("items", items_total);


}


function ConsultaPedidoAsesora()
{
    var url = $("#urlConsultaPedido").val();

    $.ajax({
        url: url,
        type:"POST"
    }).done(function (res) {

        if (res.datos != "")
        {

         

            //MensajeInterno("Ya posee un pedido digitado", iconoMensaje.error, modulos.asesora);

            //$(".modal-mensaje").css('opacity', '1');
            //$(".modal-mensaje").css('pointer-events', 'auto');

            /*Limpiamos el detalle*/
                
            $("#detalle-pedido ul").remove();

            /*Fin*/

            /*Cargamos primero El pedido*/

            var detalle_pedido = res.datos.Detalle;

             

            for (var i = 0; i < detalle_pedido.length; i++) {
                
                conteoFilas = i + 1;

                var valTotalCatalogo = parseInt(detalle_pedido[i].CurPrecioCatalogo) * parseInt(detalle_pedido[i].IntCantidad);
                var valTotalCliente = parseInt(detalle_pedido[i].CurPrecioCliente) * parseInt(detalle_pedido[i].IntCantidad);


                var fila = new producto_fila();
                fila.codigo = detalle_pedido[i].StrCodigo;
                fila.descripcion = detalle_pedido[i].StrDescripcion.trim();
                fila.cantidad = detalle_pedido[i].IntCantidad;
                fila.valorCliente = valTotalCliente;
                fila.valorCatalogo = valTotalCatalogo;
                fila.logEliminado = 0;
                fila.valunitCliente = detalle_pedido[i].CurPrecioCliente;
                fila.valunitCatalogo = detalle_pedido[i].CurPrecioCatalogo;
                fila.tipoproducto = detalle_pedido[i].strTipodeProducto;
                fila.digito = detalle_pedido[i].IntDigitoChequeo;

                var identificador = "Detalle-Pedido-" + conteoFilas.toString();


                sessionStorage.setItem(identificador, JSON.stringify(fila));
            }

            sessionStorage.setItem("items", conteoFilas);

            CargarDetalle();

            /*Fin carga pedido*/

            var estado_pedido = res.datos.IdEstadoPedido;
            var xmensaje = "";

            switch (estado_pedido) {
                case 4:
                    xmensaje = "El pedido ya esta Facturado";
                    ActivarMensajePedido(xmensaje);
                    return;
                case 12:
                    xmensaje = "Estado Borrador";

                    return;
                case 10:
                    xmensaje = "Digitado y enviado no es posible modificarlo";
                    ActivarMensajePedido(xmensaje);
                    return;
                case 2:
                    xmensaje = "Pedido en Proceso de Pase";
                    ActivarMensajePedido(xmensaje);
                    return;
                case 3:
                    xmensaje = "Pedido en Proceso de Facturación";
                    ActivarMensajePedido(xmensaje);
                    return;
                case 5:
                    xmensaje = "Este Pedido se encuentra anulado";
                    ActivarMensajePedido(xmensaje);
                    return;
                case 6:
                    xmensaje = "Esta Pedido se encuentra eliminado";
                    ActivarMensajePedido(xmensaje);
                    return;

            }
        }

    }).fail(function (error) {
        
    });

}

function ActivarMensajePedido(mensaje)
{

    $(".modal-pedido-cerrado").css('opacity', '1');
    $(".modal-pedido-cerrado").css('pointer-events', 'auto');

    $("#txt-mensaje-pedido").html(mensaje);
}