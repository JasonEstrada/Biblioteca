const { crearUsuarioAction } = require("../actions/usuarios/crearUsuario");
const { obtenerUsuariosAction } = require("../actions/usuarios/obtenerUsuarios");
const { actualizarUsuarioAction } = require("../actions/usuarios/actualizarUsuario");
const { inhabilitarUsuarioAction } = require("../actions/usuarios/inhabilitarUsuario");
const { habilitarUsuarioAction } = require("../actions/usuarios/habilitarUsuario");
const { obtenerHistorialReservasUsuarioAction } = require("../actions/usuarios/obtenerHistorialReservasUsuario");
const { loginUsuarioAction } = require("../actions/usuarios/authAction");

// Controladores de usuarios
const crearUsuario = (req, res) => {
  crearUsuarioAction(req, res);
};

// Función para manejar el login
const loginUsuario = async (req, res) => {
  const { email, contraseña } = req.body;

  // Verificar si el correo y la contraseña fueron proporcionados
  if (!email || !contraseña) {
    return res
      .status(400)
      .json({ message: "Correo y contraseña son requeridos." });
  }

  try {
    // Delegar la lógica de la autenticación a la capa de acción
    const response = await loginUsuarioAction(email, contraseña);

    if (response.error) {
      return res.status(400).json({ message: response.message });
    }

    // Si el login es exitoso, retornamos el token
    res
      .status(200)
      .json({ message: "Inicio de sesión exitoso", token: response.token });
  } catch (error) {
    console.error("Error en el login:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para obtener los usuarios
const obtenerUsuarios = async (req, res) => {
  const { id, incluyendo_inhabilitados } = req.query;

  try {
    // Delegar la lógica de la consulta a la acción
    const result = await obtenerUsuariosAction(id, incluyendo_inhabilitados);

    // Si no hay resultados
    if (result.length === 0) {
      return res.status(404).json({
        message: "No se encontraron usuarios con esos parámetros de búsqueda",
      });
    }

    // Retornar los resultados de la búsqueda
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res
      .status(500)
      .json({ message: "Error en la consulta a la base de datos" });
  }
};

// Controlador para actualizar los datos de un usuario
const actualizarUsuario = async (req, res) => {
  const { id } = req.params; // ID del usuario a actualizar
  const { nombre, email, contraseña, permiso } = req.body;
  const usuarioId = req.user.id; // ID del usuario autenticado (de la decodificación del JWT)

  // Solo se puede actualizar el propio perfil o un perfil si el usuario tiene permisos
  if (id != usuarioId && !req.user.permiso.includes("actualizar_usuario") && !req.user.permiso.includes("admin")) {
    return res.status(403).json({
      message: "No tienes permisos para modificar este usuario.",
    });
  }

  try {
    // Delegar la lógica de la actualización de usuario a la capa de acción
    const result = await actualizarUsuarioAction(
      id,
      nombre,
      email,
      contraseña,
      permiso,
      req.user.permiso
    );

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({ message: "Usuario actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error en el servidor, intente más tarde." });
  }
};


// Controlador para inhabilitar un usuario
const inhabilitarUsuario = async (req, res) => {
  const { id } = req.params; // ID del usuario a inhabilitar
  const usuarioId = req.user.id; // ID del usuario autenticado (de la decodificación del JWT)
  const permisos = Array.isArray(req.user.permiso) ? req.user.permiso : [];

  // Verificar si el usuario está intentando inhabilitar su propio perfil o es un admin
  // Verificar si el usuario tiene permiso para inhabilitar un usuario
  if (id != usuarioId && !permisos.includes("inhabilitar_usuario") && !permisos.includes("admin")) {
    return res.status(403).json({
      message: "No tienes permisos para inhabilitar este usuario.",
    });
  }

  try {
    // Delegar la lógica de inhabilitación de usuario a la acción correspondiente
    const result = await inhabilitarUsuarioAction(id);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({ message: "Usuario inhabilitado con éxito" });
  } catch (error) {
    console.error("Error al inhabilitar usuario:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para habilitar un usuario
const habilitarUsuario = async (req, res) => {
  const { id } = req.params; // ID del usuario a habilitar

  // Verificar los permisos del usuario
  const permisos = Array.isArray(req.user.permiso) ? req.user.permiso : [];

  // Verificar si el usuario tiene permisos para habilitar un usuario
  if (!permisos.includes("habilitar_usuario") && !permisos.includes("admin")) {
    return res.status(403).json({
      message: "No tienes permisos para habilitar este usuario.",
    });
  }

  try {
    // Delegar la lógica de habilitación de usuario a la acción correspondiente
    const result = await habilitarUsuarioAction(id);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({ message: "Usuario habilitado con éxito" });
  } catch (error) {
    console.error("Error al habilitar usuario:", error);
    res.status(500).json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para obtener el historial de reservas de un usuario
const obtenerHistorialReservasUsuario = async (req, res) => {
  const usuarioId = req.user.id; // ID del usuario autenticado (de la decodificación del JWT)
  const idUsuarioConsulta = req.params.id || usuarioId; // Si no se pasa el ID, se usa el ID del usuario autenticado

  const permisos = Array.isArray(req.user.permiso) ? req.user.permiso : [];

  // Verificar si el usuario tiene permisos para consultar el historial de otro usuario (si no es administrador)
  if (idUsuarioConsulta !== usuarioId && !permisos.includes("ver_historial_usuario") && !permisos.includes("admin")) {
    return res
      .status(403)
      .json({
        message: "No tienes permisos para ver el historial de este usuario.",
      });
  }

  try {
    // Delegar la lógica de obtener el historial de reservas a la acción correspondiente
    const result = await obtenerHistorialReservasUsuarioAction(
      idUsuarioConsulta
    );

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json(result); // Retornar el historial de reservas
  } catch (error) {
    console.error("Error al obtener el historial de reservas:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor, intente más tarde." });
  }
};

module.exports = {
  crearUsuario,
  loginUsuario,
  obtenerUsuarios,
  actualizarUsuario,
  inhabilitarUsuario,
  habilitarUsuario,
  obtenerHistorialReservasUsuario,
};
