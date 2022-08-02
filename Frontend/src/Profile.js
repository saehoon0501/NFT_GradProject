import "./Profile.css"
import img from "./images/user.png";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Modal.css";

const baseURL = "http://localhost:4000";

const token = window.localStorage.getItem("NFTLogin");

const ProfilePic = (props) => {
    
    
    return(
        <div className="profile-info clickable-img" onClick={props.handlePic}>
            <img src={props.profile_pic} style={{width:"450px", borderRadius:"20px"}}/>
            <p className="description">이미지 수정</p>
        </div>
    );
}

const ProfileCaption = (props) => {
    
    const [caption, setCaption] = useState(`${props.user_info.profile.caption}`);
    const [profileName, setProfileName] = useState(`${props.user_info.profile.username}`);
    const [edit, setEdit] = useState(true);

    const nameRef = useRef(profileName);
    const captionRef = useRef(caption);

    const update = async () => {
        nameRef.current = profileName;
        captionRef.current = caption;
        
        await axios.post(`${baseURL}/api/user`,  {caption, profileName}
        ,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then((res)=>{
            console.log(res.data);
        });

        setEdit(true);
    }

    const updateNot = () => {
        setProfileName(nameRef.current);
        setCaption(captionRef.current);
        setEdit(true);
    }

    return(
        <div className="profile-info profile-about" style={{ width:"400px", padding:"1% 5%"}}>
            <div style={{width:"100%", fontSize:"1.3em"}}>
                {edit?
                <div style={{display:"flex", width:"100%"}}>
                    <div style={{wordWrap:"break-word", width:"100%", marginRight:"auto"}}>
                        <h3>{nameRef.current}</h3>
                    </div>
                    <input className="clickable-input" onClick={()=>{ setEdit(false)}} type="button" value="프로필 편집"/>
                </div>
                :<div style={{display:"block", width:"100%"}}>
                    사용자 이름
                    <textarea onChange={(event)=>{setProfileName(event.target.value)}} value={profileName}
                        style={{width:"100%", wordWrap:"break-word", 
                        fontSize:"1.1em", fontWeight:"bolder",resize:"none", padding:"2%"}}/>
                </div>
                }
                
                <div className="profile-text">
                    <h3>게시물 {props.user_info.profile.post_ids.length}</h3>
                    <h3 style={{color:"blue"}}>RGB {props.user_info.profile.points}</h3>
                </div>
            </div>
                
            <div style={{fontSize:"1.3em"}}>
            {edit?
                <span>
                   {captionRef.current}
                </span>
            :<div>
            소개
            <textarea onChange={(event)=>{setCaption(event.target.value)}} value={caption}
                style={{width:"100%", height:"150px", resize:"none", fontSize:"1em"}}/>
            <div style={{display:"flex", margin:"auto", justifyContent:"center", margin:"5% auto"}}>
                    <input className=" clickable-input"  
                        onClick={update} type="button" value="확인"/>
                    <input className=" clickable-input" onClick={updateNot} type="button" value="취소"/>
                </div>
            </div>
            }
            </div>
        </div>

    );
}


export const Profile = (props) => {

    const [onClick, setOnClick] = useState(false);

    const pic = props.pic;
    const setPic = props.setPic;

    const handlePic = () => {
        setOnClick(true);
    };

    const handleClose = () => {
        setOnClick(false);
    }

    const updatePic = async (event) => {

        const profile_pic = event.target.src;

        await axios.post(`${baseURL}/api/user`, {profile_pic}
        ,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then((res)=>{
           if(res){
            console.log(res.data);
            setPic(event.target.src);
        }
        });
    };

    const ownedNFTs = props.user_info.ownerOfNFT.map((NFTs)=>{
        return( 
            NFTs.NFT_URL.map((NFT)=>{
               return(
                <div className="profile-info clickable-img" style={{margin:"0 3%"}}>
                    <img src={`${NFT}`} onClick={(event)=>updatePic(event)} alt={NFTs.collection_id}  style={{width:"250px", borderRadius:"20px"}}/>
                </div>
               )
            })
       );
   });
   
    return(
        <div className="app" id="profileWindow">
            <div className="profile-container">
                <div className="profile-content">
                    <div className="profile-wrapper">
                    <div id="myModal" class={onClick?"modal2":"modal"}>
                        <div id="ImgResize" class="modal-content">
                            <div style={{borderColor:"black", marginTop:"10px",width:"100%", height:"40px", 
                            borderBottom: "solid 1px lightgray", alignItems:"center", justifyContent:"center"}}>
                                <span style={{marginRight:"10px"}} class="close" onClick={handleClose}> &times;</span>
                                <h3 style={{marginLeft:"30px"}}>프로필 사진 NFT 선택 </h3>
                            </div>
                            <div style={{display:"flex", margin: "3% 0"}}>
                                {ownedNFTs}
                            </div>
                        </div>
                    </div>
                        <ProfilePic user_info={props.user_info} handlePic={handlePic} profile_pic={pic}/>
                        <ProfileCaption user_info={props.user_info}/>
                    </div>
                </div>
                <div className="profile-wrapper">
                    <div style={{width:"100%", height:"1px", borderBottom: "1px solid lightgray", margin:"3% auto"}}>
                        <div className="profile-post">
                            <h4>
                                게시물
                            </h4>
                        </div>
                        <div className="profile-post">
                            <img src={img} style={{width:"30%"}}/>
                            <img src={img} style={{width:"30%"}}/>
                            <img src={img} style={{width:"30%"}}/>                            
                        </div>
                    </div>                    
                </div>                
            </div>
            
        </div>
    );
}