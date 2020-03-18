const express = require("express");
const router = express.Router();

const artilceController = require("../controllers/articles");

router.get('/', artilceController.getArticles);
router.get("/blog/122def", artilceController.readArticles);

module.exports = router;