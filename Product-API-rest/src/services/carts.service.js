class CartsService {
  constructor(cartsDao, productsDao) {
    this.cartsDao = cartsDao;
    this.productsDao = productsDao;
  }

  async getAllCarts() {
    return await this.cartsDao.getAll();
  }

  async getCartById(id) {
    if (!id) throw new Error("ID requerido");
    return await this.cartsDao.getById(id);
  }

  async createCart() {
    return await this.cartsDao.create();
  }

  async addProduct(cid, pid) {
    if (!cid) throw new Error("ID de carrito requerido");
    if (!pid) throw new Error("ID de producto requerido");

    const cart = await this.cartsDao.getById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = await this.productsDao.getById(pid);
    if (!product) throw new Error("Producto no encontrado");

    return await this.cartsDao.addProduct(cid, pid);
  }

  async deleteProduct(cid, pid) {
    if (!cid) throw new Error("ID de carrito requerido");
    if (!pid) throw new Error("ID de producto requerido");

    const cart = await this.cartsDao.getById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    return await this.cartsDao.deleteProduct(cid, pid);
  }

  async updateCart(cid, products) {
    if (!cid) throw new Error("ID de carrito requerido");
    if (!Array.isArray(products)) throw new Error("Products debe ser un array");

    const cart = await this.cartsDao.getById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    for (const item of products) {
      if (!item.product || typeof item.quantity !== "number") {
        throw new Error("Cada item debe tener product (string) y quantity (number)");
      }
      const product = await this.productsDao.getById(item.product);
      if (!product) throw new Error(`Producto ${item.product} no encontrado`);
    }

    return await this.cartsDao.updateCart(cid, products);
  }

  async updateProductQuantity(cid, pid, quantity) {
    if (!cid) throw new Error("ID de carrito requerido");
    if (!pid) throw new Error("ID de producto requerido");
    if (typeof quantity !== "number") throw new Error("Quantity debe ser un número");

    const cart = await this.cartsDao.getById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = await this.productsDao.getById(pid);
    if (!product) throw new Error("Producto no encontrado");

    return await this.cartsDao.updateProductQuantity(cid, pid, quantity);
  }

  async clearCart(cid) {
    if (!cid) throw new Error("ID de carrito requerido");

    const cart = await this.cartsDao.getById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    return await this.cartsDao.clearCart(cid);
  }

  async deleteCart(id) {
    if (!id) throw new Error("ID requerido");
    const cart = await this.cartsDao.getById(id);
    if (!cart) throw new Error("Carrito no encontrado");
    return await this.cartsDao.delete(id);
  }
}

module.exports = CartsService;