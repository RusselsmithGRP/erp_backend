var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var rejectionLogSchema = Schema({     
    purchaseOrder:{
        type: Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    },
    productsData:  [{}],
    created: { type: Date},
});

mongoose.model('rejectionLog', rejectionLogSchema);