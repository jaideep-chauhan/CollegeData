const jwt = require('jsonwebtoken');
const config = require('./config');

const generateToken = async(user) => {
  try {
    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      config.JWT_SECRET
    );
    
  } catch (error) {
    console.log(error)
    return 000;
  }
};

const isAuth = async function(req, res, next){
  const bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).send({ message: 'Token is not supplied' });
  } else {
    const token = bearerToken.slice(7, bearerToken.length);
    try {
      jwt.verify(token, config.JWT_SECRET, (err, data) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = data;
         return next();
        }
      });
    } catch (error) {
    return res.send({err:`${error}`}) 
    }
  }
};
const isAdmin = async function(req, res, next){
  try {
    if (req.user && req.user.isAdmin) {
      return next();
    } else {
      res.status(401).send({ message: 'Token is not valid for admin user' });
    }
  } catch (error) {
    return res.send({err:`${error}`})
    
  }
  
};

module.exports = {
  generateToken,
  isAdmin,
  isAuth
}
