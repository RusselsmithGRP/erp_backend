var mongoose = require("mongoose");
var Schema = mongoose.Schema;
/**
 * @author Idowu
 * @type Schema
 * @summary Changed permission type from `Object` to `Array of String`
 */
var roleSchema = Schema({
  name: String,
  slug: String,
  // permission: Object,
  permission: [String]
});

mongoose.model("Role", roleSchema);
