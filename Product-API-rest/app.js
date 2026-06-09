const express = require("express");
const app = express();
const productsRoutes = require("./src/routes/products.routes");
const fs = require("fs/promises");
const config = require("./config/config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/api/unmodulated/bookbyid/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!bookId) {
      return res.status(400).json({ error: "Falta el ID del libro" });
    }

    const getBookById = async (id) => {
      const data = await fs.readFile(config.getFilePath("books.json"), "utf-8");
      const books = JSON.parse(data);

      return books.find((book) => String(book.id) === String(id));
    };

    const book = await getBookById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Libro no encontrado" });
    }

    const checkBookAvailability = (book) => {
      let response = {
        book,
        message: "",
        status: false,
      };

      if (book.stock === 0) {
        response.message = "Libro no disponible";
      } else if (book.stock > 0 && book.stock < 3) {
        response.message = "Libro pronto a agotarse";
        response.status = true;
      } else {
        response.status = true;
      }

      return response;
    };

    const response = checkBookAvailability(book);

    return res.json(response);
  } catch (error) {
    console.error("Error en la ruta /api/unmodulated/bookbyid/:id:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.get("/", (req, res) => {
  try {
    const styles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 50px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
`;
    const html = `
  ${styles}
  <h1>API Books</h1>
  <button onclick="location.href='/api/books'">Ir a libros</button>
`;

    res.send(html);
  } catch (error) {
    console.error("Error en la ruta raíz:", error);
    res.status(500).send("Error en el servidor");
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
      <p>La página que buscas no existe.</p>
      <a href="/" class="btn">Volver al inicio</a>
    </div>
    </body>
    </html>
  `;

  res.status(404).send(html);
});

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Error interno en el servidor",
  });
});

module.exports = app;
