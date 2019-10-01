const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventoryRequisitionSchema = new Schema(
  {
    requestor: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    dateneeded: { type: Date },
    chargeto: { type: String },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department"
    },
    category: String,
    purpose: String,
    description: String,
    location: String,
    status: String,
    lineitems: Object,
    requisitionno: String
  },
  { timestamps: { updatedAt: "updated", createdAt: "created" } }
);

module.exports = InventoryRequisition = mongoose.model(
  "InventoryRequisition",
  inventoryRequisitionSchema
);
