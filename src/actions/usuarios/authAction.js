const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db } = require("../../models/dbModel");  // Importamos la conexión a la base de datos

// Acción para verificar si el usuario existe y comparar la contraseña
const loginUsuarioAction = async (email, contraseña) => {
  try {
    // Verificar si el usuario existe
    const [result] = await db.promise().query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (result.length === 0) {
      return { error: true, message: "Usuario no encontrado" };
    }

    const usuario = result[0];

    // Verificar si el usuario está inactivo (campo 'activo' igual a 0)
    if (usuario.activo === 0) {
      return { error: true, message: "El usuario se encuentra inactivo, comuníquese con el administrador" };
    }

    // Comparar la contraseña proporcionada con la almacenada (usando bcrypt)
    const isMatch = await bcrypt.compare(contraseña + process.env.PEPPER, usuario.contraseña);

    if (!isMatch) {
      return { error: true, message: "Contraseña incorrecta" };
    }

    // Crear el token JWT
    const payload = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      permiso: usuario.permiso,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return { token };  // Retornar el token

  } catch (err) {
    throw new Error("Error en la consulta de login: " + err.message);
  }
};

module.exports = { loginUsuarioAction };
