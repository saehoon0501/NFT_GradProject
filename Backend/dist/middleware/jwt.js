"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const verify = (req, res, next) => {
    const token = req.headers.authorization;
    try {
        // verify를 통해 값 decode!
        res.locals.decoded = jsonwebtoken_1.default.verify(token.split(" ")[1], config_1.default.secretKey);
    }
    catch (err) {
        if (err.message === "jwt expired") {
            console.log("expired token");
            return res.status(401).send("TOKEN_EXPIRED");
        }
        else if (err.message === "invalid token") {
            console.log("invalid token:", err);
            return res.status(401).send("TOKEN_INVALID");
        }
        else {
            console.log("else:", err);
            return res.status(401).send("TOKEN_INVALID");
        }
    }
    next();
};
exports.verify = verify;
