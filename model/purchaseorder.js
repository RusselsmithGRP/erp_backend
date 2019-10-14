var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var purchaseOrderSchema = Schema({
    vendor:{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    no: String,
    deliverydate: { type: Date},
    creditterms: String,
    currency: Number,
    shipto: String,
    status: String,
    discount: {type: Number, get: getPrice, set: setPrice },
    vat: String,
    freightcharges: {type: Number, get: getPrice, set: setPrice },
    servicecharge : {type: Number, get: getPrice, set: setPrice },
    total:{type: Number, get: getPrice, set: setPrice },
    updated: { type: Date, default: Date.now },
    created: { type: Date},
    reason: String,
    additional_terms: String,
    requestor:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedBy: {
         type: Schema.Types.ObjectId,
        ref: 'User'
     },
    reviewedByDate: { type: Date},
    authorizedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    authorizedByDate:{ type: Date},
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedByDate:{ type: Date},
    types: Array
});

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}


mongoose.model('PurchaseOrder', purchaseOrderSchema);