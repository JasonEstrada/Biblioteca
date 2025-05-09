const { db } = require("../../models/dbModel"); // Usamos la conexión a la base de datos

// Acción para entregar un libro
const entregarLibroAction = async (id) => {
  const fechaEntrega = new Date().toISOString().slice(0, 19).replace("T", " "); // Formato MySQL: YYYY-MM-DD HH:MM:SS

  try {
    // Verificar si la reserva existe
    const [result] = await db
      .promise()
      .query("SELECT * FROM reservas WHERE id = ?", [id]);

    if (result.length === 0) {
      return { error: true, status: 404, message: "Reserva no encontrada" };
    }

    const reserva = result[0];

    // Verificar si la reserva ya fue entregada
    if (reserva.activo === 0) {
      return {
        error: true,
        status: 400,
        message: "Esta reserva ya se entregó",
      };
    }

    const libro_id = reserva.libro_id; // ID del libro asociado a la reserva

    // Actualizar la fecha de entrega en la reserva
    await db
      .promise()
      .query("UPDATE reservas SET fecha_entrega = ?, activo = 0 WHERE id = ?", [
        fechaEntrega,
        id,
      ]);

    // Marcar el libro como disponible (disponibilidad = 1)
    await db
      .promise()
      .query("UPDATE libros SET disponibilidad = 1 WHERE id = ?", [libro_id]);

    return { success: true };
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error al entregar el libro: " + err.message,
    };
  }
};

module.exports = {
  entregarLibroAction,
};
