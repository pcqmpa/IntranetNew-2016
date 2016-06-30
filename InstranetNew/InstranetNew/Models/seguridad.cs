using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InstranetNew.Models
{
    public class seguridad
    {
        [Required(ErrorMessage = "El Campo Usuario es requerido")]
        [Display(Name = "Usuario")]
        public string StrUsuario { get; set; }

        [Required(ErrorMessage ="El Campo Password no puede estar en blanco")]
        [Display(Name = "Contraseña")]
        [DataType(DataType.Password)]
        public string StrPassword { get; set; }

        public string StrNombreUsuario { get; set; }

        [Required(ErrorMessage = "Debe seleccionar una campaña")]
        public string StrCampaña { get; set; }

        public string StrGrupo { get; set; }
        public int IdGrupo { get; set; }
        public int NumPuntos { get; set; }
        public bool LogEstado { get; set; }
        public List<Zonas> ListaZonas { get; set; }
        public List<MenuGeneral> ListaMenu { get; set; }

    }

    public class Zonas
    {
        public string StrZona { get; set; }
    }

    public class MenuGeneral
    {
        public int IdMenu { get; set; }
        public string StrMenu { get; set; }
    }

    public class Campañas
    {
        public string StrCampaña { get; set; }
    }
}
