const { db } = require("../../models/dbModel"); // Usamos la conexión a la base de datos

// Acción para actualizar un libro
const actualizarLibroAction = async (
  id,
  titulo,
  autor,
  genero,
  fecha_publicacion,
  editorial,
  disponibilidad
) => {
  try {
    // Verificar si el libro existe
    const [result] = await db
      .promise()
      .query("SELECT activo FROM libros WHERE id = ?", [id]);

    if (result.length === 0) {
      return { error: true, status: 404, message: "Libro no encontrado" };
    }

    const libro = result[0];

    // Verificar si el libro está inactivo (activo = 0)
    if (libro.activo === 0) {
      return { error: true, status: 400, message: "Libro inhabilitado" };
    }

    // Preparar la consulta para actualizar los campos proporcionados
    let query = "UPDATE libros SET";
    const params = [];

    // Solo agregamos a la consulta los campos que fueron proporcionados
    if (titulo) {
      query += " titulo = ?,";
      params.push(titulo);
    }

    if (autor) {
      query += " autor = ?,";
      params.push(autor);
    }

    if (genero) {
      query += " genero = ?,";
      params.push(genero);
    }

    if (fecha_publicacion) {
      query += " fecha_publicacion = ?,";
      params.push(fecha_publicacion);
    }

    if (editorial) {
      query += " editorial = ?,";
      params.push(editorial);
    }

    if (disponibilidad !== undefined) {
      query += " disponibilidad = ?,";
      params.push(disponibilidad ? 1 : 0); // Convertir disponibilidad a booleano (1 o 0)
    }

    // Eliminar la última coma extra en la consulta
    query = query.slice(0, -1);

    // Agregar la condición para actualizar el libro con el ID especificado
    query += " WHERE id = ?";
    params.push(id);

    // Ejecutar la consulta
    await db.promise().query(query, params);

    return { success: true };
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error al actualizar el libro: " + err.message,
    };
  }
};

module.exports = {
  actualizarLibroAction,
};
