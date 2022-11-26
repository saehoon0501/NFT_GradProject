import { useState } from "react";
import "./style.css";

export const NFTAd = () => {
  const [number, setNumber] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const onChangeNumber = (event) => {
    const { value } = event.target;
    setNumber(value);
  };
  const onChangeImage = (event) => {
    const { file } = event.target;
    setImage(file);
  };
  const onChangeTitle = (event) => {
    const { value } = event.target;
    setTitle(value);
  };
  const onChangeUrl = (event) => {
    const { value } = event.target;
    setUrl(value);
  };

  const onClickSubmit = () => {
    console.log(number);
    console.log(image);
    console.log(title);
    console.log(url);
  };

  return (
    <div className="NFTAd-wrapper">
      <h1 className="NFTAd-title">NFT 광고판 등록</h1>
      <div className="NFTAd-contents">
        <div className="NFTAd-content">
          <p className="NFTAd-content-title">Square Number</p>
          <input
            onChange={onChangeNumber}
            className="NFTAd-content-input"
            type="text"
          />
        </div>
        <div className="NFTAd-content">
          <p className="NFTAd-content-title">Image</p>
          <input
            onChange={onChangeImage}
            className="NFTAd-content-file"
            type="file"
            name=""
            id=""
          />
        </div>
        <div className="NFTAd-content">
          <p className="NFTAd-content-title">Title</p>
          <input
            onChange={onChangeTitle}
            className="NFTAd-content-input"
            type="text"
          />
        </div>
        <div className="NFTAd-content">
          <p className="NFTAd-content-title">URL</p>
          <input
            onChange={onChangeUrl}
            className="NFTAd-content-input"
            type="text"
          />
        </div>
      </div>
      <button onClick={onClickSubmit} className="NFTAd-submit-btn">
        Submit
      </button>
    </div>
  );
};
