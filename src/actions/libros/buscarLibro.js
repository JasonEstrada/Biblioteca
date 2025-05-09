const { db } = require("../../models/dbModel"); // Usamos la conexión a la base de datos

// Acción para buscar libros con filtros
const buscarLibroAction = async (
  id,
  genero,
  fecha_publicacion,
  editorial,
  autor,
  nombre,
  disponibilidad,
  incluyendo_inhabilitados
) => {
  let query =
    "SELECT id, titulo, autor, genero, editorial, fecha_publicacion, disponibilidad FROM libros WHERE 1=1"; // 1=1 es una condición siempre verdadera

  const params = [];

  // Agregar filtros a la consulta si están presentes en los parámetros
  if (id) {
    query += " AND id = ?";
    params.push(id);
  }
  if (genero) {
    query += " AND genero LIKE ?";
    params.push(`%${genero}%`);
  }
  if (fecha_publicacion) {
    query += " AND fecha_publicacion = ?";
    params.push(fecha_publicacion);
  }
  if (editorial) {
    query += " AND editorial LIKE ?";
    params.push(`%${editorial}%`);
  }
  if (autor) {
    query += " AND autor LIKE ?";
    params.push(`%${autor}%`);
  }
  if (nombre) {
    query += " AND titulo LIKE ?";
    params.push(`%${nombre}%`);
  }
  if (disponibilidad !== undefined) {
    query += " AND disponibilidad = ?";
    params.push(disponibilidad === "true" ? 1 : 0);
  }

  // Si no se solicita incluir inhabilitados, solo mostrar los libros activos
  if (!incluyendo_inhabilitados || incluyendo_inhabilitados !== "true") {
    query += " AND activo = 1"; // Solo libros activos por defecto
  }

  try {
    const [result] = await db.promise().query(query, params);
    return result; // Retorna los resultados de la búsqueda
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error en la consulta de libros: " + err.message,
    };
  }
};

module.exports = {
  buscarLibroAction,
};
