var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var roleSchema = Schema({
    name: String,
    
    permission: Object,
});


mongoose.model('role', roleSchema);