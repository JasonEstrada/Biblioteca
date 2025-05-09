const { db } = require("../../models/dbModel"); // Usamos la conexión a la base de datos

// Acción para obtener el historial de reservas de un libro
const obtenerHistorialReservasAction = async (id) => {
  try {
    // Consultar el historial de reservas del libro
    const [result] = await db
      .promise()
      .query("SELECT * FROM reservas WHERE libro_id = ?", [id]);

    if (result.length === 0) {
      return {
        error: true,
        status: 404,
        message: "No se encontraron reservas para este libro",
      };
    }

    return result; // Retorna el historial de reservas
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error en la consulta del historial de reservas: " + err.message,
    };
  }
};

module.exports = {
  obtenerHistorialReservasAction,
};
