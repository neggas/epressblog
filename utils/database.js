const MongoClient = require('mongoose');


const mongoConnect = (callback) => {

    MongoClient.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-d57uy.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true/`, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
        .then((result) => {
            callback(result)
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = mongoConnect;