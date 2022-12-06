import { useState } from "react";
import {personalizeSquare} from "../../api/BillboardApi";
import "./style.css";

export const NFTAd = () => {
  const [number, setNumber] = useState("");
  const [rgbData, setRgbData] = useState("");
  const [url, setURL] = useState("");
  const [description, setDescription] = useState("");

  const onChangeNumber = (event) => {
    const { value } = event.target;
    setNumber(value);
  };

  const onChangeImage = (event) => {
    const reader = new FileReader();
    const canvas = document.getElementById("tcanvas");
    const context = canvas.getContext("2d");

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        context.drawImage(img, 0, 0, 10 , 10);
        let pixelData = [];
        const contextPixel = context.getImageData(0, 0 , 10, 10);
        
        for(let i = 0; i < contextPixel.data.length; i+=4){
          pixelData.push(contextPixel.data[i]);
          pixelData.push(contextPixel.data[i+1]);
          pixelData.push(contextPixel.data[i+2]);
        }        
        setRgbData(pixelData);
        context.drawImage(img, 0, 0, 100, 100);
      }
      img.src = event.target.result;            
    }

    reader.readAsDataURL(event.target.files[0]);
  };

  const onChangeUrl = (event) => {
    const { value } = event.target;
    setURL(value);
  };

  const onChangeDescription = (event) => {
    const { value } = event.target;
    setDescription(value);
  };

  const onClickSubmit = async () => {
    console.log(number, rgbData, url, description);
    const result = personalizeSquare(number, rgbData, url, description);
    console.log(result);
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
            id="input-image"
          />
        </div>
        <div className="NFTAd-content">
          <p className="NFTAd-content-title">미리보기</p>
          <canvas id="tcanvas" width="100px" height="100px"/>
        </div>
        <div className="NFTAd-content">
          <p className="NFTAd-content-title">링크 주소</p>
          <input
            onChange={onChangeUrl}
            className="NFTAd-content-input"
            type="text"
          />
        </div>
        <div className="NFTAd-content">
          <p className="NFTAd-content-title">설명</p>
          <input
            onChange={onChangeDescription}
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
