class ProductsService {
  constructor(productsDao) {
    this.productsDao = productsDao;
  }

  async getAllProducts() {
    return await this.productsDao.getAll();
  }

  async getProductById(id) {
    if (!id) throw new Error("ID requerido");
    return await this.productsDao.getById(id);
  }

  async createProduct(productData) {
    const requiredFields = ["title", "code", "price", "status", "stock", "category", "thumbnails"];
    const missingFields = requiredFields.filter((field) => !productData[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `Campos requeridos faltantes: ${missingFields.join(", ")}`
      );
    }

    if (typeof productData.price !== "number") {
      throw new Error("Price debe ser un número");
    }

    if (typeof productData.stock !== "number") {
      throw new Error("Stock debe ser un número");
    }

    if (typeof productData.status !== "boolean") {
      throw new Error("Status debe ser un booleano");
    }

    if (!Array.isArray(productData.thumbnails)) {
      throw new Error("Thumbnails debe ser un array de strings");
    }

    return await this.productsDao.create(productData);
  }

  async updateProduct(pid, updateData) {
    if (!pid) throw new Error("ID requerido");
    const existing = await this.productsDao.getById(pid);
    if (!existing) throw new Error("Producto no encontrado");
    return await this.productsDao.update(pid, updateData);
  }

  async deleteProduct(pid) {
    if (!pid) throw new Error("ID requerido");
    const existing = await this.productsDao.getById(pid);
    if (!existing) throw new Error("Producto no encontrado");
    return await this.productsDao.delete(pid);
  }
}

module.exports = ProductsService;
