const express            = require('express');
const Coche              = require('../model/Coche');
const { CocheService, ValidationError } = require('../service/CocheService');

const router = express.Router();
const cocheService = new CocheService();

//GET /coches?marca=Seat 

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
    return res.status(200).json({ version: "1.1", data: coches });
  } catch (err) {
    console.error('Error en GET /coches:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', mensaje: err.message });
  }
});

// POT /coches 

router.post('/coches', async (req, res) => {
  const { identificador, marca, modelo, cilindrada } = req.body;

  const coche = new Coche(identificador, marca, modelo, cilindrada);

  try {
    const creado = await cocheService.crearNuevoCoche(coche);
    return res.status(201).json(creado);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ error: 'BadRequest', mensaje: err.message });
    }
    console.error('Error en POST /coches:', err.message);
    return res.status(500).json({ error: 'Internal Server Error', mensaje: err.message });
  }
});

// ─── 404 catch-all ────────────────────────────────────────────────────────
router.use((req, res) => {
  res.status(404).json({ error: 'Not Found', mensaje: 'El recurso solictado no existe.' });
});

module.exports = router;
