const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    titre: {
        type: String,
        required: true
    },
    article: {
        type: String,
        required: true
    },
    comments: {
        type: Object,
        required: false
    }
});

module.exports = mongoose.model("Article", ArticleSchema);