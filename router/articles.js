const express = require("express");
const router = express.Router();

const articleController = require("../controllers/articles");

router.get("/", articleController.getArticles);
router.get("/122def", articleController.readArticles);
router.get("/:id/comment", articleController.getCommentArticles);
router.post("/:/comment", articleController.postCommentArticles);

module.exports = router;
