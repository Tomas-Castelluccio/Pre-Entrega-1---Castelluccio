const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const config = require("./config/config");
const ProductsDao = require("./src/dao/products.dao");
const ProductsService = require("./src/services/products.service");

const PORT = config.PORT;
const productsDao = new ProductsDao(config.getFilePath("products.json"));
const productsService = new ProductsService(productsDao);

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", async (socket) => {
  const products = await productsService.getAllProducts();
  socket.emit("products", products);

  socket.on("new-product", async (productData) => {
    try {
      const newProduct = await productsDao.create(productData);
      const updatedProducts = await productsService.getAllProducts();
      io.emit("products", updatedProducts);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("delete-product", async (id) => {
    try {
      await productsDao.delete(id);
      const updatedProducts = await productsService.getAllProducts();
      io.emit("products", updatedProducts);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
