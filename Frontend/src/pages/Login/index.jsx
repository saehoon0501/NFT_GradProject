import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { NFTLogin } from "../../components/login/Web3Client";
import "./style.css";

export const Login = () => {

  const [billboardData, setBillboard] = useState();
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [description, setDescription] = useState("");

  const billboard = useRef();
  const square = useRef();
  const tooltip = useRef();
  const whereToGo = useRef();

  const getRow = (event) => {
    var y = Math.floor((event.pageY - billboard.current.offsetTop) / 10);
    y = y <= 0 ? 0 : y >= 49 ? 49 : y;
    return y;
  }

  const getCol = (event) => {
    var x = Math.floor((event.pageX - billboard.current.offsetLeft) / 10);
    x = x <= 0 ? 0 : x >= 49 ? 49 : x;
    return x;
  }

  const onMouseHover = (event) => {
    var row = getRow(event);
    var col = getCol(event);
    const squareNumber = col + row*50 + 1;
    let title = "Square #" + squareNumber + "\r";

    if(billboardData[row][col].isOwned === false){

      billboard.current.style.cursor = "pointer";
      title = title + " is available for sale, click to buy.";
      
      setLeft(10*((squareNumber-1)%50)+ billboard.current.offsetLeft);
      setTop(10*Math.floor((squareNumber-1)/50)+ billboard.current.offsetTop);
      square.current.style.display = "block";
      whereToGo.current.removeAttribute("href", "");
    } else if(billboardData[row][col].isOwned === true && billboardData[row][col].link === ""){
      billboard.current.style.cursor = "not-allowed";
      title = title + " WAS PURCHASED BUT NOT YET PERSONALIZED";

      setLeft(10*((squareNumber-1)%50)+ billboard.current.offsetLeft);
      setTop(10*Math.floor((squareNumber-1)/50)+ billboard.current.offsetTop);
      square.current.style.display = "block";
      whereToGo.current.removeAttribute("href", "");
    }else{
      billboard.current.style.cursor = "pointer";
      title = title + billboardData[row][col].description;

      setLeft(10*((squareNumber-1)%50)+ billboard.current.offsetLeft);
      setTop(10*Math.floor((squareNumber-1)/50)+ billboard.current.offsetTop);
      square.current.style.display = "block";
      whereToGo.current.setAttribute("href", billboardData[row][col].link);
    }

    setDescription(title);
    tooltip.current.style.display = "block";
  };

  useEffect( async ()=>{
    const res = await axios.get("BillboardData.json");
    setBillboard(res.data);
  },[]);

  const closeTooltip = () => {
    square.current.style.display = "none";
    tooltip.current.style.display = "none";
  }

  return (
    <div className="login-wrapper">
     <a ref={whereToGo}>
      <div className="login-left">
        <img src="Billboard.png" ref={billboard} onMouseEnter={onMouseHover} onMouseMove={onMouseHover} onMouseOut={closeTooltip}/>
        
        <div ref={square}
          style={{background:"pink", opacity:"0.8", width:"10px", height:"10px", top, left,
          position:"absolute", pointerEvents:"none", display:"none"}}>              
          <div ref={tooltip} style={{position:"relative", color:"black", width:"140px",
          padding:"10px", top:"30px", fontSize:"1em", background:"white", opacity:"1", borderRadius:"20px"}}>{description}</div>
        </div>        
      </div>
      </a>     
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
