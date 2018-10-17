var mongoose = require('mongoose');
var Role = mongoose.model('role');

exports.index = (req, res, next)=>{
    Role.find().exec((err, docs)=>{
        if (err) return next(err);
        else res.send(docs);
    });
}


exports.add = (req, res, next)=>{
    const data = req.body;
    let role = new Purchase(data);
    role.permission = [];
    role.save(function (err,result) {
        if (err) return next(err);
        // saved!
        res.send(result);
      });
}