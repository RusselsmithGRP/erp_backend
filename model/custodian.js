const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const custodianSchema = new Schema(
  {
    custodian: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Custodian = mongoose.model("Custodian", custodianSchema);
