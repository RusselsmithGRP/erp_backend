var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var vendorSchema = Schema({
    user:  {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    general_info:{
        type: Object
    },
    business_info: {
        type:Object
    },
    tech_capability: {
        type:Object
    },
    work_reference:{
        type:Object
    },
    bank_details:{
        type:Object
    },
    status:{
        type:String
    },
    updated: { type: Date, default: Date.now },
})



mongoose.model('Vendor', vendorSchema);