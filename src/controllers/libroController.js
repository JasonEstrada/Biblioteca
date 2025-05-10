const { crearLibroAction } = require("../actions/libros/crearLibro");
const { buscarLibroAction } = require("../actions/libros/buscarLibro");
const { actualizarLibroAction } = require("../actions/libros/actualizarLibro");
const {  inhabilitarLibroAction } = require("../actions/libros/inhabilitarLibro");
const { habilitarLibroAction } = require("../actions/libros/habilitarLibro");
const { reservarLibroAction } = require("../actions/libros/reservarLibro");
const { entregarLibroAction } = require("../actions/libros/entregarLibro");
const { obtenerHistorialReservasAction } = require("../actions/libros/obtenerHistorialReservas");

// Controlador para crear un libro
const crearLibro = async (req, res) => {
  const { titulo, autor, genero, editorial, fecha_publicacion } = req.body;

  // Verificar si el usuario tiene el permiso adecuado para crear libros
  const permisos = Array.isArray(req.user.permiso) ? req.user.permiso : [];

  // Verificar si el usuario tiene el permiso para crear libros
  if (!permisos.includes("crear_libro") && !permisos.includes("admin")) {
    return res.status(403).json({
      message: "No tienes permisos para crear un libro.",
    });
  }

  // Validar que todos los campos estén presentes
  if (!titulo || !autor || !genero || !editorial || !fecha_publicacion) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Delegar la lógica de creación del libro a la acción correspondiente
    const result = await crearLibroAction(
      titulo,
      autor,
      genero,
      editorial,
      fecha_publicacion
    );

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(201).json({ message: "Libro creado con éxito", id: result.id });
  } catch (error) {
    console.error("Error al crear el libro:", error);
    res.status(500).json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para buscar libros
const buscarLibro = async (req, res) => {
  const {
    id,
    genero,
    fecha_publicacion,
    editorial,
    autor,
    nombre,
    disponibilidad,
    incluyendo_inhabilitados,
  } = req.query;

  try {
    // Delegar la lógica de búsqueda de libros a la acción correspondiente
    const result = await buscarLibroAction(
      id,
      genero,
      fecha_publicacion,
      editorial,
      autor,
      nombre,
      disponibilidad,
      incluyendo_inhabilitados
    );

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "No se encontraron libros con esos parámetros de búsqueda",
      });
    }

    // Responder con los resultados de la búsqueda
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al buscar libros:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para actualizar un libro
const actualizarLibro = async (req, res) => {
  const { id } = req.params; // ID del libro a actualizar
  const {
    titulo,
    autor,
    genero,
    fecha_publicacion,
    editorial,
    disponibilidad,
  } = req.body;

  // Verificar los permisos del usuario
  const permisos = Array.isArray(req.user.permiso) ? req.user.permiso : [];

  // Verificar si el usuario tiene el permiso adecuado para modificar libros
  if (!permisos.includes("modificar_libro") && !permisos.includes("admin")) {
    return res.status(403).json({
      message: "No tienes permisos para modificar este libro.",
    });
  }

  try {
    // Delegar la lógica de actualización del libro a la acción correspondiente
    const result = await actualizarLibroAction(
      id,
      titulo,
      autor,
      genero,
      fecha_publicacion,
      editorial,
      disponibilidad
    );

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({ message: "Libro actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el libro:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para inhabilitar un libro
const inhabilitarLibro = async (req, res) => {
  const { id } = req.params; // ID del libro a inhabilitar

  // Verificar los permisos del usuario
  const permisos = Array.isArray(req.user.permiso) ? req.user.permiso : [];

  // Verificar si el usuario tiene el permiso adecuado para inhabilitar libros
  if (!permisos.includes("inhabilitar_libro") && !permisos.includes("admin")) {
    return res.status(403).json({
      message: "No tienes permisos para inhabilitar este libro.",
    });
  }

  try {
    // Delegar la lógica de inhabilitación del libro a la acción correspondiente
    const result = await inhabilitarLibroAction(id);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({ message: "Libro inhabilitado con éxito" });
  } catch (error) {
    console.error("Error al inhabilitar el libro:", error);
    res.status(500).json({ message: "Error en el servidor, intente más tarde." });
  }
};


// Controlador para habilitar un libro
const habilitarLibro = async (req, res) => {
  const { id } = req.params; // ID del libro a habilitar

  // Verificar los permisos del usuario
  const permisos = Array.isArray(req.user.permiso) ? req.user.permiso : [];

  // Verificar si el usuario tiene el permiso adecuado para habilitar libros
  if (!permisos.includes("habilitar_libro") && !permisos.includes("admin")) {
    return res.status(403).json({
      message: "No tienes permisos para habilitar este libro.",
    });
  }

  try {
    // Delegar la lógica de habilitación del libro a la acción correspondiente
    const result = await habilitarLibroAction(id);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({ message: "Libro habilitado con éxito" });
  } catch (error) {
    console.error("Error al habilitar el libro:", error);
    res.status(500).json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para reservar un libro
const reservarLibro = async (req, res) => {
  const { id } = req.params; // ID del libro a reservar
  const usuarioId = req.user.id; // ID del usuario autenticado
  const nombreUsuario = req.user.nombre; // Nombre del usuario autenticado
  const { fecha_entrega } = req.body; // Fecha de entrega proporcionada por el usuario

  // Validar que la fecha de entrega es válida
  if (!fecha_entrega || isNaN(new Date(fecha_entrega).getTime())) {
    return res.status(400).json({ message: "Fecha de entrega inválida." });
  }

  try {
    // Delegar la lógica de reserva del libro a la acción correspondiente
    const result = await reservarLibroAction(
      id,
      usuarioId,
      nombreUsuario,
      fecha_entrega
    );

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(201).json({ message: "Reserva realizada con éxito" });
  } catch (error) {
    console.error("Error al realizar la reserva:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para entregar un libro
const entregarLibro = async (req, res) => {
  const { id } = req.params; // ID de la reserva a entregar

  // Verificar los permisos del usuario
  const permisos = Array.isArray(req.user.permiso) ? req.user.permiso : [];

  // Verificar si el usuario tiene el permiso adecuado para entregar libros
  if (!permisos.includes("entregar_libro") && !permisos.includes("admin")) {
    return res.status(403).json({
      message: "No tienes permisos para entregar este libro.",
    });
  }

  try {
    // Delegar la lógica de entrega del libro a la acción correspondiente
    const result = await entregarLibroAction(id);

    if (result.error) {
      return res.status(result.status).json({ message: result.message });
    }

    res.status(200).json({
      message: "Libro entregado y disponibilidad actualizada con éxito",
    });
  } catch (error) {
    console.error("Error al entregar el libro:", error);
    res.status(500).json({ message: "Error en el servidor, intente más tarde." });
  }
};

// Controlador para obtener el historial de reservas de un libro
const obtenerHistorialReservas = async (req, res) => {
  const { id } = req.params; // ID del libro para obtener su historial de reservas

  try {
    // Delegar la lógica de obtener el historial de reservas a la acción correspondiente
    const result = await obtenerHistorialReservasAction(id);

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
  crearLibro,
  buscarLibro,
  actualizarLibro,
  inhabilitarLibro,
  habilitarLibro,
  reservarLibro,
  entregarLibro,
  obtenerHistorialReservas,
};
