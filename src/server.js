const express = require("express");
const cors = require("cors");

// Importar rutas
const usuarioRoutes = require("./routes/usuarioRoutes");
const libroRoutes = require("./routes/libroRoutes");

// Crear el servidor
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/libros", libroRoutes);

// Fallback de rutas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada." });
});

// Puerto
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
