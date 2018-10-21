var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var requestQuotationSchema = Schema({
    vendor:{
        type: Schema.Types.ObjectId,
        ref: 'vendor'
    },
    requisition: {
        type: Schema.Types.ObjectId,
        ref: 'purchaserequisition'
    },
    lineitems: Object,
    updated: { type: Date, default: Date.now },
    created: { type: Date},
    status: String
});


mongoose.model('requestquotation', requestQuotationSchema);