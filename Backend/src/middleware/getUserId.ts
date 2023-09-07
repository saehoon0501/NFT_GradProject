import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
const keys = require("../config/keys");

const getUserId = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    next();
  }
  res.locals.decoded = parseJwt(token);
  next();
};

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

export { getUserId };
