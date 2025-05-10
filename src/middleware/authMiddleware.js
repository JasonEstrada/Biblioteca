const jwt = require('jsonwebtoken');
require('dotenv').config();


// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({ message: 'No autorizado. No hay token.' });
  }

  // Verificar el token usando la clave secreta
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token no válido.' });
  }
};

module.exports = { verificarToken };
