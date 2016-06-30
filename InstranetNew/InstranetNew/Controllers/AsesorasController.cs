using InstranetNew.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InstranetNew.Controllers
{
    public class AsesorasController : Controller
    {

        private string _strMensaje;
        // GET: Asesoras
        public ActionResult Index()
        {


            bool logEstadoUsuario = (bool)Session["LogEstado"];

            if (logEstadoUsuario)
            {
                ViewBag.Usuario = Session["Usuario"];
                ViewBag.campana = Session["Campana"];
                ViewBag.nombre = Session["NombreUsuario"];

                var vc = new Clases.AsesoraDao();

                var datos = vc.DatosAdicionales(Session["Usuario"].ToString(), out _strMensaje);

                if (datos != null)
                {
                    ViewBag.Cupo = datos.CurCupo;
                    ViewBag.Puntos = datos.NumPuntos;
                    ViewBag.Cartera = datos.CurCartera;
                    ViewBag.campanas = datos.NumCampañas;
                    ViewBag.Flete = datos.CurFlete;
                    ViewBag.Pedido = datos.NumPedido;
                    ViewBag.direccion = datos.StrDireccion;
                    ViewBag.barrio = datos.StrBarrio;
                    ViewBag.poblacion = datos.StrPoblacion;

                   

                    return View();
                }
                else
                {
                    var xmensaje = "Error Cargando los datos principales por favor ingrese de nuevo mas tarde";
                    return RedirectToAction("MenuAsesora", "Home",new { strMensaje = xmensaje });
                }
            }
            else
            {
                var xmensaje = "La digitación se encuentra cerrada para esta campaña";
                return RedirectToAction("MenuAsesora", "Home",new {strMensaje = xmensaje});
            }



        }


        public ActionResult IngresoPremio()
        {
            return View();
        }

        public ActionResult ValidarDireccion()
        {
            return View();
        }

        public ActionResult FInalizarPedido()
        {
            return View();
        }

        [HttpPost]
        public ActionResult ValidarPremio(string strCodigo)
        {
            var vc = new Clases.AsesoraDao();

            var xLista = vc.ConsultaPremio(strCodigo, out _strMensaje);

            if (xLista != null)
            {
                return Json(new
                {
                    lista=xLista
                });
            }
            else
            {
                return Json(new
                {
                    Error=_strMensaje
                });
            }

        }

        public ActionResult ValidarCodigo(string strCodigo)
        {

            var vc = new Clases.AsesoraDao();

            var campaña = Session["Campana"].ToString();

            var datos = vc.ConsultaProducto(strCodigo, campaña, out _strMensaje);

            if (datos != null)
            {
                return Json(new
                {
                    Lista = datos
                });
            }
            else
            {
                return Json(new
                {
                    Error = _strMensaje
                });
            }
           

           
        }


        [HttpPost]
        public ActionResult AddPedidoAsesora(bool logBorrador,double curValorCliente, double curValorCatalogo, List<PedidoDetalle> detalle)
        {

            try
            {

                var strUsuario = Session["Usuario"].ToString();
                var strCampaña = Session["Campana"].ToString();

                var vc = new Clases.AsesoraDao();
                var res = vc.AddPedidoAsesoraWeb(logBorrador, strUsuario, strCampaña, strUsuario, curValorCliente, curValorCatalogo, detalle, out _strMensaje);


                if (res)
                {
                    return Json(new
                    {
                        mensaje = _strMensaje
                    });
                }
                else
                {
                    return Json(new
                    {
                        Error = _strMensaje
                    });
                }

            }
            catch (Exception ex)
            {

                return Json(new
                {
                    Error = ex.Message
                });

            }
        }

        public ActionResult ListaPedidosAsesora(int id=1)
        {

            var usuario = Session["Usuario"].ToString();

            var vc = new Clases.AsesoraDao();

            var numPaginas = 0;
            var total_items = 0;

            var xlista = vc.ListadoPedidosAsesora(id,usuario,out numPaginas ,out total_items,out _strMensaje);

            if (xlista != null)
            {
                ViewBag.paginas = numPaginas;
                ViewBag.paginaIndex = id;
                ViewBag.total_items = total_items;
                ViewData["lista_pedidos"] = xlista;
            }
            else
            {
                ViewBag.mensaje = _strMensaje;
            }

            return View();
        }

        [HttpPost]
        public ActionResult ListaPedidosAsesora (string xdato,int id=1)
        {


            var usuario = Session["Usuario"].ToString();

            var vc = new Clases.AsesoraDao();

            var numPaginas = 0;
            var total_items = 0;

            var xlista = vc.ListadoPedidosAsesora(id, usuario,xdato, out numPaginas, out total_items, out _strMensaje);

            if (xlista != null)
            {
                ViewBag.paginas = numPaginas;
                ViewBag.paginaIndex = id;
                ViewBag.total_items = total_items;
                ViewData["lista_pedidos"] = xlista;
            }
            else
            {
                ViewBag.mensaje = _strMensaje;
            }

            return View();
        }

        [HttpPost]
        public ActionResult ConsultaPedidoAsesora()
        {
            //Validamos si la asesora posee pedido en esta campaña 


            var usuario = Session["Usuario"].ToString();
            var campaña = Session["Campana"].ToString();


            var vc = new Clases.AsesoraDao();

            var xlista = vc.ConsultaPedidoAsesora(usuario, campaña, out _strMensaje);

            if (xlista != null)
            {
                return Json(new
                {
                    datos = xlista
                });
            }
            else
            {
                return Json(new
                {
                    datos = string.Empty
                });
            }


        }


    }
}