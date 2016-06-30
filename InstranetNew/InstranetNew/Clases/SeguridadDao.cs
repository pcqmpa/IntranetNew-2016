using InstranetNew.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InstranetNew.Clases
{


    public class SeguridadDao
    {
        private DataHelper _dataHelper;
        public SeguridadDao()
        {
            _dataHelper = new DataHelper(new SqlConnectionStringBuilder(Properties.Settings.Default.conexion_dbDolce));
        }

        public seguridad ValidarUsuario(string usuario, string contraseña,out string strMensaje)
        {
            try
            {
                var parametros = new List<SqlParameter>
                {
                    new SqlParameter("strUsuario", usuario),
                    new SqlParameter("strPassword", contraseña),
              
                };

                var dts = _dataHelper.EjecutarSp<DataSet>("sg_spValidarUsuario", parametros);

                if (dts != null)
                {
                    if (dts.Tables.Count > 0)
                    {
                        var dt = dts.Tables[0];


                        bool validar = Convert.ToBoolean(dt.Rows[0]["logValidacion"]);

                        string mensaje = dt.Rows[0]["strValidacion"].ToString();

                        if (validar)
                        {

                            var lista = new seguridad
                            {
                                StrUsuario = usuario,
                                StrGrupo = dt.Rows[0]["strGrupo"].ToString(),
                                StrNombreUsuario = dt.Rows[0]["strNombre"].ToString(),
                                StrCampaña = dt.Rows[0]["strCampañaActual"].ToString(),
                                NumPuntos = Convert.ToInt32(dt.Rows[0]["Puntos"]),
                                IdGrupo = Convert.ToInt16(dt.Rows[0]["idgrupo"]),
                                LogEstado = Convert.ToBoolean(dt.Rows[0]["logEstadoUsuario"])


                            };


                            var listaZonas = new List<Zonas>();

                            var dt1 = dts.Tables[2];

                            if (dt1.Rows.Count > 0)
                            {
                                for (int i = 0; i < dt1.Rows.Count; i++)
                                {
                                    listaZonas.Add(new Zonas
                                    {
                                        StrZona = dt1.Rows[i]["strZona"].ToString()
                                    });
                                }

                                lista.ListaZonas = listaZonas;
                            }


                            var dt2 = dts.Tables[3];

                            if (dt2.Rows.Count > 0)
                            {
                                var xmenu = new List<MenuGeneral>();

                                for (int i = 0; i < dt2.Rows.Count; i++)
                                {
                                    xmenu.Add(new MenuGeneral { IdMenu = Convert.ToInt16(dt2.Rows[i]["idMenu"]), StrMenu = dt2.Rows[i]["StrMenu"].ToString() });
                                }

                                lista.ListaMenu = xmenu;
                            }


                            strMensaje = "";
                            return lista;
                        }
                        else
                        {
                            strMensaje = mensaje;
                            return null;

                        }
                    }
                    else
                    {
                        strMensaje = "No hay datos para mostrar";
                        return null;
                    }
                }
                else
                {
                    strMensaje = "No hay conexión con el servidor";
                    return null;
                }

            }
            catch (Exception ex)
            {
                strMensaje = ex.Message;
                return null;
            }
        }


        public List<Campañas> ListaCampañas()
        {
            try
            {
                var parametros = new List<SqlParameter>()
                {
                    new SqlParameter("@tipocon",1)
                };

                var dt = _dataHelper.EjecutarSp<DataTable>("ma_spConsultaCampañasComboBox", parametros);

                if (dt != null)
                {
                    if (dt.Rows.Count > 0)
                    {
                        var xlista = new List<Campañas>();

                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            xlista.Add(new Campañas { StrCampaña = dt.Rows[i]["strCampaña"].ToString() });
                        }

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


    }
}
