const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    description: { type: String, required: true },
    serialNo: { type: String, required: true },
    assetCode: String,
    assetType: { type: String, required: true },
    quantity: Number,
    warehouse: String,
    room: String,
    rack: String,
    shelf: String,
    condition: String,
    custodian: { type: Schema.Types.ObjectId, ref: "User" },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },
    dateReceived: { type: Date },
    photo: {
      fileName: String,
      filePath: String
    },
    category: { type: String, required: true },
    certificateComformity: String,
    manufacturer: String,
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Inventory = mongoose.model("Inventory", inventorySchema);
