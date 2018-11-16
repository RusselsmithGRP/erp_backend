var mongoose = require("mongoose");
var Location = mongoose.model("Location");

exports.index = (req, res, next) => {
  Location.find().exec((err, docs) => {
    if (err) return next(err);
    else res.send(docs);
  });
};

exports.add = (req, res, next) => {
  const data = req.body;
  let location = new Location(data);
  if (location.name && location.slug) {
    location.save(function(err) {
      if (err)
        return res.json({ success: false, message: "An error occured!" });
      // saved!
      return res.json({ success: true, message: "New Location Created!" });
    });
  } else {
    return res.json({ success: false, message: "An error occured!" });
  }
};

module.exports.getLocation = function(req, res) {
  Location.find().exec(function(err, locations) {
    if (err) {
      res.json({ message: err });
      return;
    }
    res.status(200).json(locations);
  });
};

module.exports.getAddress = function(req, res) {
  Location.findOne({ name: req.body.location }, function(err, location) {
    if (err) {
      res.json({ message: err });
      return;
    }
    res.status(200).json(location.address);
  });
};
exports.edit = (req, res, next) => {
  const body = req.body;
  Location.updateOne({ _id: req.params.id }, body, (err, result) => {
    if (err) return next(err);
    res.send(result);
  });
};

exports.viewOne = (req, res, next) => {
  this.findDeparmentDetails(req.params.id, (err, doc) => {
    res.send(doc);
  });
};

exports.delete = (req, res, next) => {
  console.log();
  Location.deleteOne({ _id: req.body.id }, function(err) {
    if (err) return handleError(err);
    // deleted at most one tank document
    res.send(true);
  });
};

module.exports.update = function(req, res) {
  let data = {
    name: req.body.name,
    slug: req.body.slug
  };
  Location.findByIdAndUpdate(req.body._id, data, function(err, data) {
    if (err) return res.send(err);
    return res.json({
      success: true,
      message: "location details has been updated!",
      data: data
    });
  });
};
