var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var locationSchema = Schema({
    name: String,
    slug: String,
    address: String
});

mongoose.model('Location', locationSchema);