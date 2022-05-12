const mongoose = require('mongoose');
var URL = "mongodb+srv://admin-Zhandos:Qwerty12345@cluster0.vh9zg.mongodb.net/web-backend"

mongoose
    .connect(URL, {
        useNewUrlParser: true,
    })
    .then(() => console.log('MongoDb connected'))
    .catch(err => console.log(err));
