var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var workCompletionSchema = Schema({     
    purchaseOrder:{
        type: Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    },
    work_completion: {
        type:Object
    },
    services: [{}],
    quality_and_saferty_evaluation:{
        type: Object
    },
   project_management_evaluation: {
        type:Object
    },
    timeliness_of_service_evaluation: {
        type:Object
    },
    service_excellence_evaluation: {
        type:Object
    },
    updated: { type: Date, default: Date.now },
    created: { type: Date},
});

mongoose.model('workCompletion', workCompletionSchema);