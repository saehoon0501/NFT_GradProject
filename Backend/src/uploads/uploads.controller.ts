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
    console.log(req.file);
    if (!req.file) {
      return res.status(422).send("file does not exits");
    }
    console.log(req.file);
    const IMG_URL = `http://localhost:4000/images/${req.file.filename}`;
    return res.send(IMG_URL);
  }
}
