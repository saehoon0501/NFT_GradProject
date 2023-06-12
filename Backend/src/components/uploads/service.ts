import multer from "multer";
import path from "path";

class uploadService {
  public static storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "../public/uploads"); //파일 저장 위치
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일의 확장자
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  });

  public static fileFilter = (req, file, cb) => {
    if (
      this.checkFileType(file) &&
      this.checkFileSize(req.headers["content-length"])
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only can upload jpg/jpeg/png/gif"));
    }
  };

  public static upload = multer({
    storage: this.storage,
    fileFilter: this.fileFilter,
  });

  private static checkFileType = (file) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    )
      return true;

    return false;
  };

  private static checkFileSize = (fileSize: number) => {
    if (fileSize <= 30 * 1024 * 1024) {
      return true;
    }
    return false;
  };
}

export default uploadService;
