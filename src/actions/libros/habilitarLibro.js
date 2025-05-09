const { db } = require("../../models/dbModel"); // Usamos la conexión a la base de datos

// Acción para habilitar un libro
const habilitarLibroAction = async (id) => {
  try {
    // Verificar si el libro existe
    const [result] = await db
      .promise()
      .query("SELECT * FROM libros WHERE id = ?", [id]);

    if (result.length === 0) {
      return { error: true, status: 404, message: "Libro no encontrado" };
    }

    const libro = result[0];

    // Verificar si el libro ya está habilitado (activo = 1)
    if (libro.activo === 1) {
      return {
        error: true,
        status: 400,
        message: "El libro ya está habilitado",
      };
    }

    // Realizar la habilitación (poner activo = 1)
    await db
      .promise()
      .query(
        "UPDATE libros SET activo = 1, fecha_inactivacion = NULL WHERE id = ?",
        [id]
      );

    return { success: true };
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error al habilitar el libro: " + err.message,
    };
  }
};

module.exports = {
  habilitarLibroAction,
};
