const express = require("express");
const router = express.Router();

const artilceController = require("../controllers/articles");

router.get('/', artilceController.getArticles);
router.get("/122def", artilceController.readArticles);
router.get("/:id/comment", artilceController.getCommentArticles);
router.post("/:/comment", artilceController.postCommentArticles);
module.exports = router;