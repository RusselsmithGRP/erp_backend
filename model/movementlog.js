const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movementlogSchema = new Schema(
  {
    purchaseOrder: {
      type: Schema.Types.ObjectId,
      ref: "PurchaseOrder"
    },
    requestor: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Movement = mongoose.model("Movement", movementlogSchema);
