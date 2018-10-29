var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var departmentSchema = Schema({
    name: String,
    slug: String, 
    code: String,
});


mongoose.model('Currency', departmentSchema);