const Coche           = require('../model/Coche');
const CocheRepository = require('../repository/CocheRepository');

/**
 * Error de validación que mapea al HTTP 400 Bad Request.
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class CocheService {

  /**
   * @param {CocheRepository} cocheRepository  Permite inyección en tests.
   */
  constructor(cocheRepository = new CocheRepository()) {
    this.cocheRepository = cocheRepository;
  }

  // ─── RA5: métodos documentados ────────────────────────────────────────────

  /**
   * Consulta coches por marca.
   * - Si la marca es nula, vacía o no es string → devuelve lista vacía.
   * - Si no hay resultados → devuelve lista vacía.
   *
   * @param {string} marca
   * @returns {Promise<Coche[]>}
   */
  async consultarCochesPorMarca(marca) {
    if (!marca || typeof marca !== 'string' || marca.trim() === '') {
      return [];
    }
    const coches = await this.cocheRepository.findByMarca(marca.trim());
    return coches;
  }

  /**
   * Crea un nuevo coche tras validar los datos.
   * Lanza ValidationError (400) si:
   *   - cilindrada es null/undefined
   *   - cilindrada ≤ 0
   *   - marca o modelo son nulos/vacíos
   *
   * @param {Coche} coche
   * @returns {Promise<Coche>}
   */
  async crearNuevoCoche(coche) {
    // Validación de campos obligatorios de texto
    if (!coche.marca || coche.marca.trim() === '') {
      throw new ValidationError('El campo "marca" es obligatorio.');
    }
    if (!coche.modelo || coche.modelo.trim() === '') {
      throw new ValidationError('El campo "modelo" es obligatorio.');
    }

    // Validación de cilindrada
    if (coche.cilindrada === null || coche.cilindrada === undefined) {
      throw new ValidationError('El campo "cilindrada" es obligatorio.');
    }
    const cilindrada = Number(coche.cilindrada);
    if (isNaN(cilindrada) || cilindrada <= 0) {
      throw new ValidationError('La cilindrada debe ser un número mayor que 0.');
    }

    const cocheValidado = new Coche(
      coche.identificador,
      coche.marca.trim(),
      coche.modelo.trim(),
      cilindrada
    );

    return await this.cocheRepository.save(cocheValidado);
  }
}

module.exports = { CocheService, ValidationError };
