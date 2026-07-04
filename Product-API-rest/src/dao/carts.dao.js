const fs = require("fs").promises;
const crypto = require("crypto");

class CartsDao {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.#saveFile([]);
        return [];
      }
      throw error;
    }
  }

  async #saveFile(carts) {
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), "utf8");
  }

  #generateId() {
    return crypto.randomUUID();
  }

  async getAll() {
    const carts = await this.#readFile();
    return JSON.parse(JSON.stringify(carts));
  }

  async getById(id) {
    const carts = await this.#readFile();
    return carts.find((c) => c.id === id);
  }

  async create() {
    const carts = await this.#readFile();
    const newCart = { id: this.#generateId(), products: [] };
    carts.push(newCart);
    await this.#saveFile(carts);
    return newCart;
  }

  async addProduct(cid, pid) {
    const carts = await this.#readFile();
    const index = carts.findIndex((c) => c.id === cid);

    if (index === -1) throw new Error("Carrito no encontrado");

    const productIndex = carts[index].products.findIndex((p) => p.product === pid);

 if (productIndex === -1) {
      carts[index].products.push({ product: pid, quantity: 1 });
    } else {
      carts[index].products[productIndex].quantity += 1;
    }

    await this.#saveFile(carts);
    return carts[index];
  }

  async deleteProduct(cid, pid) {
    const carts = await this.#readFile();
    const index = carts.findIndex((c) => c.id === cid);

    if (index === -1) throw new Error("Carrito no encontrado");

    carts[index].products = carts[index].products.filter((p) => p.product !== pid);

    await this.#saveFile(carts);
    return carts[index];
  }

  async updateCart(cid, products) {
    const carts = await this.#readFile();
    const index = carts.findIndex((c) => c.id === cid);

    if (index === -1) throw new Error("Carrito no encontrado");

    carts[index].products = products;
    await this.#saveFile(carts);
    return carts[index];
  }

  async updateProductQuantity(cid, pid, quantity) {
    const carts = await this.#readFile();
    const index = carts.findIndex((c) => c.id === cid);

    if (index === -1) throw new Error("Carrito no encontrado");

    const productIndex = carts[index].products.findIndex((p) => p.product === pid);

    if (productIndex === -1) throw new Error("Producto no encontrado en carrito");

    if (quantity <= 0) {
      carts[index].products.splice(productIndex, 1);
    } else {
      carts[index].products[productIndex].quantity = quantity;
    }

    await this.#saveFile(carts);
    return carts[index];
  }

  async clearCart(cid) {
    const carts = await this.#readFile();
    const index = carts.findIndex((c) => c.id === cid);

    if (index === -1) throw new Error("Carrito no encontrado");

    carts[index].products = [];
    await this.#saveFile(carts);
    return carts[index];
  }

  async delete(id) {
    const carts = await this.#readFile();
    const filteredCarts = carts.filter((c) => c.id !== id);

    if (carts.length === filteredCarts.length) {
      throw new Error("Carrito no encontrado");
    }

    await this.#saveFile(filteredCarts);
    return id;
  }
}

module.exports = CartsDao;