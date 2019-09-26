const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema(
  {
    description: String,
    serialNo: String,
    assetCode: String,
    assetType: String,
    quantity: Number,
    warehouse: String,
    room: String,
    rack: String,
    shelf: String,
    condition: String,
    custodian: { type: Schema.Types.ObjectId, ref: "Custodian" },
    dateReceived: { type: Date },
    photo: String,
    category: String,
    certificateComformity: String,
    manufacturer: String
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Inventory = mongoose.model("Inventory", inventorySchema);
