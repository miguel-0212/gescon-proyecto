// Entidad Coche
// representaion del registro de T_COCHE en la bd.
 
class Coche {
  /**
   * @param {number} identficador
   * @param {string} marca
   * @param {string} modelo
   * @param {number} cilindrada 
   */
  constructor(identificador, marca, modelo, cilindrada) {
    this.identificador = identificador;
    this.marca = marca;
    this.modelo = modelo;
    this.cilindrada = cilindrada;
  }
}
module.exports = Coche;
