const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const warehouseSchema = new Schema(
  {
    name: String,
    type: {
      type: String
    },
    room: [String],
    rack: [String],
    line: String,
    custodian: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Warehouse = mongoose.model("Warehouse", warehouseSchema);
