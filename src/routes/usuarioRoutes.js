const { Router } = require("express");
const {
  crearUsuario,
  actualizarUsuario,
  inhabilitarUsuario,
  habilitarUsuario,
  obtenerUsuarios,
  obtenerHistorialReservasUsuario,
  loginUsuario,
} = require("../controllers/usuarioController");
const { verificarToken } = require("../middleware/authMiddleware");

const router = Router();

// Rutas de usuario
router.post("/registro", crearUsuario);
router.put("/actualizar/:id", verificarToken, actualizarUsuario);
router.delete("/inhabilitar/:id", verificarToken, inhabilitarUsuario);
router.put("/admin/habilitar/:id", verificarToken, habilitarUsuario);
router.get("/buscar", obtenerUsuarios);
router.get("/reservas", verificarToken, obtenerHistorialReservasUsuario);
router.get("/reservas/:id", verificarToken, obtenerHistorialReservasUsuario);
router.post("/login", loginUsuario);

module.exports = router;
