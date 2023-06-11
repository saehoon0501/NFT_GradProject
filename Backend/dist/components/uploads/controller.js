"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
class uploader {
}
uploader.upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        // 저장할 장소
        destination(req, file, cb) {
            cb(null, "public/uploads");
        },
        // 저장할 이미지의 파일명
        filename(req, file, cb) {
            const ext = path_1.default.extname(file.originalname); // 파일의 확장자
            console.log("file.originalname", file.originalname);
            // 파일명이 절대 겹치지 않도록 해줘야한다.
            // 파일이름 + 현재시간밀리초 + 파일확장자명
            cb(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});
uploader.returnURL = (req, res, next) => {
    const IMG_URL = `http://localhost:4000/uploads/${req.file.filename}`;
    console.log(IMG_URL);
    res.send(IMG_URL);
};
exports.default = uploader;
