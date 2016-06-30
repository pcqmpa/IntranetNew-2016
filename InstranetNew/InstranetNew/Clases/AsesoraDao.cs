using InstranetNew.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace InstranetNew.Clases
{

    public class AsesoraDao
    {
        private DataHelper _dataHelper;

        public AsesoraDao()
        {
            _dataHelper = new DataHelper(new SqlConnectionStringBuilder(Properties.Settings.Default.conexion_dbDolce));
        }


        public DatosComplementarios DatosAdicionales(string strIdentificacion, out string strMensaje)
        {
            try
            {
                var parametros = new List<SqlParameter> { new SqlParameter("@strIdentificacion", strIdentificacion) };

                var dt = _dataHelper.EjecutarSp<DataTable>("pd_spDatosAsesora", parametros);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        var datos = new DatosComplementarios();

                        datos.CurCupo = Convert.ToDouble(dt.Rows[0]["Cupo"]);
                        datos.NumPuntos = Convert.ToInt64(dt.Rows[0]["Puntos"]);
                        datos.CurCartera = Convert.ToDouble(dt.Rows[0]["Cartera"]);
                        datos.NumCampañas = Convert.ToInt32(dt.Rows[0]["Campañas"]);
                        datos.CurFlete = Convert.ToDouble(dt.Rows[0]["Flete"]);
                        datos.NumPedido = Convert.ToInt64(dt.Rows[0]["Pedido"]);
                        datos.StrDireccion = dt.Rows[0]["Direccion"].ToString();
                        datos.StrBarrio = dt.Rows[0]["Barrio"].ToString();
                        datos.StrPoblacion = dt.Rows[0]["Poblacion"].ToString();

                        strMensaje = "";
                        return datos;
                    }
                    else
                    {
                        strMensaje = "No hay Datos para cargar";
                        return null;
                    }
                }
                else
                {
                    strMensaje = "No hay conexión con la base de datos";
                    return null;
                }

            }
            catch (Exception ex)
            {
                strMensaje = ex.Message;
                return null;
            }
        }

        public List<Productos> ConsultaProducto(string strCodigo, string strCampaña, out string strMensaje)
        {
            try
            {
                //Crea un lista de tipo Producto
                var listaProductos = new List<Productos>();

                //Crea la lista de parametros
                var parametros = new List<SqlParameter>
                {
                    new SqlParameter("@strCodigo", strCodigo),
                    new SqlParameter("@strCampaña", strCampaña)
                };

                //Ejecuta el stored procedure y devuelve un DataTable
                var dt = _dataHelper.EjecutarSp<DataTable>("ma_spConsultaProducto", parametros);

                //Si es diferente de Null
                if (dt != null)
                {
                    //Si el dt contiene filas
                    if (dt.Rows.Count > 0)
                    {
                        //Agrega las filas a la lista
                        listaProductos.Add(new Productos
                        {
                            StrCodigo = dt.Rows[0]["strCodigoProducto"].ToString(),
                            StrDescripcion = dt.Rows[0]["strNombre"].ToString(),
                            CurValorCliente = Convert.ToInt32(dt.Rows[0]["curPrecioCliente"]),
                            CurValorCatalogo = Convert.ToInt32(dt.Rows[0]["curPrecioCatalogo"]),
                            StrDv = dt.Rows[0]["intDigitoChequeo"].ToString(),
                            StrTipoProducto = dt.Rows[0]["TipoProducto"].ToString(),
                            NumPagina = Convert.ToInt32(dt.Rows[0]["numPagina"])
                        });

                        strMensaje = string.Empty;
                        return listaProductos;
                    }
                    else
                    {
                        strMensaje = "El producto no existe en la base de datos.";
                        return null;
                    }
                }
                else
                {
                    strMensaje = "Hubo un error de conexión con el servidor.";
                    return null;
                }
            }
            catch (Exception oException)
            {
                strMensaje = oException.Message;
                return null;
            }
        }


        public Premio ConsultaPremio(string strCodigo, out string strMensaje)
        {
            try
            {
                var parametros = new List<SqlParameter> { new SqlParameter("@strCodigo", strCodigo) };

                var dt = _dataHelper.EjecutarSp<DataTable>("ma_spConsultaPremioNuevo", parametros);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        var xdatos = new Premio
                        {
                            StrCodigoPremio = dt.Rows[0]["strCodigoPremio"].ToString(),
                            StrNombrePremio = dt.Rows[0]["strNombre"].ToString(),
                            IntNumPuntos = Convert.ToInt16(dt.Rows[0]["numPuntos"])
                        };

                        strMensaje = "";
                        return xdatos;
                    }
                    else
                    {
                        strMensaje = "El premio se encuentra temporalmente agotado";
                        return null;
                    }
                }
                else
                {
                    strMensaje = "No hay conexión con la base de datos";
                    return null;
                }

            }
            catch (Exception ex)
            {
                strMensaje = ex.Message;
                return null;
            }
        }

        public bool AddPedidoAsesoraWeb(bool logBorrador,string strIdentificacion, string strCampaña, string strUsuario, double curPrecioCliente, double curPrecioCatalog, List<PedidoDetalle> detalle, out string strMensaje)
        {
            try
            {

                var dt = new DataTable();
                dt.Columns.Add("strCodigoProducto", typeof(string));
                dt.Columns.Add("intDigitoChequeo", typeof(int));
                dt.Columns.Add("intCantidad", typeof(int));
                dt.Columns.Add("curPrecioCatalogo", typeof(double));
                dt.Columns.Add("curPrecioCliente", typeof(double));
                dt.Columns.Add("strTipodeProducto", typeof(string));
                dt.Columns.Add("numCodigo", typeof(int));
                dt.Columns.Add("logEliminado", typeof(bool));

                foreach (var item in detalle)
                {
                    var row = dt.NewRow();

                    row["strCodigoProducto"] = item.StrCodigoProducto;
                    row["intDigitoChequeo"] = item.IntDigitoChequeo;
                    row["intCantidad"] = item.IntCantidad;
                    row["curPrecioCatalogo"] = item.IntPrecioCatalogo;
                    row["curPrecioCliente"] = item.IntPrecioCliente;
                    row["strTipodeProducto"] = item.StrTipoProducto;
                    row["numCodigo"] = 0;
                    row["logEliminado"] = 0;

                    dt.Rows.Add(row);
                }


                var parametros = new List<SqlParameter>
                {
                    new SqlParameter("@strIdentificacion",strIdentificacion),
                    new SqlParameter("@detalle",dt),
                    new SqlParameter("@strUsuario",strUsuario),
                    new SqlParameter("@strCampaña",strCampaña),
                    new SqlParameter("@curValorCliente",curPrecioCliente),
                    new SqlParameter("@curValorCatalogo",curPrecioCatalog),
                    new SqlParameter("@logBorrador",logBorrador)
                };


                var mensaje = new SqlParameter("@strMensaje", SqlDbType.VarChar, 100) { Direction = ParameterDirection.Output };
                var respu = new SqlParameter("@logRespuesta", SqlDbType.Bit) { Direction = ParameterDirection.Output };

                parametros.Add(mensaje);
                parametros.Add(respu);

                bool respuesta = _dataHelper.EjecutarSp<bool>("pd_spAddPedidoWeb", parametros);
                if (respuesta)
                {

                    if (Convert.ToBoolean(respu.Value))
                    {
                        EmailPedido(detalle, strUsuario, strCampaña, curPrecioCliente);
                    }

                    strMensaje = mensaje.Value.ToString();
                    return Convert.ToBoolean(respu.Value);
                }
                else
                {
                    strMensaje = "La operación no se pudo realizar, problema de conexion de datos";
                    return false;
                }


            }
            catch (Exception ex)
            {
                strMensaje = ex.Message;
                return false;

            }
        }

        public bool EmailPedido(List<PedidoDetalle> detalle, string strUsuario, string strCampaña, double curPrecioCliente)
        {

            DatosAsesoraPedidoWeb xdatos = ConsultaDatosAsesoraWeb(strUsuario);

            if (xdatos != null)
            {
                var mensaje = new MailMessage();
                var smtp = new SmtpClient("correo.dolcesas.com", 25);

                try
                {
                    mensaje.From = new MailAddress("paginaweb@dolcesas.com");
                    mensaje.To.Add(xdatos.StrEmail);
                    mensaje.Subject = "Tu pedido de Dolce de Campaña " + strCampaña;
                    mensaje.IsBodyHtml = true;
                    mensaje.Body = MensajeHtml(detalle, xdatos, strCampaña, curPrecioCliente);

                    smtp.Credentials = new NetworkCredential("paginaweb", "dolce2014");
                    smtp.EnableSsl = false;

                    smtp.Send(mensaje);

                    return true;
                }
                catch (Exception)
                {
                    return false;
                }
            }

            return false;
        }
        public DatosAsesoraPedidoWeb ConsultaDatosAsesoraWeb(string strUsuario)
        {
            try
            {
                var parametros = new List<SqlParameter> { new SqlParameter("@strUsuario", strUsuario) };

                var dt = _dataHelper.EjecutarSp<DataTable>("sg_ConsultaDatosAsesoraWeb", parametros);


                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        var xlista = new DatosAsesoraPedidoWeb();

                        xlista.StrNombre = dt.Rows[0]["strNombre"].ToString();
                        xlista.StrZona = dt.Rows[0]["strZona"].ToString();
                        xlista.StrTelefono = dt.Rows[0]["strTelefonofijo"].ToString();
                        xlista.StrCelular = dt.Rows[0]["strCelular"].ToString();
                        xlista.StrDireccion = dt.Rows[0]["strDireccion"].ToString();
                        xlista.StrEmail = dt.Rows[0]["strEmail"].ToString();

                        return xlista;

                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {

                    return null;
                }



            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public string MensajeHtml(List<PedidoDetalle> datos, DatosAsesoraPedidoWeb asesora, string strCampana, double curPrecioCliente)
        {
            try
            {
                string xbody = "";
                xbody += "<html>";
                xbody += "<head>";
                xbody += "<meta charset='UTF-8'>";
                xbody += "<title>Prueba de Correo</title>";
                xbody += "</head>";
                //Estilo del html
                xbody += "<style type='text/css'>";
                xbody += "body{font-family: 'Segoe UI';}";
                xbody += "h3{color: #999;}";
                xbody += "h2{color: #999;}";
                xbody += "p{margin: 0;padding: 0;}";
                xbody += "table{margin: 0;padding: 0;border-spacing: 0;border-collapse: collapse;}";
                xbody += "thead{background-color: #999;font-weight: normal;}";
                xbody += "th{font-weight: normal;text-align: center;color: #fff;border: 1px solid #fff;}";
                xbody += "tbody tr td{border: 1px solid #BDBDBD;color: #424242;}";
                xbody += "tbody tr:nth-child(odd){background-color: #F2F2F2;}";
                xbody += "tfoot{color: #999;font-size: 18px;font-weight: bold;}";
                //xbody += "tfoot{background-color: #999;color: #fff;font-size: 18px;}";
                xbody += ".contenedor-totales{border: 1px solid #999;padding: 0;width: 672px;max-width: 672px;text-align: right;background-color: #A4A4A4;color: #fff;}";
                xbody += ".contenedor-totales h2{margin: 0 5px 0 0;padding: 0;color: #fff;}";
                xbody += ".contenedor-totales h3{margin: 0 5px 0 0;padding: 0;color: #fff;}";
                xbody += ".codigo{width: 100px;text-align: center;}";
                xbody += ".descripcion{width: 250px;}";
                xbody += ".cantidad{width: 100px;text-align: center;}";
                xbody += ".valorunit{width: 100px;text-align: right;padding-right: 5px;}";
                xbody += ".valortotal{width: 100px;text-align: right;padding-right: 5px;}";
                xbody += "</style>";
                //fin estilo html
                //Contenido del Html
                xbody += "<body>";
                xbody += "<div><strong>Señor(a):" + asesora.StrNombre + "</strong></div>";
                xbody += "<div><strong>Zona: " + asesora.StrZona + "</strong></div>";
                xbody += "<div><strong>Campaña: " + strCampana + "</strong></div></br>";
                xbody += "<h3>Este es tu pedido</h3>";
                xbody += "<p>Este pedido esta sujeto a verificación y aprobación de tu directora de zona, queda en estado</p>";
                xbody += "<p>pendiente.</p></br>";
                //Tabla del detalle 
                xbody += "<table>";
                xbody += "<thead>";
                xbody += "<tr>";
                xbody += "<th class='codigo'>Codigo</th>";
                xbody += "<th class='descripcion'>Descripción</th>";
                xbody += "<th class='cantidad'>Cantidad</th>";
                xbody += "<th class='valorunit'>Valor unitario</th>";
                xbody += "<th class='valortotal'>Valor Total</th>";
                xbody += "</tr>";
                xbody += "</thead>";
                xbody += "<tbody>";
                //cursor para el detalle 
                foreach (var item in datos)
                {
                    xbody += "<tr>";
                    xbody += "<td class='codigo'>" + item.StrCodigoProducto + "</td>";
                    xbody += "<td class='descripcion'>" + item.StrNombreProducto + "</td>";
                    xbody += "<td class='cantidad'>" + item.IntCantidad + "</td>";
                    xbody += "<td class='valorunit'>" + string.Format("{0:c}", item.IntPrecioCliente) + "</td>";
                    xbody += "<td class='valortotal'>" + string.Format("{0:c}", item.IntCantidad * item.IntPrecioCliente) + "</td>";
                    xbody += "</tr>";

                }

                xbody += "</tbody>";
                xbody += "<tfoot>";
                xbody += "<tr>";
                xbody += "<td></td>";
                xbody += "<td></td>";
                xbody += "<td></td>";
                xbody += "<td>Total Pedido</td>";
                xbody += "<td class='valortotal'>" + string.Format("{0:c}", curPrecioCliente) + "</td>";
                xbody += "</tr>";
                xbody += "</tfoot>";
                xbody += "</table>";

                //Fin Tabla detalle

                xbody += "<h2>Gracias por su Pedido.</h2>";
                xbody += "</body>";
                xbody += "</html>";


                return xbody;



            }
            catch (Exception ex)
            {

                return "";
            }



        }

        public List<ListaPedidosAsesora> ListadoPedidosAsesora(int pagina, string strIdentificacion, out int numPaginas,out int totalItems ,out string strMensaje)
        {
            try
            {
                var parametros = new List<SqlParameter> {
                    new SqlParameter("@strIdentificacion", strIdentificacion),
                    new SqlParameter("@PageIndex",pagina)

                };
                

                var npaginas = new SqlParameter("@PageCount", SqlDbType.Int) { Direction = ParameterDirection.Output };

                var total_registros = new SqlParameter("@NumTotal", SqlDbType.Int) { Direction = ParameterDirection.Output };
                parametros.Add(npaginas);
                parametros.Add(total_registros);

                var dt = _dataHelper.EjecutarSp<DataTable>("pd_spListadoPedidosAsesora", parametros);


                

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        var xlista = new List<ListaPedidosAsesora>();

                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            xlista.Add(new ListaPedidosAsesora
                            {
                                NumPedido = Convert.ToInt64(dt.Rows[i]["numCodigo"]),
                                StrCampaña = dt.Rows[i]["strCampaña"].ToString(),
                                CurValorCatalogo = Convert.ToDouble(dt.Rows[i]["curValorCatalogo"]),
                                CurValorCliente = Convert.ToDouble(dt.Rows[i]["curValorCliente"]),
                                dtmFecha = dt.Rows[i]["dtmFechacreacion"].ToString(),
                                IntEstado = Convert.ToInt16(dt.Rows[i]["idEstadoPedido"]),
                                StrEstado = dt.Rows[i]["ESTADO"].ToString()
                            });
                        }

                        numPaginas = Convert.ToInt16(npaginas.Value);
                        totalItems = Convert.ToInt16(total_registros.Value);
                        strMensaje = "";
                        return xlista;
                    }
                    else
                    {

                        numPaginas = 0;
                        totalItems = 0;
                        strMensaje = "No hay datos para cargar";
                        return null;
                    }
                }
                else
                {
                    numPaginas = 0;
                    totalItems = 0;
                    strMensaje = "No hay conexión con la base de datos, intentelo de nuevo";
                    return null;
                }

            }
            catch (Exception ex)
            {
                numPaginas = 0;
                totalItems = 0;
                strMensaje = ex.Message;
                return null;
            }
        }


        public List<ListaPedidosAsesora> ListadoPedidosAsesora(int pagina, string strIdentificacion,string strCampaña, out int numPaginas, out int totalItems, out string strMensaje)
        {
            try
            {
                var parametros = new List<SqlParameter> {
                    new SqlParameter("@strIdentificacion", strIdentificacion),
                    new SqlParameter("@PageIndex",pagina),
                    new SqlParameter("@filtro",strCampaña)

                };


                var npaginas = new SqlParameter("@PageCount", SqlDbType.Int) { Direction = ParameterDirection.Output };

                var total_registros = new SqlParameter("@NumTotal", SqlDbType.Int) { Direction = ParameterDirection.Output };
                parametros.Add(npaginas);
                parametros.Add(total_registros);

                var dt = _dataHelper.EjecutarSp<DataTable>("pd_spListadoPedidosAsesora", parametros);




                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        var xlista = new List<ListaPedidosAsesora>();

                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            xlista.Add(new ListaPedidosAsesora
                            {
                                NumPedido = Convert.ToInt64(dt.Rows[i]["numCodigo"]),
                                StrCampaña = dt.Rows[i]["strCampaña"].ToString(),
                                CurValorCatalogo = Convert.ToDouble(dt.Rows[i]["curValorCatalogo"]),
                                CurValorCliente = Convert.ToDouble(dt.Rows[i]["curValorCliente"]),
                                dtmFecha = dt.Rows[i]["dtmFechacreacion"].ToString(),
                                IntEstado = Convert.ToInt16(dt.Rows[i]["idEstadoPedido"]),
                                StrEstado = dt.Rows[i]["ESTADO"].ToString()
                            });
                        }

                        numPaginas = Convert.ToInt16(npaginas.Value);
                        totalItems = Convert.ToInt16(total_registros.Value);
                        strMensaje = "";
                        return xlista;
                    }
                    else
                    {

                        numPaginas = 0;
                        totalItems = 0;
                        strMensaje = "No hay datos para cargar";
                        return null;
                    }
                }
                else
                {
                    numPaginas = 0;
                    totalItems = 0;
                    strMensaje = "No hay conexión con la base de datos, intentelo de nuevo";
                    return null;
                }

            }
            catch (Exception ex)
            {
                numPaginas = 0;
                totalItems = 0;
                strMensaje = ex.Message;
                return null;
            }
        }

        public PedidoAsesoraConsulta ConsultaPedidoAsesora(string strIdentificacion, string strCampaña, out string strMensaje)
        {
            try
            {
                var parametros = new List<SqlParameter> { new SqlParameter("@strIdentificacion", strIdentificacion), new SqlParameter("@strCampaña", strCampaña) };

                var dts = _dataHelper.EjecutarSp<DataSet>("pd_spConsultaPedidoAsesora", parametros);

                if (dts != null)
                {
                    if (dts.Tables.Count > 0)
                    {
                        var dt1 = dts.Tables[0];


                        var xlistaPedido = new PedidoAsesoraConsulta();

                        xlistaPedido.IdPedido = Convert.ToInt64(dt1.Rows[0]["numCodigo"]);
                        xlistaPedido.CurValorCliente = Convert.ToDouble(dt1.Rows[0]["curValorCliente"]);
                        xlistaPedido.CurValorCatalogo = Convert.ToDouble(dt1.Rows[0]["curValorCatalogo"]);
                        xlistaPedido.IdEstadoPedido = Convert.ToInt16(dt1.Rows[0]["idEstadoPedido"]);

                        var xdetalle = new List<DetallePedidoAsesoraConsulta>();

                        for (int i = 0; i < dt1.Rows.Count; i++)
                        {
                            xdetalle.Add(new DetallePedidoAsesoraConsulta
                            {
                                StrCodigo = dt1.Rows[i]["strCodigoProducto"].ToString(),
                                IntDigitoChequeo = Convert.ToInt16(dt1.Rows[i]["intDigitoChequeo"]),
                                StrDescripcion = dt1.Rows[i]["Descripcion"].ToString(),
                                IntCantidad = Convert.ToInt16(dt1.Rows[i]["intCantidad"]),
                                CurPrecioCatalogo = Convert.ToDouble(dt1.Rows[i]["curPrecioCatalogo"]),
                                CurPrecioCliente = Convert.ToDouble(dt1.Rows[i]["curPrecioCliente"]),
                                strTipodeProducto = dt1.Rows[i]["strTipodeProducto"].ToString()
                            });
                        }

                        xlistaPedido.Detalle = xdetalle;


                        if (dts.Tables.Count > 1)
                        {
                            var dt2 = dts.Tables[1];

                            if (dt2.Rows.Count > 0)
                            {
                                var xPremios = new List<PremiosAsesoraConsulta>();

                                for (int i = 0; i < dt2.Rows.Count; i++)
                                {
                                    xPremios.Add(new PremiosAsesoraConsulta
                                    {
                                        idPedido = Convert.ToInt64(dt2.Rows[i]["idPedido"]),
                                        StrCodigo = dt2.Rows[i]["strCodigoProducto"].ToString(),
                                        StrNombre = dt2.Rows[i]["strNombre"].ToString(),
                                        IntCantidad = Convert.ToInt16(dt2.Rows[i]["intCantidad"]),
                                        numPuntos = Convert.ToInt64(dt2.Rows[i]["numPuntos"])
                                    });
                                }

                                xlistaPedido.premios = xPremios;
                            }
                        }


                        strMensaje = "";
                        return xlistaPedido;
                    }
                    else
                    {
                        strMensaje = "No hay datos para cargar";
                        return null;
                    }
                }
                else
                {
                    strMensaje = "no hay conexión con la base de datos intente de nuevo";
                    return null;
                }

            }
            catch (Exception ex)
            {
                strMensaje = ex.Message;
                return null;
            }

        }


        

    }
}