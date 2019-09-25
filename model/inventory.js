const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    quantity: { type: Number, default: 0 },
    type: String,
    description: String,
    status: String,
    condition: String,
    demobilization: { type: Date },
    mobilization: { type: Date },
    serial_no: String,
    custodian: String,
    remarks: String,
    location: String,
    isDeleted: { type: Boolean, default: false },
    certificate_comformity: String,
    manufacturer_no: String
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Inventory = mongoose.model("Inventory", inventorySchema);
