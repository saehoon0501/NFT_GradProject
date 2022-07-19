import "./Profile.css"
import img from "./images/user.png";
import { useRef, useState } from "react";

const ProfilePic = () => {
    const [pic, setPic] = useState(img);

    const inputFile = useRef(null);

    const handlePic = () => {
        inputFile.current.click();
    };

    return(
        <div className="profile-info">
            <input type="file" style={{display:"none"}} ref={inputFile} onChange={(event)=>{setPic(URL.createObjectURL(event.target.files[0]))}} />
            <img src={pic} onClick={handlePic} style={{width:"450px", borderRadius:"20px"}}/>
        </div>
    );
}

const ProfileCaption = () => {
    
    const [caption, setCaption] = useState("안녕하세훈");
    const [ProfileName, setProfileName] = useState("");
    const [edit, setEdit] = useState(true);

    return(
        <div className="profile-info profile-about" style={{ width:"400px",padding:"1% 5%"}}>
            <div style={{display:"flex"}}>
                {edit?
                <h2>byun_0501</h2>
                :<input type={"text"}>

                </input>
                }  
                <input style={{fontSize:"16px", padding:"0 16px", margin:"auto", backgroundColor:"white",
                    border:"0", borderRadius:"2pt", 
                    boxShadow:"0 0 0 1px lightgray"}} onClick={edit?()=>{setEdit(false)}:()=>{setEdit(true)}} type="button" value="프로필 편집"/>
            </div>
            <div className="profile-text">
                <h3>게시물 3</h3>
                <h3 style={{color:"blue"}}>RGB 100</h3>
            </div>
            <div>
                
            </div>
            <div>
            {edit?
                <span>
                   {caption}
                </span>
            :<textarea>

            </textarea>
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