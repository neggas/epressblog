const MongoClient = require('mongoose');


const mongoConnect = (callback) => {

    MongoClient.connect(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-shard-00-00-d57uy.mongodb.net:27017,cluster0-shard-00-01-d57uy.mongodb.net:27017,cluster0-shard-00-02-d57uy.mongodb.net:27017/${process.env.MONGO_DEFAULT_DATABASE}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
        .then((result) => {
            callback(result)
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = mongoConnect;