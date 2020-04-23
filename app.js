const express = require("express");
const path = require("path");
const mongoConnect = require("./utils/database");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const morgan = require("morgan");
const session = require("express-session");
const helmet = require("helmet");
const fs = require("fs");
const compression = require("compression");
const MongoDbStore = require("connect-mongodb-session")(session);
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
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
const logStream = fs.createWriteStream(path.join(__dirname, 'accessLog'), { flags: 'a' });
app.use(flash());
app.use(authRoute);
app.use("/blog", articleRoute);
app.use(compression());
app.use(helmet());
app.use(morgan("combined", { stream: logStream }));

const PORT = process.env.PORT || 3000;

mongoConnect((client) => {
    app.listen(PORT, () => {
        console.log(`le serveur ecoute sur le port ${PORT}`)
    })
})