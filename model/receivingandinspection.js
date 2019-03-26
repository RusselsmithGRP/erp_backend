var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var receivingAndInspectionSchema = Schema({     
    purchaseOrder:{
        type: Schema.Types.ObjectId,
    },
    on_time_delivery: Boolean,
    inspection_parameters:{
        type: Object
    },
    inspection_stage: {
        type:Object
    },
    productsData: [{}],
    comment: String,
    updated: { type: Date, default: Date.now },
    created: { type: Date},
});

mongoose.model('receivingAndInspection', receivingAndInspectionSchema);