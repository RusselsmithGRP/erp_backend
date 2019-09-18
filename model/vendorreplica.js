const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vendorReplica = new Schema(
  {
    vendor_category: {
      type: String
    },
    supplier_id: {
      type: String
    },
    company_name: {
      type: String
    },
    address: {
      type: String
    },
    location: {
      type: String
    },
    contact_person: {
      type: String
    },
    email: {
      type: String
    },
    website_address: {
      type: String
    },
    phone_number: {
      type: String
    },
    classes: {
      type: Number
    }
  },
  { timestamps: true }
);

module.exports = VendorReplica = mongoose.model("VendorReplica", vendorReplica);
