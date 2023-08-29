import uploadService from "./service";

class uploadController {
  public static upload = uploadService.upload;

  public static returnURL = (req, res, next): void => {
    if (req.file.filename === undefined) next(new Error("File Not Found"));

    const IMG_URL = `http://localhost:4000/uploads/${req.file.filename}`;
    res.send(IMG_URL);
  };
}

export default uploadController;
