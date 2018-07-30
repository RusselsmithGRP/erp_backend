var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var vendorSchema = new mongoose.Schema({
    _userId: Schema.Types.ObjectId,
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
    status:{
        type:String
    },
    updated: { type: Date, default: Date.now },
})



mongoose.model('Vendor', vendorSchema);