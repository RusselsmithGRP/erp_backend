var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var expenseHeaderSchema = Schema({
    name: String,
    slug: String, 
    department: String
});


mongoose.model('Expenseheader', expenseHeaderSchema);