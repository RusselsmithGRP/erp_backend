const jwt = require("jsonwebtoken");
const secretOrKey = require("../config/secret");

exports.generateReqNo = (prefix, dept = "", id) => {
  const idsubstr = id.substring(id.length - 6);
  return prefix + "/" + dept + "/" + idsubstr;
};

exports.generateLink = (link, id) => {
  return process.env.PUBLIC_URL + link + id;
};

/**
 * @author Idowu
 * @summary Generate Inventory asset code
 */
exports.generateInvNo = (dept, category, type, date, id) => {
  const idsubstr = id.substring(id.length - 6);
  const newCat = category.split("")[0] + "" + category.split("")[1];
  const newDate = date.split("T")[0];
  let year = newDate.split("-")[0];
  let day = newDate.split("-")[2];
  let newYear = year.split("0")[1];
  const getDate = day + "" + newYear;
  let newDept = dept.substring(0, 4);
  return `RSG/${newDept}/${newCat}/${type}/${getDate}/${idsubstr}`;
};

/**
 * @author Idowu
 * @implements `jsonwebtoken`
 * @function return jwt
 * @returns `token`
 * @summary Utility function for token generation
 */
exports.generateToken = data => {
  const token = jwt.sign(data, secretOrKey, { expiresIn: "1h" }); // Set Expiration of an hour
  return token;
};

/**
 * @author Idowu
 * @implements `jsonwebtoken`
 * @function return decoded payload
 * @returns `payload`
 * @summary Utility function for decoding token
 */
exports.verifyToken = token => {
  jwt.verify(token, secretOrKey, (err, decoded) => {
    if (err) {
      return err;
    }
    return decoded;
  });
};
