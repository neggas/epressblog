const express = require("express");
const authSecure = require("../middaleware/authSecure");
const router = express.Router();


const articleController = require("../controllers/articles");

router.get("/", articleController.getArticles);
router.get("/:id", articleController.readArticles);
router.get("/:id/comment", authSecure, articleController.getCommentArticles);
router.post("/:id/comment", authSecure, articleController.postCommentArticles);

module.exports = router;