const jwt = require("jsonwebtoken");
const config = require("../config");

const verify = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    // verify를 통해 값 decode!
    res.locals.decoded = jwt.verify(token.split(" ")[1], config.secretKey);
  } catch (err) {
    if (err.message === "jwt expired") {
      console.log("expired token");
      return res.status(401).send("TOKEN_EXPIRED");
    } else if (err.message === "invalid token") {
      console.log("invalid token");
      console.log(TOKEN_INVALID);
      return res.status(401).send("TOKEN_INVALID");
    } else {
      console.log("invalid token");
      return res.status(401).send("TOKEN_INVALID");
    }
  }
  next();
};

export { verify };
