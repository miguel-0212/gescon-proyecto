const express          = require('express');
const cocheController  = require('./controller/CocheController');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());

// ── Rutas ───────────────────────────────────────────────────────────────────
app.use('/', cocheController);

// ──mensaje 404 global (rutas no definidas) ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', mensaje: 'La ruta solicitada no existe.' });
});

// ── Arranque ─────────────────────────────────────────────────────────────────
// Solo funciona si este archivo es el punto de entrada (no en tests)
if (require.main === module) {
  app.listen(PORT, () => {
      console.log(`   API gescon_mgb v1.1 corriendo en http://localhost:${PORT}`);
      console.log(`   GET  /coches?marca=Seat`);
      console.log(`   POST /coches`);
      console.log(`   Proyecto integrador — Miguel González Bobes`);
  });
}

module.exports = app;
