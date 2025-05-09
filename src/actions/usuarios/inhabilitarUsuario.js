const { db } = require("../../models/dbModel"); // Usar la conexión a la base de datos

// Acción para inhabilitar un usuario
const inhabilitarUsuarioAction = async (id) => {
  try {
    // Verificar si el usuario existe
    const [result] = await db.promise().query("SELECT * FROM usuarios WHERE id = ?", [id]);

    if (result.length === 0) {
      return { error: true, status: 404, message: "Usuario no encontrado" };
    }

    const usuario = result[0];

    // Verificar si el usuario ya está inhabilitado (activo = 0)
    if (usuario.activo === 0) {
      return { error: true, status: 400, message: "El usuario ya está inhabilitado" };
    }

    // Realizar el "soft delete" (inhabilitar el usuario)
    await db.promise().query("UPDATE usuarios SET activo = 0, fecha_inactivacion = CURRENT_TIMESTAMP WHERE id = ?", [id]);

    return { success: true };

  } catch (err) {
    throw new Error("Error al inhabilitar el usuario: " + err.message);
  }
};


module.exports = {
  inhabilitarUsuarioAction,
};