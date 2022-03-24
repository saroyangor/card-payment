const {Schema, model} = require('mongoose')

const schema = new Schema({
    cardNumber: {type: Number, required: true},
    expDate: {type: String, required: true},
    cvv: {type: Number, required: true},
    amount: {type: Number, required: true, min: 1}
})

module.exports = model('Card', schema)