const { db } = require("../../models/dbModel"); // Usar la conexión a la base de datos
const bcrypt = require("bcryptjs");

// Acción para crear un usuario
const crearUsuarioAction = async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  // Validar que todos los campos estén presentes
  if (!nombre || !email || !contraseña) {
    return res
      .status(400)
      .json({ message: "Nombre, correo y contraseña son requeridos" });
  }

  // Verificar si el correo ya está registrado
  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error en la consulta a la base de datos" });
      }

      if (result.length > 0) {
        const usuario = result[0];

        // Verificar si el usuario está inactivo (campo 'activo' igual a 0)
        if (usuario.activo === 0) {
          return res.status(400).json({
            message:
              "El usuario ya está registrado y se encuentra inactivo, comuníquese con el administrador",
          });
        }

        return res
          .status(400)
          .json({ message: "El correo electrónico ya está registrado" });
      }

      try {
        // Paso 1: Generar el Salt
        const salt = await bcrypt.genSalt(10);

        // Paso 2: Aplicar el Pepper a la contraseña
        const pepperedPassword = contraseña + process.env.PEPPER; // Concatenamos el pepper a la contraseña

        // Paso 3: Crear el Hash con el Salt y el Pepper
        const hashedPassword = await bcrypt.hash(pepperedPassword, salt);

        // Paso 4: Insertar el nuevo usuario en la base de datos
        const query =
          "INSERT INTO usuarios (nombre, email, contraseña, salt) VALUES (?, ?, ?, ?)";
        db.query(
          query,
          [nombre, email, hashedPassword, salt],
          (err, result) => {
            if (err) {
              console.error("Error al insertar el usuario:", err);
              return res
                .status(500)
                .json({ message: "Error al crear el usuario" });
            }

            res.status(201).json({
              message: "Usuario creado con éxito",
              id: result.insertId,
            });
          }
        );
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el usuario" });
      }
    }
  );
};

module.exports = { crearUsuarioAction};
