import { NFTLogin } from "../../components/login/Web3Client";
import { dummyNFTBoxData } from "../../utils/dummyData";

import "./style.css";

dummyNFTBoxData.map((row) => {
  row.map((col) => {
    console.log(col);
  });
});

export const Login = () => {
  const onClickNFTBox = (row, col) => {
    console.log(`Row:${row}, Col:${col}`);
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        {dummyNFTBoxData.map((row, rowIndex) => (
          <div key={rowIndex} className="nft-box-row">
            {row.map((col, colIndex) =>
              col === 0 ? (
                <div
                  key={rowIndex + colIndex + ""}
                  onClick={() => onClickNFTBox(rowIndex, colIndex)}
                  className="nft-box"
                >
                  <div className="nft-box-inner"></div>
                </div>
              ) : col.imgUrl === "" && col.link === "" ? (
                <div key={rowIndex + colIndex + ""} className="nft-box-blank" />
              ) : (
                <a className="nft-box-link" href={col.link} target="_blank">
                  <img
                    className="nft-box-img"
                    src={col.imgUrl}
                    alt={col.imgUrl}
                  />
                </a>
              )
            )}
          </div>
        ))}
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
