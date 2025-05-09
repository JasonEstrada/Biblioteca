const { db } = require("../../models/dbModel"); // Usar la conexión a la base de datos

// Acción para habilitar un usuario
const habilitarUsuarioAction = async (id) => {
  try {
    // Verificar si el usuario existe
    const [result] = await db
      .promise()
      .query("SELECT * FROM usuarios WHERE id = ?", [id]);

    if (result.length === 0) {
      return { error: true, status: 404, message: "Usuario no encontrado" };
    }

    const usuario = result[0];

    // Verificar si el usuario ya está habilitado (activo = 1)
    if (usuario.activo === 1) {
      return {
        error: true,
        status: 400,
        message: "El usuario ya está habilitado",
      };
    }

    // Realizar la habilitación (poner activo = 1)
    await db
      .promise()
      .query(
        "UPDATE usuarios SET activo = 1, fecha_inactivacion = NULL WHERE id = ?",
        [id]
      );

    return { success: true };
  } catch (err) {
    throw new Error("Error al habilitar el usuario: " + err.message);
  }
};

module.exports = {
  habilitarUsuarioAction,
};
