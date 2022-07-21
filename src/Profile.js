import "./Profile.css"
import img from "./images/user.png";
import { useEffect, useRef, useState } from "react";

const ProfilePic = () => {
    const [pic, setPic] = useState(img);

    const inputFile = useRef(null);

    const handlePic = () => {
        inputFile.current.click();
    };

    return(
        <div className="profile-info clickable-img">
            <input type="file" style={{display:"none"}} ref={inputFile} onChange={(event)=>{setPic(URL.createObjectURL(event.target.files[0]))}} />
            <img src={pic} onClick={handlePic} style={{width:"450px", borderRadius:"20px"}}/>
            <p className="description">이미지 수정</p>
        </div>
    );
}

const ProfileCaption = () => {
    
    const [caption, setCaption] = useState("안녕하세훈");
    const [profileName, setProfileName] = useState("0xbe38d61731FB86D9A981f38F1bD73b106E80ce32");
    const [edit, setEdit] = useState(true);

    const nameRef = useRef(profileName);
    const captionRef = useRef(caption);

    const update = () => {
        nameRef.current = profileName;
        captionRef.current = caption;
        setEdit(true);
    }

    const updateNot = () => {
        setEdit(true);
        setProfileName(nameRef.current);
        setCaption(captionRef.current);
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
                    <h3>게시물 3</h3>
                    <h3 style={{color:"blue"}}>RGB 100</h3>
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


export const Profile = () => {

    const [posts, setPosts] = useState([]);

    return(
        <div className="app">
            <div className="profile-container">
                <div className="profile-content">
                    <div className="profile-wrapper">
                        <ProfilePic/>
                        <ProfileCaption/>
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