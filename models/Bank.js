const mongoose = require('mongoose')

const bankSchema = new mongoose.Schema({
    BankName: {
        type: String,
        required: true
    },
    noRek: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Bank', bankSchema)