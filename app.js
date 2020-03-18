const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false
}))

const authRoute = require('./router/auth');
const articleRoute = require('./router/articles');

app.use(flash());
app.use(authRoute);
app.use(articleRoute);

mongoose.connect("mongodb://localhost/blog", { useNewUrlParser: true })
    .then((response) => {

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`le serveur ecoute sur le port ${PORT}`);
        })
    })
    .catch(err => console.log(`erreur : ${err}`));