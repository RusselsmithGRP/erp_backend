var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var expenseHeaderSchema = Schema({
    name: String,
    slug: String, 
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    }
});


mongoose.model('Expenseheader', expenseHeaderSchema);