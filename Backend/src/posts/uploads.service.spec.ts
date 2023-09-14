import { Container } from "typedi";
import { IUploadRepository } from "./repositories/uploads.repository";
Container.set("UploadRepository", {
  putObject: jest.fn((options) => {
    return;
  }),

  deleteObjects: jest.fn((options) => {
    return;
  }),
});
import "./uploads.service";
import { IUploadService } from "./uploads.service";
const uploadService = Container.get("UploadService") as IUploadService;

let input: string;
describe("Given the input file, test convertURL and getEmbeddedImage", () => {
  it("test convertURL for single image", () => {
    const input =
      '<p><img class="ql-image" src="https://localhost:4000/public/images/iPhone 7 Plus2099.JPG1694251338722.jpg"/></p>';
    expect(uploadService.convertURL(input)).toBe(
      '<p><img class="ql-image" src="https://my-bucket-byun.s3.ap-northeast-2.amazonaws.com/public/images/iPhone 7 Plus2099.JPG1694251338722.jpg"/></p>'
    );
  });

  it("test getEmbeddedImage for single image", () => {
    const input =
      '<p><img class="ql-image" src="https://localhost:4000/public/images/iPhone 7 Plus2099.JPG1694251338722.jpg"/></p>';
    expect(uploadService.getEmbeddedImage(input)).toEqual([
      "public/images/iPhone 7 Plus2099.JPG1694251338722.jpg",
    ]);
  });

  it("test convertURL for multiple images", () => {
    const input =
      '<p><img class="ql-image" src="https://localhost:4000/public/images/AWS Certified Solutions Architect - Associate certificate.jpg"/></p><p><img class="ql-image" src="https://localhost:4000/public/images/iPhone 7 Plus2099.JPG1694251338722.jpg"/></p>';
    expect(uploadService.convertURL(input)).toBe(
      '<p><img class="ql-image" src="https://my-bucket-byun.s3.ap-northeast-2.amazonaws.com/public/images/AWS Certified Solutions Architect - Associate certificate.jpg"/></p><p><img class="ql-image" src="https://my-bucket-byun.s3.ap-northeast-2.amazonaws.com/public/images/iPhone 7 Plus2099.JPG1694251338722.jpg"/></p>'
    );
  });

  it("test getEmbeddedImage for multiple images", () => {
    const input =
      '<p><img class="ql-image" src="https://localhost:4000/public/images/AWS Certified Solutions Architect - Associate certificate.jpg"/></p><p><img class="ql-image" src="https://localhost:4000/public/images/iPhone 7 Plus2099.JPG1694251338722.jpg"/></p>';
    expect(uploadService.getEmbeddedImage(input)).toEqual([
      "public/images/AWS Certified Solutions Architect - Associate certificate.jpg",
      "public/images/iPhone 7 Plus2099.JPG1694251338722.jpg",
    ]);
  });
});
