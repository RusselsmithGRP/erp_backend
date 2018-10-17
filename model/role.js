var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var roleSchema = Schema({
    name: String,
    slug: String,
    permission: Object,
});


mongoose.model('role', roleSchema);