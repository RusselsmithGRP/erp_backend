var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var purchaseRequisitionSchema = Schema({
    requestor:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    dateneeded: String,
    chargeto: String,
    department: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    shipvia: String,
    status: Number,
    requisitiontype: String,
    lineitems: Object
});


mongoose.model('PurchaseRequistion', purchaseRequisitionSchema);