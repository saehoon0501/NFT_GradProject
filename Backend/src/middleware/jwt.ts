import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/dev";

const verify = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    // verify를 통해 값 decode!
    res.locals.decoded = jwt.verify(token.split(" ")[1], JWT_SECRET as string);
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
