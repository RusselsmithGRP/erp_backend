var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var requestQuotationSchema = Schema({
    vendor:{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    requisition: {
        type: Schema.Types.ObjectId,
        ref: 'PurchaseRequisition'
    },
    lineitems: Object,
    updated: { type: Date, default: Date.now },
    created: { type: Date},
    status: String
});


mongoose.model('RequestQuotation', requestQuotationSchema);