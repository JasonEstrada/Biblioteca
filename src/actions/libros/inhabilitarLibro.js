const { db } = require("../../models/dbModel"); // Usamos la conexión a la base de datos

// Acción para inhabilitar un libro
const inhabilitarLibroAction = async (id) => {
  try {
    // Verificar si el libro existe
    const [result] = await db
      .promise()
      .query("SELECT * FROM libros WHERE id = ?", [id]);

    if (result.length === 0) {
      return { error: true, status: 404, message: "Libro no encontrado" };
    }

    const libro = result[0];

    // Verificar si el libro ya está inhabilitado (activo = 0)
    if (libro.activo === 0) {
      return {
        error: true,
        status: 400,
        message: "El libro ya está inhabilitado",
      };
    }

    // Realizar el "soft delete" (inhabilitar el libro)
    await db
      .promise()
      .query(
        "UPDATE libros SET activo = 0, fecha_inactivacion = CURRENT_TIMESTAMP WHERE id = ?",
        [id]
      );

    return { success: true };
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error al inhabilitar el libro: " + err.message,
    };
  }
};

module.exports = {
  inhabilitarLibroAction,
};
