import { Inject, Service } from "typedi";
import { controller, post, use } from "../decorators";
import { IUploadService } from "../posts/uploads.service";
import { NextFunction, Response, Request } from "express";
import { verify } from "../middleware/verify";
import { uploadSingleFile } from "../middleware/uploader";

@controller("/uploads")
@Service()
class UploadController {
  constructor(@Inject("UploadService") private uploadService: IUploadService) {}

  @post("/")
  @use(uploadSingleFile())
  @use(verify)
  uploadFile(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      return res.status(422).send("file does not exits");
    }

    const IMG_URL = `images/${req.file.filename}`;
    return res.send(IMG_URL);
  }
}
