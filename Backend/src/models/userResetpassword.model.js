const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordResetSchema = new Schema({
    userId: String,
    resetString: String,
    createAt: Date,
    expriseAt: Date
});

const passwordReset = mongoose.model('passwordReset', passwordResetSchema);
module.exports = passwordReset;