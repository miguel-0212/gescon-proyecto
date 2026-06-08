/**
 * Tests unitarios de CocheService.
 *
 * Cubre los casos de prueba definidos en el Proyecto Integrador (sección 7):
 *
 * consultarCochesPorMarca:
 *   CP1 - Marca existente "Seat"  → lista con 3 coches
 *   CP2 - Marca inexistente "Ferrari" → lista vacía []
 *
 * crearNuevoCoche:
 *   CP1 - cilindrada = null        → ValidationError 400
 *   CP2 - cilindrada = 0 / -1200   → ValidationError 400
 *   CP3 - Datos válidos            → Coche creado (201)
 *
 * Extras para robustez:
 *   - Marca vacía / nula           → lista vacía (sin golpear la BD)
 *   - Marca o modelo vacíos        → ValidationError 400
 */

const { CocheService, ValidationError } = require('../mgb/service/CocheService');
const Coche = require('../mgb/model/Coche');

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Crea un mock del repositorio con los métodos necesarios. */
function crearRepositorioMock({ cochesPorMarca = [], cocheGuardado = null } = {}) {
  return {
    findByMarca: jest.fn().mockResolvedValue(cochesPorMarca),
    save:        jest.fn().mockResolvedValue(cocheGuardado),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// BLOQUE 1: consultarCochesPorMarca
// ────────────────────────────────────────────────────────────────────────────
describe('CocheService › consultarCochesPorMarca', () => {

  // CP1 — Marca existente
  test('CP1 · Marca "Seat" → devuelve lista con 3 coches', async () => {
    const seats = [
      new Coche(2, 'Seat', 'León',  1600),
      new Coche(4, 'Seat', 'Clio',  1400),
      new Coche(5, 'Seat', 'Ibiza', 1400),
    ];
    const repo    = crearRepositorioMock({ cochesPorMarca: seats });
    const service = new CocheService(repo);

    const resultado = await service.consultarCochesPorMarca('Seat');

    expect(resultado).toHaveLength(3);
    expect(repo.findByMarca).toHaveBeenCalledWith('Seat');
    resultado.forEach(c => expect(c.marca).toBe('Seat'));
  });

  // CP2 — Marca inexistente
  test('CP2 · Marca "Ferrari" → devuelve lista vacía []', async () => {
    const repo    = crearRepositorioMock({ cochesPorMarca: [] });
    const service = new CocheService(repo);

    const resultado = await service.consultarCochesPorMarca('Ferrari');

    expect(resultado).toEqual([]);
    expect(repo.findByMarca).toHaveBeenCalledWith('Ferrari');
  });

  // Extra — Entrada nula
  test('EXTRA · Marca null → devuelve lista vacía sin llamar al repositorio', async () => {
    const repo    = crearRepositorioMock();
    const service = new CocheService(repo);

    const resultado = await service.consultarCochesPorMarca(null);

    expect(resultado).toEqual([]);
    expect(repo.findByMarca).not.toHaveBeenCalled();
  });

  // Extra — Entrada cadena vacía
  test('EXTRA · Marca "" → devuelve lista vacía sin llamar al repositorio', async () => {
    const repo    = crearRepositorioMock();
    const service = new CocheService(repo);

    const resultado = await service.consultarCochesPorMarca('');

    expect(resultado).toEqual([]);
    expect(repo.findByMarca).not.toHaveBeenCalled();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// BLOQUE 2: crearNuevoCoche
// ────────────────────────────────────────────────────────────────────────────
describe('CocheService › crearNuevoCoche', () => {

  // CP1 — Cilindrada nula
  test('CP1 · cilindrada = null → lanza ValidationError (400)', async () => {
    const repo    = crearRepositorioMock();
    const service = new CocheService(repo);
    const coche   = new Coche(10, 'Volkswagen', 'Golf', null);

    await expect(service.crearNuevoCoche(coche))
      .rejects
      .toThrow(ValidationError);

    expect(repo.save).not.toHaveBeenCalled();
  });

  // CP2a — Cilindrada = 0
  test('CP2a · cilindrada = 0 → lanza ValidationError (400)', async () => {
    const repo    = crearRepositorioMock();
    const service = new CocheService(repo);
    const coche   = new Coche(11, 'Volkswagen', 'Golf', 0);

    await expect(service.crearNuevoCoche(coche))
      .rejects
      .toThrow(ValidationError);

    expect(repo.save).not.toHaveBeenCalled();
  });

  // CP2b — Cilindrada negativa
  test('CP2b · cilindrada = -1200 → lanza ValidationError (400)', async () => {
    const repo    = crearRepositorioMock();
    const service = new CocheService(repo);
    const coche   = new Coche(12, 'Volkswagen', 'Golf', -1200);

    await expect(service.crearNuevoCoche(coche))
      .rejects
      .toThrow(ValidationError);

    expect(repo.save).not.toHaveBeenCalled();
  });

  // CP3 — Datos válidos
  test('CP3 · Datos válidos → coche creado correctamente (201)', async () => {
    const cocheEsperado = new Coche(13, 'Volkswagen', 'Golf', 2000);
    const repo    = crearRepositorioMock({ cocheGuardado: cocheEsperado });
    const service = new CocheService(repo);
    const coche   = new Coche(13, 'Volkswagen', 'Golf', 2000);

    const resultado = await service.crearNuevoCoche(coche);

    expect(resultado).toEqual(cocheEsperado);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({
      marca:      'Volkswagen',
      modelo:     'Golf',
      cilindrada: 2000,
    }));
  });

  // Extra — Marca vacía
  test('EXTRA · marca vacía → lanza ValidationError (400)', async () => {
    const repo    = crearRepositorioMock();
    const service = new CocheService(repo);
    const coche   = new Coche(14, '', 'Golf', 2000);

    await expect(service.crearNuevoCoche(coche))
      .rejects
      .toThrow(ValidationError);

    expect(repo.save).not.toHaveBeenCalled();
  });

  // Extra — Modelo vacío
  test('EXTRA · modelo vacío → lanza ValidationError (400)', async () => {
    const repo    = crearRepositorioMock();
    const service = new CocheService(repo);
    const coche   = new Coche(15, 'Volkswagen', '', 2000);

    await expect(service.crearNuevoCoche(coche))
      .rejects
      .toThrow(ValidationError);

    expect(repo.save).not.toHaveBeenCalled();
  });
});
