import S3 from "aws-sdk/clients/s3";
const keys = require("../config/keys");
import { unlink, createReadStream } from "node:fs";
import Container from "typedi";

interface IUploadService {
  uploadToS3(fileKey: string, files: Express.Multer.File[]): Promise<any>[];
  clearUploadedFiles(files: Express.Multer.File[]): void;
}

class UploadService implements IUploadService {
  s3: S3;
  uploadFilePromises: [];

  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: keys.accessKeyId,
        secretAccessKey: keys.secretAccessKey,
      },
      region: "ap-northeast-2",
    });
    this.uploadFilePromises = [];
  }

  uploadToS3(fileKey: string, files: Express.Multer.File[]) {
    return files.map((file) => this.createUploadPromise(fileKey, file));
  }

  clearUploadedFiles(files: Express.Multer.File[]) {
    files.forEach((file) =>
      unlink(file.path, (err) => {
        if (err) throw err;
        console.log("path/file.txt was deleted");
      })
    );
  }

  private createUploadPromise(key: string, file: Express.Multer.File) {
    return new Promise(async (resolve, reject) => {
      const params = {
        Bucket: "my-bucket-byun",
        Key: key,
        ACL: "public-read",
        Body: createReadStream(file.path),
        ContentType: file.mimetype,
      };

      await this.s3.upload(
        params,
        function (err: Error, data: S3.ManagedUpload.SendData) {
          if (err) {
            reject(err);
          }
          console.log(`File uploaded successfully at ${data.Location}`);
          resolve(data.Location);
        }
      );
    });
  }
}

Container.set("UploadService", new UploadService());

export { IUploadService };
