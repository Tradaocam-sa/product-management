const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//   res.render("client/pages/products/index");
// });

const controller = require("../../controllers/client/product.controller");
router.get("/", controller.index);

// router.get("/detail", (req, res) => {
//   res.send("Trang chi tiết sản phẩm");
// });

// router.get("/edit", (req, res) => {

// });

// router.get("/create", (req, res) => {

// });

module.exports = router;