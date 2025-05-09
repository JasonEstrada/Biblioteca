const { db } = require("../../models/dbModel"); // Usar la conexión a la base de datos

// Acción para obtener los usuarios con filtros
const obtenerUsuariosAction = async (id, incluyendo_inhabilitados) => {
  let query = "SELECT id, nombre, email FROM usuarios WHERE 1=1"; // Base de la consulta
  const params = [];

  // Agregar filtros a la consulta si están presentes en los parámetros
  if (id) {
    query += " AND id = ?";
    params.push(id);
  }

  // Si no se pide incluir inhabilitados, solo mostramos los usuarios activos (activo = 1)
  if (!incluyendo_inhabilitados || incluyendo_inhabilitados !== "true") {
    query += " AND activo = 1"; // Solo usuarios activos por defecto
  }

  try {
    const [result] = await db.promise().query(query, params);
    return result; // Retorna los resultados
  } catch (err) {
    throw new Error("Error en la consulta de usuarios: " + err.message);
  }
};

module.exports = { obtenerUsuariosAction };
