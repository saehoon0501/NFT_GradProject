import S3 from "aws-sdk/clients/s3";
const keys = require("../config/keys");
import { unlink, createReadStream, statSync } from "node:fs";
import Container from "typedi";

interface IUploadService {
  uploadToS3(files: string[]): (Promise<unknown> | undefined)[];
  clearUploadedFiles(files: string[]): void;
  getEmbeddedImage(content: string): string[];
  convertURL(content: string): string;
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
  convertURL(content: string): string {
    return content.replace(
      /src\s*=\s*"(.+?\/images\/)/,
      'src="https://my-bucket-byun.s3.ap-northeast-2.amazonaws.com/public/images/'
    );
  }
  private getFileName(filepath: string): RegExpMatchArray | null {
    return filepath.match(/.+[^(?:.png|.jpg|.jpeg|.gif)]/);
  }

  getEmbeddedImage(content: string): string[] {
    const result = content.split(/images\/(.+?)"/);
    return result
      .filter((filename, index) => index % 2 !== 0)
      .map((filename) => "public/images/" + filename);
  }

  uploadToS3(files: string[]) {
    return files.map((file) => {
      // const fileKey = this.getFileName(file)?.at(0);

      return this.createUploadPromise(file, file);
    });
  }

  clearUploadedFiles(files: string[]) {
    files.forEach((filepath) =>
      unlink(filepath, (err) => {
        if (err) throw err;
        console.log(`path:${filepath} was deleted`);
      })
    );
  }

  private createUploadPromise(key: string, file: string) {
    const fileType = this.getFileType(file);
    if (fileType !== "invalid") {
      return new Promise((resolve, reject) => {
        const params = {
          Bucket: "my-bucket-byun",
          Key: key,
          ContentType: fileType,
          Body: createReadStream(file),
        };

        this.s3.putObject(params, (data) => {
          resolve("success");
        });
      });
    }
    return Promise.resolve();
  }

  private getFileType(file: string) {
    if (file.includes(".jpg")) return "image/jpg";
    else if (file.includes(".jpeg")) return "image/jpeg";
    else if (file.includes(".png")) return "image/png";
    else if (file.includes(".gif")) return "image/gif";
    else return "invalid";
  }
}

Container.set("UploadService", new UploadService());

export { IUploadService };
