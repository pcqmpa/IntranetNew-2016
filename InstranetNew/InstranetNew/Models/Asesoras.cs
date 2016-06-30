using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InstranetNew.Models
{
    public class Asesoras
    {

    }

    public class DatosComplementarios
    {
        public double CurCupo { get; set; }
        public Int64 NumPuntos { get; set; }
        public double CurCartera { get; set; }
        public Int32 NumCampañas { get; set; }
        public double CurFlete { get; set; }
        public Int64 NumPedido { get; set; }
        public string StrDireccion { get; set; }
        public string StrBarrio { get; set; }
        public string StrPoblacion { get; set; }


    }

    public class Productos
    {

        
        [Required(ErrorMessage = "El Campo codigo es requerido")]
        [MaxLength(7,ErrorMessage = "El coigo debe de tener un minimo de 7 caracteres")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "El campo codigo solo admite caracteres numericos")]
        public string StrCodigo { get; set; }

        [Required(ErrorMessage = "La cantidad es requerida")]
        public Int16 NumCantidad { get; set; }

        public string StrDv { get; set; }
        public string StrDescripcion { get; set; }
        public double CurValorCliente { get; set; }
        public double CurValorCatalogo { get; set; }
        public string StrTipoProducto { get; set; }
        public int NumPagina { get; set; }


    }

    public class Premio
    {
        public int IntNumCodigo { get; set; }

        public string StrCodigoPremio { get; set; }

        public string StrDigito { get; set; }

        public string StrNombrePremio { get; set; }

        public int IntNumPuntos { get; set; }
    }

    public class DatosAsesoraPedidoWeb
    {
        public string StrNombre { get; set; }
        public string StrZona { get; set; }
        public string StrTelefono { get; set; }
        public string StrCelular { get; set; }
        public string StrDireccion { get; set; }
        public string StrEmail { get; set; }

    }

    public class PedidoDetalle
    {
        public int Id { get; set; }

        public string StrCodigoProducto { get; set; }

        public string StrNombreProducto { get; set; }

        public int IntDigitoChequeo { get; set; }

        public int IntCantidad { get; set; }

        public int IntPrecioCatalogo { get; set; }

        public int IntPrecioCliente { get; set; }

        public string StrTipoProducto { get; set; }

        public int IntNumCodigo { get; set; }

        public int LogEliminado { get; set; }

        public int IntNumPagina { get; set; }

        public int IntIdEstadoPedido { get; set; }

        public int IntNumPuntos { get; set; }
    }


    public class ListaPedidosAsesora
    {

        public Int64 NumPedido { get; set; }
        public string StrCampaña { get; set; }
        public double CurValorCatalogo { get; set; }
        public double CurValorCliente { get; set; }
        public string dtmFecha { get; set; }
        public int IntEstado { get; set; }
        public string StrEstado { get; set; }

    }

    public class PedidoAsesoraConsulta
    {
        public Int64 IdPedido { get; set; }
        public double CurValorCliente { get; set; }
        public double CurValorCatalogo { get; set; }
        public int IdEstadoPedido { get; set; }
        public List<DetallePedidoAsesoraConsulta> Detalle { get; set; }
        public List<PremiosAsesoraConsulta> premios { get; set; }

    }

    public class DetallePedidoAsesoraConsulta
    {
        public string StrCodigo { get; set; }
        public int IntDigitoChequeo { get; set; }
        public string StrDescripcion { get; set; }
        public int IntCantidad { get; set; }
        public double CurPrecioCatalogo { get; set; }
        public double CurPrecioCliente { get; set; }
        public string strTipodeProducto { get; set; }
    }

    public class PremiosAsesoraConsulta
    {
        public Int64 idPedido { get; set; }
        public string StrCodigo { get; set; }
        public string StrNombre { get; set; }
        public int IntCantidad { get; set; }
        public Int64 numPuntos { get; set; }

    }

    public class DetalleBorrador
    {
       
    }
}
