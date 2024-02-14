const express = require("express");
const router = express.Router();

// router.get("/", (req, res) => {
//   res.render("client/pages/home/index");
// });

const controller = require("../../controllers/client/home.controller");

router.get("/", controller.index);

module.exports = router;