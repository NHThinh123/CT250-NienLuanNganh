const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessVerificationSchema = new Schema({
    businessId: String,
    uniqueString: String,
    createAt: Date,
    expriseAt: Date
});


const businessVerification = mongoose.model('businessVerification', businessVerificationSchema);
module.exports = businessVerification;