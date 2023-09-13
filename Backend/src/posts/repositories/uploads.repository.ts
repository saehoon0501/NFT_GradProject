import S3, { DeleteObjectsRequest, PutObjectRequest } from "aws-sdk/clients/s3";
import Container from "typedi";
const keys = require("../../config/keys");

interface IUploadRepository {
  putObject(options: object): Promise<any>;
  deleteObjects(options: object): Promise<any>;
}

class S3Repository implements IUploadRepository {
  constructor(private s3: S3) {}

  putObject(options: PutObjectRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.s3.putObject(options, (err, data) => {
        if (err) reject(err);
        resolve({ result: "OK" });
      });
    });
  }

  deleteObjects(options: DeleteObjectsRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      this.s3.deleteObjects(options, (err, data) => {
        if (err) reject(err);
        resolve({ result: "OK" });
      });
    });
  }
}

Container.set(
  "UploadRepository",
  new S3Repository(
    new S3({
      credentials: {
        accessKeyId: keys.accessKeyId,
        secretAccessKey: keys.secretAccessKey,
      },
      region: "ap-northeast-2",
    })
  )
);
export { IUploadRepository };
