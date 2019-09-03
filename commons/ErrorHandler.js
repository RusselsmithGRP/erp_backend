exports.errorHandler = (err, code, req, res, next, message) => {
  if (err || res.status(code) || req.xhr) {
    return res
      .status(code)
      .send({ success: false, message: message || err.message });
  } else {
    next(err);
  }
};
