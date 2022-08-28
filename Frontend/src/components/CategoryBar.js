import home from "../images/home.png";
import star from "../images/star.png";
import illustrate from "../images/illustrate.png";
import chat from "../images/chat.png";
import nft from "../images/nft.png";


export const CategoryBar = () =>{

    return(<div style={{display:"block", position:"fixed", padding:"10px", border:"1px solid lightgray", width:"180px",height:"210px",
    textAlign:"left", top:"75px", margin:"0 -200px"}}>
        <div style={{margin:"0 0 10px 0"}}>
            <span>Feeds</span>
        </div>
        <div style={{display:"flex", margin:"0 0 5px 5px"}}>
            <div>
            <img src={home} alt="home_icon" />
            </div>
            <div style={{position:"relative", margin:"4px 0 0 4px"}}>
            <span>Home</span>
            </div>
        </div>
        {/* <div style={{display:"flex", margin:"0 0 5px 5px"}}>
            <div>
            <img src={star} alt="home_icon" />
            </div>
            <div style={{position:"relative", margin:"4px 0 0 4px"}}>
            <span>Popular</span>
            </div>
        </div> */}
        <div style={{margin:"10px 0 10px 0"}}>
            <span>Explore</span>
        </div>
        <div style={{display:"flex", margin:"0 0 5px 5px"}}>
            <div>
                <img src={illustrate} alt="home_icon"/>
            </div>
            <div style={{position:"relative", margin:"4px 0 0 4px"}}>
                <span>일러스트</span>
            </div>
        </div>
        <div style={{display:"flex", margin:"0 0 5px 5px"}}>
            <div>
            <img src={chat} alt="home_icon" />
            </div>
            <div style={{position:"relative", margin:"4px 0 0 4px"}}>
            <span>자유</span>
            </div>
        </div>
        <div style={{display:"flex", margin:"0 0 5px 5px"}}>
            <div>
                <img src={nft} alt="home_icon" />
            </div>
            <div style={{position:"relative", margin:"4px 0 0 4px"}}>
                <span>NFT</span>
            </div>
        </div>
    </div>);

}