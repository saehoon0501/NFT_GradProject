import { Inject, Service } from "typedi";
import { controller, post, use } from "../decorators";
import { IUploadService } from "./uploads.service";
import { NextFunction, Response, Request } from "express";
import { verify } from "../middleware/jwt";
import { uploadMultipleFiles } from "../middleware/uploader";

@controller("/uploads")
@Service()
class UploadController {
  constructor(@Inject("UploadService") private uploadService: IUploadService) {}

  @post("")
  @use(verify)
  @use(uploadMultipleFiles)
  // @use(this.uploadService.uploadMultipleFiles)
  uploadFiles(req: Request, res: Response, next: NextFunction) {
    return res.send({ result: "OK" });
  }

  // public static returnURL = (req, res, next): void => {
  //   if (req.file.filename === undefined) next(new Error("File Not Found"));

  //   const IMG_URL = `http://localhost:4000/uploads/${req.file.filename}`;
  //   res.send(IMG_URL);
  // };
}
