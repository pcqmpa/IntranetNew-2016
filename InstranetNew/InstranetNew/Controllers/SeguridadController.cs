using InstranetNew.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InstranetNew.Controllers
{
    public class SeguridadController : Controller
    {

        private string _mensaje;
        // GET: Seguridad
        public ActionResult Index()
        {
            var vc = new Clases.SeguridadDao();

            var xlistaCampañas = vc.ListaCampañas();

            ViewData["listaCampañas"] = xlistaCampañas;

            Session["Usuario"] = "";

            return View();

        }
        [HttpPost]
        public ActionResult Index(seguridad modelo)
        {

            var xvc = new Clases.SeguridadDao();

            var xlistaCampañas = xvc.ListaCampañas();

            ViewData["listaCampañas"] = xlistaCampañas;


            if (ModelState.IsValid)
            {

                var vc = new Clases.SeguridadDao();

                var datos = vc.ValidarUsuario(modelo.StrUsuario, modelo.StrPassword, out _mensaje);

                // Validamos si el ingreso es de una asesora o perosonal de la empresa 

                if (datos != null)
                {
                    Session["Usuario"] = datos.StrUsuario;
                    Session["Campana"] = modelo.StrCampaña;
                    Session["NombreUsuario"] = datos.StrNombreUsuario;
                    Session["Grupo"] = datos.StrGrupo;
                    Session["IdGrupo"] = datos.IdGrupo;
                    Session["LogEstado"] = datos.LogEstado;
                    Session["Tope_Puntos"] = Properties.Settings.Default.tope_puntos;

                    if (datos.IdGrupo == Properties.Settings.Default.IdGrupoAsesora)
                    {
                        return RedirectToAction("MenuAsesora", "Home");
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
                else
                {
                    ModelState.AddModelError("", _mensaje);
                    return View();
                }             
                
            }
            else
            {
                return View();
            }
            
        }

        public ActionResult Registro()
        {
            return View();
        }

        public ActionResult ErrorNavegador()
        {
            return View();
        }
    }
}