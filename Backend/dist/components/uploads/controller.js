"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = __importDefault(require("./service"));
class uploadController {
}
uploadController.upload = service_1.default.upload;
uploadController.returnURL = (req, res, next) => {
    if (req.file.filename === undefined)
        next(new Error("File Not Found"));
    const IMG_URL = `http://localhost:4000/uploads/${req.file.filename}`;
    res.send(IMG_URL);
};
exports.default = uploadController;
