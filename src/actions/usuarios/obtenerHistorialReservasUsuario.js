const { db } = require("../../models/dbModel"); // Usar la conexión a la base de datos

const obtenerHistorialReservasUsuarioAction = async (idUsuarioConsulta) => {
  const query = `
    SELECT libros.id AS id_libro, libros.titulo AS nombre_libro, reservas.id AS id_reserva, reservas.fecha_reserva, reservas.fecha_entrega
    FROM reservas
    JOIN libros ON reservas.libro_id = libros.id
    WHERE reservas.usuario_id = ?
  `;

  try {
    const [result] = await db.promise().query(query, [idUsuarioConsulta]);
    return result; // Retorna los resultados de la consulta
  } catch (err) {
    return {
      error: true,
      status: 500,
      message: "Error en la consulta de reservas: " + err.message,
    };
  }
};

module.exports = {
  obtenerHistorialReservasUsuarioAction,
};
