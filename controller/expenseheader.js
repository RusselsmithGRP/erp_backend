var mongoose = require('mongoose');
var ExpenseHeader = mongoose.model('Expenseheader');

exports.index = (req, res, next)=>{
  ExpenseHeader.find().exec((err, docs)=>{
      if (err) return next(err);
      else res.send(docs);
  });
}

exports.add = (req, res) => {
  const data = req.body;
  let expenseHeader = new ExpenseHeader(data);
  if (expenseHeader.name && expenseHeader.slug && expenseHeader.department) {
    expenseHeader.save(function (err) {
      if (err) return res.json({ success:false, message: "An error occured!"});
      // saved!
      return res.json({ success:true, message: "New Expense Header Created!"});
  });
}
else return res.json({ success:false, message: "An error occured!"});
}