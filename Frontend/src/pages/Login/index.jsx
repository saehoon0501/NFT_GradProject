import React from "react";
import { useRecoilState } from "recoil";

import { mintToken, NFTLogin } from "../../components/login/Web3Client";
import { mintedState } from "../../store";

import Logo from "../../assets/logo.png";
import "./style.css";

export const Login = () => {
  const [minted, setMinted] = useRecoilState(mintedState);

  const onClickMintToken = () => {
    mintToken()
      .then((tx) => {
        console.log(tx);
        setMinted(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClickNFTBox = (row, col) => {
    console.log(`Row:${row}, Col:${col}`);
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((row) => (
          <div key={row} className="nft-box-row">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((col) => (
              <div
                key={row + col}
                onClick={() => onClickNFTBox(row, col)}
                className="nft-box"
              ></div>
            ))}
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
