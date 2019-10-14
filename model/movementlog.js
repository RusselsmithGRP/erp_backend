const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movementlogSchema = new Schema(
  {
    location: { type: String },
    requestor: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    movementno: String,
    lineitems: [Object],
    returndate: { type: Date }
  },
  { timestamps: { createdAt: "created", updatedAt: "updated" } }
);

module.exports = Movement = mongoose.model("Movement", movementlogSchema);
