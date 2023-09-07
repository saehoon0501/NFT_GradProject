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

  @post("/")
  @use(uploadMultipleFiles())
  @use(verify)
  uploadFiles(req: Request, res: Response, next: NextFunction) {
    console.log(req.files);
    if (!req.files || req.files.length === 0) {
      return res.status(422).send("file does not exits");
    }
    const imageFileKey = "Image";
    // Promise.all(
    //   this.uploadService.uploadToS3(
    //     imageFileKey,
    //     req.files as Express.Multer.File[]
    //   )
    // ).then((res) =>{
    //   console.log(res);
    // }
    //   this.uploadService.clearUploadedFiles(req.files as Express.Multer.File[])
    // );

    return res.send({ result: "OK" });
  }
}
