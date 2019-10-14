const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventoryRequisitionSchema = new Schema(
  {
    requestor: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    dateneeded: { type: Date },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department"
    },
    category: String,
    purpose: String,
    location: String,
    status: String,
    lineitems: [Object],
    requisitionno: String,
    custodian: { type: Schema.Types.ObjectId, ref: "User" },
    onbehalf: String,
    inventory: { type: Schema.Types.ObjectId, ref: "Inventory" }
  },
  { timestamps: { updatedAt: "updated", createdAt: "created" } }
);

module.exports = InventoryRequisition = mongoose.model(
  "InventoryRequisition",
  inventoryRequisitionSchema
);
