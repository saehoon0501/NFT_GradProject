import { Request, RequestHandler } from "express";
import multer, { DiskStorageOptions } from "multer";
import path from "path";

const storage = multer.diskStorage(getDiskStorageOptions());
const uploader = multer(getMulterOptions());

function uploadSingleFile(): RequestHandler {
  return uploader.single("file");
}

function getMulterOptions(): multer.Options {
  return {
    storage: storage,
    fileFilter: fileFilter,
  };
}

function getDiskStorageOptions(): DiskStorageOptions {
  return {
    destination(req: Request, file, callback) {
      callback(null, "public/images"); //파일 저장 위치
      console.log(file);
      console.log(req);
    },
    // 저장할 이미지의 파일명
    filename(req, file, callback) {
      const ext = path.extname(file.originalname); // 파일의 확장자
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      callback(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  };
}

function fileFilter(req, file, callback: Function) {
  if (checkFileType(file) && checkFileSize(req.headers["content-length"])) {
    callback(null, true);
  } else {
    callback(new Error("Only can upload jpg/jpeg/png/gif"));
  }
}

function checkFileType(file) {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  )
    return true;

  return false;
}

function checkFileSize(fileSize: number) {
  const MAXFILESIZE = 30 * 1024 * 1024;
  if (fileSize <= MAXFILESIZE) {
    return true;
  }
  return false;
}

export { uploadSingleFile };
