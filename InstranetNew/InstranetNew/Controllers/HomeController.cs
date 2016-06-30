using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InstranetNew.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MenuAsesora(string strMensaje="")
        {
            ViewBag.mensaje = strMensaje;
            return View();
        }

    }
}