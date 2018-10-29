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
    department.save(function (err,result) {
        if (err) return next(err);
        // saved!
        res.json({ 
            success:true, message: "New department created!", result: result});

      });
}

exports.delete = (req, res, next)=>{
    Department.deleteOne({_id: req.body.id}, function (err) {
        if (err) return handleError(err);
        // deleted at most one tank document
        res.send(true);
      });
}