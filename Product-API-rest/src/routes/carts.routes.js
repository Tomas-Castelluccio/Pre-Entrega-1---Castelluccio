const express = require("express");
const router = express.Router();
const config = require("../../config/config");
const CartsDao = require("../dao/carts.dao");
const ProductsDao = require("../dao/products.dao");
const CartsService = require("../services/carts.service");
const CartsController = require("../controllers/carts.controller");

const cartsDao = new CartsDao(config.getFilePath("carts.json"));
const productsDao = new ProductsDao(config.getFilePath("products.json"));
const cartsService = new CartsService(cartsDao, productsDao);
const cartsController = new CartsController(cartsService);

router.get("/", cartsController.getCarts);
router.get("/:cid", cartsController.getCartById);
router.post("/", cartsController.createCart);
router.post("/:cid/products/:pid", cartsController.addProduct);
router.delete("/:cid/products/:pid", cartsController.deleteProduct);
router.put("/:cid", cartsController.updateCart);
router.put("/:cid/products/:pid", cartsController.updateProductQuantity);
router.delete("/:cid/products", cartsController.clearCart);
router.delete("/:cid", cartsController.deleteCart);

module.exports = router;