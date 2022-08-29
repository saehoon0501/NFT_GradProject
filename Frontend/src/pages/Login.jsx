import React from "react";
import { useRecoilState } from "recoil";
import { mintToken, NFTLogin } from "../components/Web3Client";
import { mintedState } from "../store";

const Login = () => {
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

  return (
    <div>
      <div className="app">
        {!minted ? (
          <button className="primary__button" onClick={onClickMintToken}>
            Mint Token
          </button>
        ) : (
          <p>Token Minted</p>
        )}
        <NFTLogin />
      </div>
    </div>
  );
};

export default Login;
