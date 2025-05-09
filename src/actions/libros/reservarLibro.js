const { db } = require("../../models/dbModel"); // Usamos la conexión a la base de datos

// Acción para reservar un libro
const reservarLibroAction = async (
  id,
  usuarioId,
  nombreUsuario,
  fecha_entrega
) => {
  try {
    // Verificar si el libro está disponible (activo = 1, disponibilidad = 1)
    const [result] = await db
      .promise()
      .query(
        "SELECT * FROM libros WHERE id = ? AND disponibilidad = 1 AND activo = 1",
        [id]
      );

    if (result.length === 0) {
      return {
        error: true,
        status: 404,
        message: "Libro no disponible para reserva",
      };
    }

    // Obtener la fecha actual (fecha de la reserva)
    const fechaReserva = new Date();

    // Verificar que la fecha de entrega no sea anterior a la fecha de reserva
    if (new Date(fecha_entrega) < fechaReserva) {
      return {
        error: true,
        status: 400,
        message:
          "La fecha de entrega no puede ser anterior a la fecha de reserva.",
      };
    }

    // Realizar la reserva en la base de datos
    const queryReserva =
      "INSERT INTO reservas (libro_id, usuario_id, nombre_usuario, fecha_reserva, fecha_entrega) VALUES (?, ?, ?, ?, ?)";
    const [reservaResult] = await db
      .promise()
      .query(queryReserva, [
        id,
        usuarioId,
        nombreUsuario,
        fechaReserva,
        fecha_entrega,
      ]);

    // Marcar el libro como no disponible (disponibilidad = 0) después de la reserva
    const queryActualizarDisponibilidad =
      "UPDATE libros SET disponibilidad = 0 WHERE id = ?";
    await db.promise().query(queryActualizarDisponibilidad, [id]);

    return { success: true };
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error al realizar la reserva: " + err.message,
    };
  }
};

module.exports = {
  reservarLibroAction,
};
