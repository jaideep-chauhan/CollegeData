const jwtSecret = "qwertyuioasdfghjklzxcvbnmklkjsf";
const jwt = require("jsonwebtoken");
module.exports.verifyToken = function verifyToken(req, res, next) {
  // check header or url parameters or post parameters for token
  // if (BYPASS_TOKEN_ROUTE.includes(req.url)) {
  //   return next();
  // }
  const { token } = req.headers;
  if (!token) return res.status(400).send({ message: "No token provided." });
  // verifies secret and checks exp
  jwt.verify(token, jwtSecret, function (err, decoded) {
    if (err || !decoded) {
      return res.status(STATUS_CODES.NOT_AUTHENTICATED).send({
        message: "User session expired, Please log in again!",
      });
    } else {
      // console.log("decoded it is",decoded)
      req.email = decoded.user.email;
      req.name = decoded.user.name;
      req.id = decoded.user.id;
      req.isAdmin = decoded.user.isAdmin;
      req.role = decoded.user.role;
      // req.email = decoded.email;
      // req.firstName = decoded.firstName;
      // req.lastName = decoded.lastName;
      // req.username = decoded.username;
      // req.userId = ObjectId(decoded._id); //To Do : change this to id
      // req.user = ObjectId(decoded.userId); //To Do : change this to userId
      // req.prospectId = ObjectId(decoded.prospectId);
      // req.role = decoded.roleId;
      // req.userType = decoded.userType;
      // req.salePersonId = decoded.userType === USER_TYPE_OBJECT.PROSPECT ? ObjectId(decoded.salePersonId) : null;
      next();
      // client
      //   .getAsync(KEY_TYPE_PREFIXES.USER_TOKEN + RESOURCE_TYPES.NORMAL_USER + decoded._id.toString())
      //   .then((reply) => {
      //     if (!reply) {
      //       return res.status(STATUS_CODES.NOT_AUTHENTICATED).send({ message: "User is not Authenticated." });
      //     } else if (reply !== token) {
      //       return res
      //         .status(STATUS_CODES.NOT_AUTHENTICATED)
      //         .send({ message: "User session expired, Please log in again!" });
      //     } else {
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error in jwt : ", error);
      //     return res.status(STATUS_CODES.NOT_AUTHENTICATED).send({ message: "User is not Authenticated." });
      //   });
    }
  });
};
