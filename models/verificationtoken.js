const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Verification token model. Expires attribute is set to 43200 seconds
const tokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 }
})

module.exports = mongoose.model('Token', tokenSchema);