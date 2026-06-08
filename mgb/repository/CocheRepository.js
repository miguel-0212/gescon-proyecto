const pool  = require('../db');
const Coche = require('../model/Coche');

class CocheRepository {

  /**
   * Devuelve todos los coches cuya marca coincide (exacta, case-sensitive como la BD)
   * @param {string} marca
   * @returns {Promise<Coche[]>}
   */
  async findByMarca(marca) {
    const [rows] = await pool.execute(
      'SELECT identificador, marca, modelo, cilindrada FROM T_COCHE WHERE marca = ?',
      [marca]
    );
    return rows.map(r => new Coche(r.identificador, r.marca, r.modelo, r.cilindrada));
  }

  /**
   * Persiste un nuevo coche en la base de datos.
   * @param {Coche} coche
   * @returns {Promise<Coche>}
   */
  async save(coche) {
    const [result] = await pool.execute(
      'INSERT INTO T_COCHE (identificador, marca, modelo, cilindrada) VALUES (?, ?, ?, ?)',
      [coche.identificador, coche.marca, coche.modelo, coche.cilindrada]
    );
    if (result.affectedRows !== 1) {
      throw new Error('No se pudo insertar el coche en la base de datos.');
    }
    return coche;
  }
}

module.exports = CocheRepository;
