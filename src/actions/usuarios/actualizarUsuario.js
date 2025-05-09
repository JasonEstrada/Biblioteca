const { db } = require("../../models/dbModel"); // Usar la conexión a la base de datos
const bcrypt = require("bcryptjs");

// Acción para actualizar un usuario
const actualizarUsuarioAction = async (
  id,
  nombre,
  email,
  contraseña,
  permiso,
  usuarioPermiso
) => {
  // Primero, verificamos si el usuario existe
  try {
    const [result] = await db
      .promise()
      .query("SELECT activo FROM usuarios WHERE id = ?", [id]);

    if (result.length === 0) {
      return { error: true, status: 404, message: "Usuario no encontrado" };
    }

    const usuario = result[0];

    // Verificar si el usuario está inactivo
    if (usuario.activo === 0) {
      return { error: true, status: 400, message: "Usuario inhabilitado" };
    }

    // Preparar la consulta
    let query = "UPDATE usuarios SET";
    const params = [];

    // Solo agregamos a la consulta los campos que fueron proporcionados
    if (nombre) {
      query += " nombre = ?,";
      params.push(nombre);
    }

    // Verificar si el email ya está registrado en otro usuario
    if (email) {
      const [emailCheck] = await db
        .promise()
        .query("SELECT * FROM usuarios WHERE email = ? AND id != ?", [
          email,
          id,
        ]);
      if (emailCheck.length > 0) {
        return { error: true, status: 400, message: "El correo ya está registrado." };
      }
    }

    if (email) {
      query += " email = ?,";
      params.push(email);
    }

    if (contraseña) {
      try {
        // Paso 1: Generar el Salt
        const salt = await bcrypt.genSalt(10);

        // Paso 2: Concatenar el Pepper a la contraseña
        const pepperedPassword = contraseña + process.env.PEPPER; // Concatenamos el pepper a la contraseña

        // Paso 3: Crear el Hash con el Salt y el Pepper
        const hashedPassword = await bcrypt.hash(pepperedPassword, salt);

        // Agregar la contraseña cifrada a la consulta
        params.push(hashedPassword);
        query += " contraseña = ?,";
      } catch (error) {
        return {
          error: true,
          status: 500,
          message: "Error al procesar la contraseña",
        };
      }
    }

    if (permiso && usuarioPermiso === "admin") {
      query += " permiso = ?,";
      params.push(permiso);
    } else if (permiso) {
      return {
        error: true,
        status: 403,
        message:
          "Solo el administrador puede modificar los permisos de un usuario.",
      };
    }

    // Eliminar la última coma extra en la consulta
    query = query.slice(0, -1);

    // Agregar la condición para actualizar el usuario con el ID especificado
    query += " WHERE id = ?";
    params.push(id);

    // Ejecutar la consulta
    await db.promise().query(query, params);

    return { success: true };
  } catch (err) {
    throw new Error(
      "Error en la acción de actualización de usuario: " + err.message
    );
  }
};

module.exports = {
  actualizarUsuarioAction,
};
