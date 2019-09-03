var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var departmentSchema = new Schema({
  name: String,
  slug: String,
  code: String,
  hod: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

mongoose.model("Department", departmentSchema);
