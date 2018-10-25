var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var purchaseRequisitionSchema = Schema({
    requestor:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    requisitionno: String,
    dateneeded: String,
    chargeto: String,
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    shipvia: String,
    status: String,
    requisitiontype: String,
    lineitems: Object,
    type: String,
    isextrabudget: Boolean,
    deliverymode: String,
    updated: { type: Date, default: Date.now },
    created: { type: Date},
});


mongoose.model('PurchaseRequisition', purchaseRequisitionSchema);