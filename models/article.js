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
    likes: {
        type: Number,
        required: true,
        default: 0
    },
    views: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: false
    }
});

module.exports = mongoose.model("Article", ArticleSchema);