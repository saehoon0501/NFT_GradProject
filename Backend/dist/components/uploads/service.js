"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
class uploadService {
}
_a = uploadService;
uploadService.storage = multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, "../public/uploads"); //파일 저장 위치
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
        const ext = path_1.default.extname(file.originalname); // 파일의 확장자
        // 파일명이 절대 겹치지 않도록 해줘야한다.
        // 파일이름 + 현재시간밀리초 + 파일확장자명
        cb(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
    },
});
uploadService.fileFilter = (req, file, cb) => {
    if (_a.checkFileType(file) &&
        _a.checkFileSize(req.headers["content-length"])) {
        cb(null, true);
    }
    else {
        cb(new Error("Only can upload jpg/jpeg/png/gif"));
    }
};
uploadService.upload = (0, multer_1.default)({
    storage: _a.storage,
    fileFilter: _a.fileFilter,
});
uploadService.checkFileType = (file) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/gif")
        return true;
    return false;
};
uploadService.checkFileSize = (fileSize) => {
    if (fileSize <= 30 * 1024 * 1024) {
        return true;
    }
    return false;
};
exports.default = uploadService;
