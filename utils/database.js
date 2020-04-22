const MongoClient = require('mongoose');


const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://Arsene:nVBETDaXtkAhKRvK@cluster0-d57uy.mongodb.net/blog?retryWrites=true/', { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
        .then((result) => {
            callback(result)
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = mongoConnect;