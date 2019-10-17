var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var purchaseRequisitionSchema = Schema({
  requestor: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  requisitionno: String,
  dateneeded: { type: Date },
  chargeto: String,
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department"
  },
  shipvia: String,
  status: String,
  requisitiontype: String,
  lineitems: Object,
  type: String,
  isextrabudget: Boolean,
  eid: String,
  deliverymode: String,
  vendor: String,
  purchaseType: String,
  justification: String,
  price: Number,
  closeoutmethod: String,
  comment: String,
  updated: { type: Date, default: Date.now },
  created: { type: Date },
  reason: String
});

mongoose.model("PurchaseRequisition", purchaseRequisitionSchema);

