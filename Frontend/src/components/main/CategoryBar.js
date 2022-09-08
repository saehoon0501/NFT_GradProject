import home from "../../assets/home.png";
import illustrate from "../../assets/illustrate.png";
import chat from "../../assets/chat.png";
import nft from "../../assets/nft.png";

import "./CategoryBar.css";

export const CategoryBar = () => {
  return (
    <div className="categoryBar_wrapper">
      <div style={{ margin: "0 0 10px 0" }}>
        <span>Feeds</span>
      </div>
      <div style={{ display: "flex", margin: "0 0 5px 5px" }}>
        <div>
          <img src={home} alt="home_icon" />
        </div>
        <div style={{ position: "relative", margin: "4px 0 0 4px" }}>
          <span>Home</span>
        </div>
      </div>
      <div style={{ margin: "10px 0 10px 0" }}>
        <span>Explore</span>
      </div>
      <div style={{ display: "flex", margin: "0 0 5px 5px" }}>
        <div>
          <img src={illustrate} alt="home_icon" />
        </div>
        <div style={{ position: "relative", margin: "4px 0 0 4px" }}>
          <span>일러스트</span>
        </div>
      </div>
      <div style={{ display: "flex", margin: "0 0 5px 5px" }}>
        <div>
          <img src={chat} alt="home_icon" />
        </div>
        <div style={{ position: "relative", margin: "4px 0 0 4px" }}>
          <span>자유</span>
        </div>
      </div>
      <div style={{ display: "flex", margin: "0 0 5px 5px" }}>
        <div>
          <img src={nft} alt="home_icon" />
        </div>
        <div style={{ position: "relative", margin: "4px 0 0 4px" }}>
          <span>NFT</span>
        </div>
      </div>
    </div>
  );
};