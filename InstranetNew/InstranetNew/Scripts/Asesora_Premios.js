var tipo_mensaje = 0;
var conteo_fila = 0;
var codigo_premio = "";
$(function () {

    $('.stick').fixTo('.cont-nav-links', {
        useNativeSticky: false,
        top: 130,
    });

    $('.stick-02').fixTo('.with-stick-id', {
        useNativeSticky: false,
        top: 116,
    });

        var filaPuntos = JSON.parse(sessionStorage.getItem("puntos"));

        var filaItems = JSON.parse(sessionStorage.getItem("items"));
        var filaTotal = parseInt(JSON.parse(sessionStorage.getItem("total-pedido")));
        

        var puntos_restantes = sessionStorage.getItem("puntos_restantes");

        if (puntos_restantes == null) {

            sessionStorage.setItem("puntos_restantes", filaPuntos);
            $("#txt-puntos-acumulados").html(filaPuntos);

        } else {

            $("#txt-puntos-acumulados").html(puntos_restantes);

        }
        
       

        
        $("#txt-items-premios").html(filaItems + " Items");

        $("#txt-total-pedido-premio").html(Formato_Moneda(filaTotal));

        $("#txt-codigo-premio").bind('keypress', function (e) {

            if (e.which == 13) {

                var conteo = $("#txt-codigo-premio").val().length;

                if (conteo == 0 || conteo < 7)
                {
                    $("#txt-codigo-premio").val("").focus();
                    MensajeInterno("Debe de ingresar un codigo correcto",iconoMensaje.error,modulos.asesora);
                } else {
                    $("#txt-cantidad-premio").focus();
                }
            }
    });


    $("#btn-add-fila-premio").click(function () {

        /*Validamos primero que los campos esten bien*/
        var codpremio = $("#txt-codigo-premio").val();
        var cantidad_premio = 0;

        var conteo = $("#txt-codigo-premio").val().length;

        if (conteo == 0 || conteo < 7) {

            $("#txt-codigo-premio").val("").focus();
            MensajeInterno("Debe de ingresar un codigo correcto", iconoMensaje.error, modulos.asesora);
        } else {

            cantidad = parseInt($("#txt-cantidad-premio").val());

            if (cantidad == 0 || cantidad > 9) {

                $("#txt-cantidad-premio").val(0).focus();

                MensajeInterno("La cantidad debe de ser mayor que cero y menor o igual que 9", iconoMensaje.precaucion, modulos.asesora);
            } else {

                var codigo = $("#txt-codigo-premio").val();
                var url = $("#urlPremio").val();

                /*Validamos si el ppremio ya esta en el pedido*/

                var codigoReal = $("#txt-codigo-premio").val().substring(0, 6);

                var busqueda = $("#detalle-premios").find("#fila-" + codigoReal).attr("id");

                if (busqueda != undefined) {
                    tipo_mensaje = 1;
                    MensajeInterno("El codigo suministrado ya se encuentra en su pedido desea actualizar la cantidad", iconoMensaje.pregunta, modulos.asesora);
                } else {


                    $.ajax({

                        url: url,
                        data: { strCodigo: codigo },
                        type: "POST"

                    }).done(function (res) {

                        if (res.Error != undefined) {

                            MensajeInterno(res.Error, iconoMensaje.error, modulos.asesora);

                        } else {


                            var lista = res.lista;
                            var puntos_totales = parseInt(sessionStorage.getItem("puntos_restantes"));

                            /*Puntos del premio pedido por la cantidad*/
                            var puntos_premio = parseInt(lista.IntNumPuntos) * cantidad;
                            
                            /*Validamos si el premio pedido es de mayor valor que los puntos acumulados*/

                            if (puntos_totales < puntos_premio) {

                                MensajeInterno("Lo sentimos pero no puede cangear sus puntos por este producto " + lista.StrNombrePremio + " ya que es de mayor puntaje que lo acumulado", iconoMensaje.info, modulos.asesora);
                                return;
                            } else {

                                /*Restamos los puntos del premio adquirido*/

                                var puntos_restantes = puntos_totales - puntos_premio;

                                sessionStorage.setItem("puntos_restantes", puntos_restantes);

                                /*Actualizamos los puntos en el html*/

                                $("#txt-puntos-acumulados").html(puntos_restantes);

                                /*Fin*/



                                /*Ingresamos la informacion al storage*/


                                conteo_fila = conteo_fila + 1;

                                var fila = new premios_fila();

                                fila.codigo = codigoReal;
                                fila.descripcion = lista.StrNombrePremio.trim();
                                fila.puntos_unit = lista.IntNumPuntos;
                                fila.cantidad = cantidad;
                                fila.puntos_totales = puntos_premio;
                                fila.logeliminado = 0;

                                var registro = "Detalle-Premio-" + conteo_fila.toString();

                                sessionStorage.setItem(registro, JSON.stringify(fila));


                                /*Fin Storage*/


                                /* Ingresamos la fila al detalle de puntos */


                                var ul = '<ul id="fila-'+codigoReal+'" class="width-100 display-inline row-cont-table tx-center uppercase">';
                                ul += '<li id="codigo-'+codigoReal+'" class="width-10" data-id-colum="Código">'+ codigoReal +'</li>';
                                ul += '<li class="width-30 tx-left" data-id-colum="Descripción">'+ lista.StrNombrePremio.trim()  +'</li>';
                                ul += '<li id="puntos-'+ codigoReal +'" class="width-10" data-id-colum="Puntos por premio">'+ lista.IntNumPuntos +'</li>';
                                ul += '<li id="cantidad-'+ codigoReal +'" class="width-20" data-id-colum="Cantidad">'+ cantidad +'</li>';
                                ul += '<li id="totales-'+ codigoReal+'" class="width-20" data-id-colum="Puntos totales">'+ puntos_premio  +'</li>';
                                ul += '<li class="width-10" data-id-colum="Eliminar"><button class="btn-x" onclick="NotificarDeleteFila(\'' + codigoReal + '\')"></button></li>';
                                ul += '</ul>'
     
                                
                                $("#detalle-premios").prepend(ul);

                                $("#txt-codigo-premio").val("").focus();
                                $("#txt-cantidad-premio").val(0);

                                ActualizarTotales();

                                /*FIn detalle*/

                  
                            }
                           



                        }

                    }).fail(function (resp) {

                        MensajeInterno(resp.error, iconoMensaje.info, modulos.asesora);
                    });

                }

            }

        }

      

    });


    $('.count').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 3000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now).toLocaleString());
            }
        });
    });

    $(".btn-modal-aceptar").click(function () {

        if (tipo_mensaje == 2)
        {
            $(".modal-mensaje").css('opacity', '0');
            $(".modal-mensaje").css('pointer-events', '');
            EliminarFila();
            return;
        }

    });

    $("#btn-validar-direccion").click(function () {
        var url = $("#urlDireccion").val();
        window.location.href = url;
    });

    //$("#btn-regresar-pedido").click()
    //{
    //    var urlPedido = $("#urlPedido_Ini").val();

    //    window.location.href = urlPedido;

    //}

});



function premios_fila() {
    this.codigo,
    this.descripcion,
    this.puntos_unit,
    this.cantidad,
    this.puntos_totales,
    this.logeliminado,
    this.digito
};


function NotificarDeleteFila(codigo)
{
    codigo_premio = codigo;
    tipo_mensaje = 2;
    MensajeInterno("Esta seguro de que desea eliminar el item del premio", iconoMensaje.pregunta, modulos.asesora);
}

function EliminarFila()
{


    /*Buscamos el codigo en el storage para eliminarlo*/

    for (var i = 0; i < conteo_fila; i++) {


        var fila = i + 1;
        var registro = "Detalle-Premio-" + fila.toString();

        var xfila = JSON.parse(sessionStorage.getItem(registro));

        if (xfila.codigo == codigo_premio)
        {
            $("#fila-" + codigo_premio).remove();

            /*Actualizamos los puntos a devolver*/


            var puntos_restantes = parseInt(JSON.parse(sessionStorage.getItem("puntos_restantes")));

            var puntos_premio = parseInt(xfila.puntos_totales);

            var puntos_deduccion_nuevo = puntos_restantes + puntos_premio;

            sessionStorage.setItem("puntos_restantes", puntos_deduccion_nuevo);

            $("#txt-puntos-acumulados").html(puntos_deduccion_nuevo);


            /*Fin Actualizar puntos*/


            xfila.logeliminado = 1;

            sessionStorage.setItem(registro, JSON.stringify(xfila));

        }

    }

    ActualizarTotales();
}


function CargarDetalle(items)
{
    conteo_fila = items;

    for (var i = 0; i < items; i++) {

        var fila = i + 1;
       
        var registro = "Detalle-Premio-" + fila.toString();


        /*Cargamos el detalle*/

        var xfila = JSON.parse(sessionStorage.getItem(registro));

        var ul = '<ul id="fila-' + xfila.codigo + '" class="width-100 display-inline row-cont-table tx-center uppercase">';
        ul += '<li id="codigo-' + xfila.codigo + '" class="width-10" data-id-colum="Código">' + xfila.codigo + '</li>';
        ul += '<li class="width-30 tx-left" data-id-colum="Descripción">' + xfila.descripcion + '</li>';
        ul += '<li id="puntos-' + xfila.codigo + '" class="width-10" data-id-colum="Puntos por premio">' + xfila.puntos_unit + '</li>';
        ul += '<li id="cantidad-' + xfila.codigo + '" class="width-20" data-id-colum="Cantidad">' + xfila.cantidad + '</li>';
        ul += '<li id="totales-' + xfila.codigo + '" class="width-20" data-id-colum="Puntos totales">' + xfila.puntos_totales  + '</li>';
        ul += '<li class="width-10" data-id-colum="Eliminar"><button class="btn-x" onclick="NotificarDeleteFila(\'' + xfila.codigo + '\')"></button></li>';
        ul += '</ul>'


        $("#detalle-premios").prepend(ul);


        /*Fin Carga del detalle*/


    }



    var puntos_restantes = JSON.parse(sessionStorage.getItem("puntos_restantes"));

    $("#txt-puntos-acumulados").html(puntos_restantes);


    var puntos_deduccion = JSON.parse(sessionStorage.getItem("puntos_deduccion"));

    $("#txt-total-puntos-redimidos").html(puntos_deduccion);



}


function ActualizarCantidad()
{

}

function ActualizarTotales() {

    var total_puntos_descuento = 0;
    var items_premiso = 0;
    var total_unidadesPremio = 0;

    for (var i = 0; i < conteo_fila; i++) {

        var fila = i + 1;
        var registro = "Detalle-Premio-" + fila.toString();

        var xfila = JSON.parse(sessionStorage.getItem(registro));

        var eliminado = parseInt(xfila.logeliminado);

        if (eliminado == 0) {

            total_puntos_descuento = total_puntos_descuento + parseInt(xfila.puntos_totales);
            items_premiso = items_premiso + 1;

            total_unidadesPremio = total_unidadesPremio + parseInt(xfila.cantidad);
        }
        


    }
    

        $("#txt-total-puntos-redimidos").html(total_puntos_descuento);
        
        sessionStorage.setItem("puntos_deduccion", total_puntos_descuento);
        sessionStorage.setItem("Items_premiso", items_premiso);
        sessionStorage.setItem("total_unidades_premio", total_unidadesPremio);
        
}