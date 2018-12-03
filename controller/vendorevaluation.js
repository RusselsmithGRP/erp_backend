var mongoose = require("mongoose");
var VendorEvaluation = mongoose.model("VendorEvaluation");

exports.index = (req, res, next) => {
  VendorEvaluation.find().exec((err, docs) => {
    if (err) return next(err);
    else res.send(docs);
  });
};

exports.add = (req, res, next) => {
  const data = req.body;
  let VendorEvaluation = new VendorEvaluation(data);
    VendorEvaluation.save(function(err, result) {
      if (err) return res.json({ success: false, message: "An error occured!" });
      // saved!
      res.send(result);
    });
};

exports.view = (req, res, next)=>{
  VendorEvaluation.findOne({ vendor: req.params.id }).exec((err, doc) => {
      if (err) return next(err);
      res.send((doc)?doc: []);
    });
};


exports.delete = (req, res, next) => {
  VendorEvaluation.deleteOne({ _id: req.body.id }, function(err, result) {
    if (err) return handleError(err);
    res.send(result);
  });
};