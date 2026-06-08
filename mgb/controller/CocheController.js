const express            = require('express');
const Coche              = require('../model/Coche');
const { CocheService, ValidationError } = require('../service/CocheService');

const router = express.Router();
const cocheService = new CocheService();

// ─── GET /coches?marca=Seat ────────────────────────────────────────────────
/**
 * Consultar coches por marca.
 * Query param: marca (string, obligatorio)
 * Respuestas:
 *   200 OK        → lista de coches (puede ser vacía [])
 *   400 Bad Request → falta el parámetro marca
 *   404 Not Found → ruta no existe
 */
router.get('/coches', async (req, res) => {
  const { marca } = req.query;

  if (!marca) {
    return res.status(400).json({
      error: 'Bad Request',
      mensaje: 'El parámetro "marca" es obligatorio.',
    });
  }

  try {
    const coches = await cocheService.consultarCochesPorMarca(marca);
    return res.status(200).json(coches);
  } catch (err) {
    console.error('Error en GET /coches:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', mensaje: err.message });
  }
});

// ─── POST /coches ─────────────────────────────────────────────────────────
/**
 * Registrar un nuevo coche.
 * Body JSON: { identificador, marca, modelo, cilindrada }
 * Respuestas:
 *   201 Created     → coche creado
 *   400 Bad Request → datos inválidos (cilindrada ≤ 0, campos vacíos…)
 */
router.post('/coches', async (req, res) => {
  const { identificador, marca, modelo, cilindrada } = req.body;

  const coche = new Coche(identificador, marca, modelo, cilindrada);

  try {
    const creado = await cocheService.crearNuevoCoche(coche);
    return res.status(201).json(creado);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: 'Bad Request', mensaje: err.message });
    }
    console.error('Error en POST /coches:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', mensaje: err.message });
  }
});

// ─── 404 catch-all ────────────────────────────────────────────────────────
router.use((req, res) => {
  res.status(404).json({ error: 'Not Found', mensaje: 'El recurso solicitado no existe.' });
});

module.exports = router;
