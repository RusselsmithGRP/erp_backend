var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var receivedItemsSchema = Schema({     
    purchaseOrder:{
        type: Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    },
    description: String,
    orderedQuantity: String,
    deliveredQuantity: Number,
    receivedQuantity: Number,
    inspectedQuantity: Number,
    acceptedQuantity: Number,
    rejectedQuantity: Number,
    updated: { type: Date, default: Date.now },
    created: { type: Date},
});

mongoose.model('receivedItems', receivedItemsSchema);