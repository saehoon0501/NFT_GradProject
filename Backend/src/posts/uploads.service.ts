import { unlink, createReadStream, statSync } from "node:fs";
import Container from "typedi";
import { IUploadRepository } from "./repositories/uploads.repository";

interface IUploadService {
  uploadToS3(files: string[]): (Promise<unknown> | undefined)[];
  clearUploadedFiles(files: string[]): void;
  getEmbeddedImage(content: string): string[];
  convertURL(content: string): string;
  deleteFromS3(files: string[]): Promise<unknown>;
}

class UploadService implements IUploadService {
  uploadFilePromises: [];

  constructor(private uploadRepository: IUploadRepository) {
    this.uploadFilePromises = [];
  }
  deleteFromS3(files: string[]): Promise<unknown> {
    return this.createDeletePromise(files);
  }
  convertURL(content: string): string {
    return content.replaceAll(
      /src\s*=\s*"(.+?\/images\/)/g,
      'src="https://my-bucket-byun.s3.ap-northeast-2.amazonaws.com/public/images/'
    );
  }

  getEmbeddedImage(content: string): string[] {
    const result = content.split(/images\/(.+?)"/);
    return result
      .filter((filename, index) => index % 2 !== 0)
      .map((filename) => "public/images/" + filename);
  }

  uploadToS3(files: string[]) {
    return files.map((file) => {
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
      const params = {
        Bucket: "my-bucket-byun",
        Key: decodeURIComponent(key.replace(/\+/g, " ")),
        ContentType: fileType,
        Body: createReadStream(file),
      };
      return this.uploadRepository.putObject(params);
    }
    return Promise.reject();
  }

  private createDeletePromise(fileKeys: string[]) {
    const params = {
      Bucket: "my-bucket-byun",
      Delete: {
        Objects: fileKeys.map((filekey) => {
          return { Key: filekey };
        }),
      },
    };
    return this.uploadRepository.deleteObjects(params);
  }

  private getFileType(file: string) {
    if (file.includes(".jpg")) return "image/jpg";
    else if (file.includes(".jpeg")) return "image/jpeg";
    else if (file.includes(".png")) return "image/png";
    else if (file.includes(".gif")) return "image/gif";
    else return "invalid";
  }
}

Container.set(
  "UploadService",
  new UploadService(Container.get("UploadRepository"))
);

export { IUploadService };
