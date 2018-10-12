var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var departmentSchema = Schema({
    name: String,
    code: String,
});


mongoose.model('Department', departmentSchema);