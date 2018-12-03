var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var vendorEvaluationSchema = Schema({
    vendor:{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    meetQuality: Number,
    meetDefineSpecification: Number,
    adaptiveness: Number,
    onTimeDelivery: Number,
    meetRfqResponseTime: Number,
    avg: Number
});

mongoose.model('VendorEvaluation', vendorEvaluationSchema);