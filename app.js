const express = require("express");
const path = require("path");
const mongoConnect = require("./utils/database");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const app = express();

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

const store = new MongoDbStore({
    uri: "mongodb://localhost/blog",
    collection: "sessions"
});

app.use(
    session({
        secret: "my secret",
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

const authRoute = require("./router/auth");
const articleRoute = require("./router/articles");

app.use(flash());
app.use(authRoute);
app.use("/blog", articleRoute);
const PORT = process.env.PORT || 3000;
// mongoose
//     .connect("mongodb://localhost/blog", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
//     .then(response => {
//         const PORT = process.env.PORT || 3000;
//         app.listen(PORT, () => {
//             console.log(`le serveur ecoute sur le port ${PORT}`);
//         });
//     })
//     .catch(err => console.log(`erreur : ${err}`));

mongoConnect((client) => {
    app.listen(PORT, () => {
        console.log(`le serveur ecoute sur le port ${PORT}`)
    })
})