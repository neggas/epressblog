exports.getArticles = (req, res) => {
    res.render("index.ejs");
}

exports.readArticles = (req, res) => {
    res.render("blog_views.ejs");
}