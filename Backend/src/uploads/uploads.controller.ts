import { Service } from "typedi";
import { controller } from "../decorators";
import { IUploadService } from "./uploads.service";

@controller("/uploads")
@Service()
class UploadController {
  constructor(private uploadService: IUploadService) {}
  // public static upload = uploadService.upload;

  public static returnURL = (req, res, next): void => {
    if (req.file.filename === undefined) next(new Error("File Not Found"));

    const IMG_URL = `http://localhost:4000/uploads/${req.file.filename}`;
    res.send(IMG_URL);
  };
}
