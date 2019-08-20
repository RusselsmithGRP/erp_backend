var mongoose = require("mongoose");
var Schema = mongoose.Schema;
/**
 * @author Idowu
 * @type Schema
 * @summary Changed permission type from `Object` to `Array`
 */
var roleSchema = Schema({
  name: String,
  slug: String,
  // permission: Object,
  permission: []
});

mongoose.model("Role", roleSchema);
