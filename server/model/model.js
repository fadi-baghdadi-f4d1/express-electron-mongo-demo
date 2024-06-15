const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    task: {
        required: true,
        type: String
    },
    num: {
        required: true,
        type: Number
    }
})

module.exports = mongoose.model('Task', dataSchema)