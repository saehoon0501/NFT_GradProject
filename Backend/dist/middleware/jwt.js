"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = void 0;
const jwt = require("jsonwebtoken");
const config = require("../config");
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    try {
        // verify를 통해 값 decode!
        res.locals.decoded = jwt.verify(token.split(" ")[1], config.secretKey);
    }
    catch (err) {
        if (err.message === "jwt expired") {
            console.log("expired token");
            return res.status(401).send("TOKEN_EXPIRED");
        }
        else if (err.message === "invalid token") {
            console.log("invalid token");
            console.log(TOKEN_INVALID);
            return res.status(401).send("TOKEN_INVALID");
        }
        else {
            console.log("invalid token");
            return res.status(401).send("TOKEN_INVALID");
        }
    }
    next();
});
exports.verify = verify;
