const express = require("express");
const router = express.Router();
const {
  crearLibro,
  buscarLibro,
  actualizarLibro,
  inhabilitarLibro,
  habilitarLibro,
  reservarLibro,
  obtenerHistorialReservas,
  entregarLibro,
} = require("../controllers/libroController");
const {
  verificarToken,
} = require("../middleware/authMiddleware");

router.post("/crear", verificarToken, crearLibro);

router.get("/buscar", buscarLibro);

router.put("/actualizar/:id", verificarToken, actualizarLibro);

router.delete("/inhabilitar/:id", verificarToken, inhabilitarLibro);

router.put("/habilitar/:id", verificarToken,  habilitarLibro);

router.post("/reservar/:id", verificarToken, reservarLibro);

router.get("/reservas/:id", verificarToken, obtenerHistorialReservas);

router.put("/entregar/:id", verificarToken, entregarLibro);

module.exports = router;
