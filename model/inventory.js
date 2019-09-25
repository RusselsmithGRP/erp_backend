const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    quantity: Number,
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
    certificateComformity: String,
    manufacturerNo: String,
    project: String,
    assetCode: String,
    creator: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Inventory = mongoose.model("Inventory", inventorySchema);
