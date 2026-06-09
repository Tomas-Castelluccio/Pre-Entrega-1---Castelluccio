const express = require("express");
const app = express(); 
const PORT = 3000;
const fs = require("fs/promises");
const config = require("./config/config"); 


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
];

const code_db = "aws123";

app.get("/", (req, res) => {
  res.send("Hello World!"); 
});

app.get("/api/texto", (req, res) => {
  res.status(200).send("Hola soy un texto");
});

app.get("/api/json/:code/:juju", (req, res) => { 

  console.log("-body--> ", req.body); 
  console.log("--params-> ", req.params); 
  console.log("-query--> ", req.query); 
  const { code, juju } = req.params;
  console.log("---->", req.query.miabuelita) 
  if (code === code_db) {
    res.status(200).json(products);
  } else {
    res.status(400).json({ message: "Código incorrecto" });
  }
});

app.get("/api/html", (req, res) => {
  res.send(`
    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PERIFERALS</title>
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
  </head>
  <body>
    <h1>API Perifericos</h1>
    <button onclick="location.href='/api/json/aws123/12?miabuelita=MARTITA'">Ir a perifericos</button>
  </body>
</html>`);
});

function enMedio(req, res, next) {
  const { id } = req.query;

  if (id === "pepito") {
    req.miData = { info: "fuufufufufuffuufuf" };
  } else {
    req.miData = { info: "no hay nada" };
  }

  console.log("soy algo intermedio que se ejecuta");
  console.log("Date ", new Date());
  next();
}

app.get("/path/juju", enMedio, (req, res) => {
  console.log("->", req.miData);
  res.send("I'm laughing here dude");
});

app.get("/api/unmodulated/productbyid/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({ error: "Falta el ID del producto" });
    }

    const getProductById = async (id) => {
      const data = await fs.readFile(config.getFilePath("products.json"), "utf-8");
      const products = JSON.parse(data);

      return products.find((product) => String(product.id) === String(id));
    };

    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const checkProductAvailability = (product) => {
      let response = {
        product,
        message: "",
        status: false,
      };

      if (product.stock === 0) {
        response.message = "Producto no disponible";
      } else if (product.stock > 0 && product.stock < 3) {
        response.message = "Producto pronto a agotarse";
        response.status = true;
      } else {
        response.status = true;
      }

      return response;
    };

    // Llamada al servicio
    const response = checkProductAvailability(product);

    return res.json(response);
  } catch (error) {
    console.error("Error en la ruta /api/unmodulated/productbyid/:id:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
