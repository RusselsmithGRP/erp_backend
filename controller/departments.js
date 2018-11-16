var mongoose = require('mongoose');
var Department = mongoose.model('Department');

exports.index = (req, res, next)=>{
    Department.find().exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}

exports.add = (req, res, next)=>{
    const data = req.body;
    let department = new Department(data);
    if (department.name && department.slug && department.code) {
    department.save(function (err) {
        if (err) return res.json({ success:false, message: "An error occured!"});
        // saved!
        return res.json({ success:true, message: "New Department Created!"});
    });
}
else {
    return res.json({ success:false, message: "An error occured!"});
}
}

exports.edit = (req, res, next)=>{
    const body = req.body;
    Department.updateOne({_id: req.params.id}, body, (err,result)=>{
        if (err)return next(err);
        res.send(result);
    });
}

exports.getHod = (id, next, callback)=>{
    Department.findOne({_id:  id}).populate("hod").exec((err, doc)=>{
        if (err) return next(err);
        callback(doc);
    });
}

exports.viewOne = (req, res, next)=>{
    this.findDeparmentDetails(req.params.id, (err, doc)=>{
        res.send(doc);
    });
}

exports.findDeparmentDetails = (id, callback)=>{
    Department.find({_id: id}).exec((err, doc)=>{
        if (err) return next(err);
        callback(doc);
    });
}

exports.delete = (req, res, next)=>{
    Department.deleteOne({_id: req.body.id}, function (err) {
        if (err) return handleError(err);
        // deleted at most one tank document
        res.send(true);
      });
}

module.exports.getDepartmentDetails = function(req, res){
    Department.find({_id: req.params.id}).exec(function(err, department){
      if(err){
        res.json({message: err})
        return;
      }
      res.status(200).json(department);   
    });
  }

  module.exports.update = function(req, res){
    let data = {
     name: req.body.name,
     slug: req.body.slug,
     code: req.body.code
   };
   Department.findByIdAndUpdate(req.body._id, data, function(err, data){
   if(err) return res.send(err);
   return res.json({ success:true, message: "department details has been updated!", data: data});
 });
   }