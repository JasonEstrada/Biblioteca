const { db } = require("../../models/dbModel"); // Usamos la conexión a la base de datos

// Acción para crear un libro
const crearLibroAction = async (
  titulo,
  autor,
  genero,
  editorial,
  fecha_publicacion
) => {
  const query =
    "INSERT INTO libros (titulo, autor, genero, editorial, fecha_publicacion) VALUES (?, ?, ?, ?, ?)";

  try {
    const [result] = await db
      .promise()
      .query(query, [titulo, autor, genero, editorial, fecha_publicacion]);

    // Retorna el ID del libro recién insertado
    return { success: true, id: result.insertId };
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error al crear el libro: " + err.message,
    };
  }
};

module.exports = {
  crearLibroAction,
};
