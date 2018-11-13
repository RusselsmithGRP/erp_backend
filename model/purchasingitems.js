var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var purchasingItemSchema = Schema({   
    quote:{
        type: Schema.Types.ObjectId,
        ref: 'RequestQuotation'
    },   
    purchaseOrder:{
        type: Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Expenseheader'
    },
    uom: String,
    description: String,
    quantity: Number,
    status: {type:Boolean, default: false},
    vatable: Boolean,
    price:{type: Number, get: getPrice, set: setPrice },
    total:{type: Number, get: getPrice, set: setPrice },
    updated: { type: Date, default: Date.now },
    created: { type: Date},
});

function getPrice(num){
    return (num/100).toFixed(2);
}

function setPrice(num){
    return num*100;
}


mongoose.model('PurchasingItem', purchasingItemSchema);