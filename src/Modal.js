import { useState } from "react";
import "./Modal.css";
import Avatar from "@material-ui/core/Avatar";
import img from "./images/user.png";


export const showModal = () => {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
}

const Mycaption = () => {

    const [caption, setCaption] = useState("");

    const handlePost = (e) =>{
        setCaption(e.target.value);
        console.log(caption);
    }

    return(
        <div>
            <form>
                <textarea aria-label="문구입력..." placeholder="문구입력..." autoComplete="off" autoCorrect="off"
                onChange={(event)=>{handlePost(event)}}
                style={{padding:"10px",resize:"none",width:"100%", height:"300px", border: "0", outline:"none"}}></textarea>
            </form>
        </div>
    )
}

const ImageResize = (props) => {

    const [resize, resetSize] = useState(false);


    const handleSize = () => {
        resetSize(true);
    }

    return(
        <div id="ImgResize" class={resize? "modal-content2":"modal-content"}>
                <div style={{borderColor:"black", marginTop:"10px",width:"100%", height:"40px", 
                borderBottom: "solid 1px lightgray", alignItems:"center", justifyContent:"center"}}>
                    <span style={{marginRight:"10px", fontSize:"15px", color:"blueviolet"}}
                    class="close" onClick={handleSize}>{resize? "공유하기":"다음"}</span>
                    <h3 style={{marginLeft:"35px"}}>이미지 크기 조정</h3>
                </div>
                <div style={{display:"flex",width:"100%", height:"100%"}}>
                <div id="selectedImg" style={{width:"855px", height:"805px", borderRadius:"0 0 2ex 2ex",
                backgroundImage:`url(${URL.createObjectURL(props.img)})`,
                backgroundSize:"cover",
                backgroundRepeat:"no-repeat",
                backgroundPosition:"cetner"}}>
                </div>
                {resize&&<div style={{display:"block", width:"339px"}}>
                    <div style={{display:"flex", alignItems:"center", margin:"10px"}}>
                        <div>
                            <Avatar
                            className="post__avatar headerAva"
                            alt={"byun0501"}
                            src={img}
                            />
                        </div>
                        <div>
                        <h3>{"byun0501"}</h3>
                        </div>
                    </div>
                    <Mycaption/>
                </div>
                }
            </div>
        </div>
    )
}

export const Modal = () => {

    let modal = document.getElementById("myModal");

    const [selectedImage, setImage] = useState(null);

    const handleClose = () => {
        modal.style.display = "none";
        setImage(null);
    }

    window.onclick = (e) => {
        if(e.target == modal){
            modal.style.display="none";
            setImage(null)
            let resize = document.getElementById("ImgResize");
            resize.style.width = "600px";
        }
    }

    return(
            <div id="myModal" class="modal">
            {selectedImage==null
                ?<div id="ImgResize" class="modal-content">
                    <div style={{borderColor:"black", marginTop:"10px",width:"100%", height:"5%", 
                    borderBottom: "solid 1px lightgray"}}>
                        <span style={{marginRight:"10px"}} class="close" onClick={handleClose}>&times;</span>
                        <h3 style={{marginLeft:"30px"}}>이미지를 추가해주세요</h3>
                    </div>
                    <div>
                    <input
                        type="file"
                        class="modal-input"
                        onChange={(event)=>{
                            setImage(event.target.files[0]);
                        }}
                    />
                    </div>
                </div>
                :<ImageResize img={selectedImage}/>
            }
            </div>
    )
}
