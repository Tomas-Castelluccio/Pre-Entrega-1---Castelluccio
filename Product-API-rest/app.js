const express = require("express");
const path = require("path");
const { engine } = require("express-handlebars");
const app = express();
const productsRoutes = require("./src/routes/products.routes");
const cartsRoutes = require("./src/routes/carts.routes");
const config = require("./config/config");

app.engine("hbs", engine({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "src/views/layouts"),
  partialsDir: path.join(__dirname, "src/views/partials"),
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views/pages"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/static/img", express.static(path.join(__dirname, "..", "img")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);

app.get("/", async (req, res, next) => {
  try {
    const productsDao = require("./src/dao/products.dao");
    const productsService = require("./src/services/products.service");
    const productsDaoInstance = new productsDao(config.getFilePath("products.json"));
    const productsServiceInstance = new productsService(productsDaoInstance);
    const products = await productsServiceInstance.getAllProducts();
    res.render("home", { products });
  } catch (error) {
    next(error);
  }
});

app.get("/realtimeproducts", async (req, res, next) => {
  try {
    const productsDao = require("./src/dao/products.dao");
    const productsService = require("./src/services/products.service");
    const productsDaoInstance = new productsDao(config.getFilePath("products.json"));
    const productsServiceInstance = new productsService(productsDaoInstance);
    const products = await productsServiceInstance.getAllProducts();
    res.render("realTimeProducts", { products });
  } catch (error) {
    next(error);
  }
});

app.use((req, res, next) => {
  const styles = `
  body {
    font-family: Arial, sans-serif;
    background-color: #f8f9fa;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
   }
`;
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>404 - Not Found</title>
      <style>
        ${styles}
      </style>
    </head>
    <body>
    <div class="container">
      <h1>404 - Not Found</h1>
      <p>La p�gina que buscas no existe.</p>
      <a href="/" class="btn">Volver al inicio</a>
    </div>
    </body>
    </html>
  `;

  res.status(404).send(html);
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Error interno en el servidor",
  });
});

module.exports = app;