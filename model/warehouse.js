const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const warehouseSchema = new Schema(
  {
    name: String,
    room: [String],
    shelf: [String]
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Warehouse = mongoose.model("Warehouse", warehouseSchema);
