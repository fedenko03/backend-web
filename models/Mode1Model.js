const mongoose = require("mongoose");

const mode1Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
});
const mode1 = mongoose.model('mode1', mode1Schema);

module.exports = mode1;