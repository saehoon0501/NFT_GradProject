import jwt from "jsonwebtoken";
const keys = require("../config/keys");

const verify = (req, res, next) => {
  const token = req.cookies.token;
  try {
    res.locals.decoded = jwt.verify(token, keys.JWT_SECRET as string);
  } catch (err: any) {
    if (err.message === "jwt expired") {
      console.log("expired token");
      return res.status(401).send("TOKEN_EXPIRED");
    } else if (err.message === "invalid token") {
      console.log("invalid token:", err);
      return res.status(401).send("TOKEN_INVALID");
    } else {
      console.log("else:", err);
      return res.status(401).send("TOKEN_INVALID");
    }
  }
  next();
};

export { verify };
