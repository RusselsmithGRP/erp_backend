const STATUS = {
  "00": "PENDING SUBMISSION",
  "01": "AWAITING HOD APPROVAL",
  "010": "HOD DECLINE APPROVAL, MAKE CORRECTIONS",
  "011": "HOD APPROVED",
  RFQ01: "Awaiting Vendor Response",
  RFQ02: "Vendor Responded",
  RFQ03: "Procurement Approved",
  RFQ04: "Procurement Disapproved, With Reason",
  PO00: "PO Saved",
  POX0: "Awaiting Line Manager Review and Approval",
  POX1: "Line Manager Decline Approval With Reason",
  PO01: "Line Manager Approved and Awaiting HOD Approval",
  POX2: "HOD Declined Approval With Reason",
  PO02: "HOD Approved and Awaiting CEO Approval",
  PO03: "CEO Approved",
  POX3: "CEO Declined Approval With Reason",
  X: "Request Cancelled",
  IVM00: "PO RECEIVED",
  IVM01: "PENDING IAC INSPECTION"
};

exports.getStatus = status => {
  return STATUS[status];
};
