import axios from "axios";
import { useEffect, useState } from "react";
import { NFTLogin } from "../../components/login/Web3Client";
import "./style.css";

export const Login = () => {

  const [squares, setSquares] = useState([]);

  const onClickNFTBox = (row, col) => {
    console.log(`Row:${row}, Col:${col}`);
  };

  useEffect( async ()=>{
    const BillboardData = await axios.get("BillboardData.json");    
    setSquares(BillboardData.data);
  },[]);

  return (
    <div className="login-wrapper">
      <div className="login-left">
      {squares.map((row,rowIndex)=>{
        return(
          <div key={rowIndex} className="nft-box-row">
          {row.map((col, colIndex) =>
              col.isOwned === false ? (
                <div
                  key={rowIndex + colIndex + ""}
                  onClick={() => onClickNFTBox(rowIndex, colIndex)}
                  className="nft-box"
                >
                  <div className="nft-box-inner"></div>
                </div>
              ) : col.link === "" ? (
                <div key={rowIndex + colIndex + ""} className="nft-box-blank" />
              ) : (
                <a className="nft-box-link" href={col.link} target="_blank">                  
                </a>
              )
            )}
          </div>
        );
      })
      }
      </div>
      <div className="login-service-wrapper">
        <p className="login-service-title">
          보유한 NFT를 사용해 NCC에 접속하세요.
        </p>
        <img
          className="login-service-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/800px-MetaMask_Fox.svg.png"
          alt="Metamask Logo"
        />
        <NFTLogin />
      </div>
    </div>
  );
};
