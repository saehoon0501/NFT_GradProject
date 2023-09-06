import { Request, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import multer, { DiskStorageOptions, StorageEngine, Field } from "multer";
import path from "path";
import { ParsedQs } from "qs";

abstract class IUploadService {
  protected storage: StorageEngine;
  protected uploader: multer.Multer;
  abstract uploadMultipleFiles(files: ReadonlyArray<Field>): RequestHandler;
}

class uploadService extends IUploadService {
  constructor() {
    super();
    this.storage = multer.diskStorage(this.getDiskStorageOptions());
    this.uploader = multer(this.getMulterOptions());
  }

  uploadMultipleFiles(files: ReadonlyArray<Field>): RequestHandler {
    return this.uploader.fields(files);
  }

  private getMulterOptions(): multer.Options {
    return {
      storage: this.storage,
      fileFilter: this.fileFilter,
    };
  }

  private getDiskStorageOptions(): DiskStorageOptions {
    return {
      destination(req: Request, file, callback) {
        callback(null, "../public/uploads"); //파일 저장 위치
      },
      // 저장할 이미지의 파일명
      filename(req, file, callback) {
        const ext = path.extname(file.originalname); // 파일의 확장자
        // 파일명이 절대 겹치지 않도록 해줘야한다.
        // 파일이름 + 현재시간밀리초 + 파일확장자명
        callback(
          null,
          path.basename(file.originalname, ext) + Date.now() + ext
        );
      },
    };
  }

  private fileFilter(req, file, callback: Function) {
    if (
      this.checkFileType(file) &&
      this.checkFileSize(req.headers["content-length"])
    ) {
      callback(null, true);
    } else {
      callback(new Error("Only can upload jpg/jpeg/png/gif"));
    }
  }

  private checkFileType(file) {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    )
      return true;

    return false;
  }

  private checkFileSize(fileSize: number) {
    const MAXFILESIZE = 30 * 1024 * 1024;
    //Magic number 수정
    if (fileSize <= MAXFILESIZE) {
      return true;
    }
    return false;
  }
}

export { IUploadService };
