const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userVerificationSchema = new Schema({
    userId: String,
    uniqueString: String,
    createAt: Date,
    expriseAt: Date
});
const businessVerificationSchema = new Schema({
    businessId: String,
    uniqueString: String,
    createAt: Date,
    expriseAt: Date
});

const userVerification = mongoose.model('userVerification', userVerificationSchema);
const businessVerification = mongoose.model('businessVerification', businessVerificationSchema);
module.exports = { userVerification, businessVerification };