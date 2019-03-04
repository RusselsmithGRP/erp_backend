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
    requester: String,
    service_type: String,
    lineitems: Object,
    no: String,
    updated: { type: Date, default: Date.now },
    created: { type: Date},
    status: String,
    price: Number, 
    currency:{
        type: Schema.Types.ObjectId,
        ref: 'Currency'
    },
    creditterms:Number,
    reason: String,
    accepted: Boolean,
    rejection_reason: String,
});

mongoose.model('RequestQuotation', requestQuotationSchema);